"""
main.py  —  ArchTech RAG v3 (Fixed)
Changes vs v3 original:
  • /scan — explicitly clears both the JSON requirements folder AND ChromaDB
    (rag.index_requirements() now drop-recreates the collection, so old data
    can never bleed into a new scan).
  • /generate-chain-stream — the final done=True sentinel from
    generate_document_sections() is filtered out before it reaches the client;
    only the explicit chain_phase_done + all_done events signal phase/chain end.
  • /generate-diagram — import 're' moved to module level (was inline before).
  • Minor: HTTPException import used correctly everywhere.
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, List
import json, os, re, shutil

os.environ["TOKENIZERS_PARALLELISM"] = "false"

from extractor import extract_requirements, save_to_json, scan_folder
from rag import search_requirements, index_requirements
try:
    from uvicorn.protocols.utils import ClientDisconnected
except ImportError:
    # Fallback for environments where uvicorn is not the driver
    class ClientDisconnected(Exception): pass
from llm_handler import (
    generate_document,
    generate_document_sections,
    extract_context_for_next,
    generate_mermaid_block,
    get_document_llm,
)
from codegen import process_requirement_to_code

from config import UPLOAD_DIR, REQ_DIR, CODE_DIR, API_HOST, API_PORT

app = FastAPI(
    title="ArchTech RAG",
    version="3.0",
    description="A local-first RAG system for aerospace/defense embedded systems documentation and code generation."
)

# ─── Chain order ──────────────────────────────────────────────────────────────
CHAIN_TYPES = ["SyRS", "HRS", "SRS", "SDD"]

# ─── Pydantic models ──────────────────────────────────────────────────────────

class ScanRequest(BaseModel):
    folder_path: str

class GenerateRequest(BaseModel):
    requirement_ids:  list[str]
    user_query:       str = ""
    template_type:    str = "SyRS"
    prev_doc_context: Optional[str] = ""

class ChainRequest(BaseModel):
    requirement_ids: list[str]
    user_query:      str = ""

class DiagramRequest(BaseModel):
    requirement_ids: list[str]
    diagram_heading: str = "System Block Diagram"

class CodeRequest(BaseModel):
    requirement_ids: list[str]

class TraceabilityRequest(BaseModel):
    requirement_ids: list[str] = []

class RephraseRequest(BaseModel):
    text: str
    requirement_ids: list[str] = []
    style: str = "concise"

class ExportDocRequest(BaseModel):
    content: str
    doc_type: str

# ─── Helper ───────────────────────────────────────────────────────────────────

def _load_selected(ids: list[str]) -> list[dict]:
    """
    Load requirement JSON data from disk based on a list of requirement IDs.

    Args:
        ids (list[str]): List of unique requirement IDs (e.g., ['SYR-123', 'HRS-456']).

    Returns:
        list[dict]: List of requirement dictionaries loaded from requirements/ folder.
                    Silently skips IDs that do not exist or are malformed.
    """
    out = []
    for rid in ids:
        f = REQ_DIR / f"{rid}.json"
        if f.exists():
            try:
                with open(f, encoding="utf-8") as fp:
                    out.append(json.load(fp))
            except Exception:
                pass
    return out


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.post("/scan")
async def scan_directory(request: ScanRequest, background_tasks: BackgroundTasks) -> dict:
    """
    Scans a directory using a background task to avoid timeouts.
    """
    if not os.path.exists(request.folder_path):
        raise HTTPException(status_code=404, detail="Path does not exist.")
    
    background_tasks.add_task(_background_scan, request.folder_path)
    return {"status": "processing", "message": "Scan started in background"}

def _background_scan(folder_path: str):
    # ── Clean old requirements ──────────────────────────────────
    for f in REQ_DIR.glob("*.json"):
        f.unlink()
    
    # ── Extract ──────────────────────────────────────────
    reqs = scan_folder(folder_path)
    save_to_json(reqs)
    index_requirements()


@app.get("/keywords")
def list_keywords():
    from rag import get_global_keywords
    return get_global_keywords()


@app.get("/requirements")
def list_requirements():
    results = []
    for jf in REQ_DIR.glob("*.json"):
        try:
            data = json.loads(jf.read_text(encoding="utf-8"))
            results.append({
                "id":       data["id"],
                "text":     data["text"],
                "type":     data["type"],
                "source":   data.get("source", "Unknown"),
                "page":     data.get("page", 0),
                "keywords": data.get("keywords", []),
                "priority": data.get("priority", "Normal"),
                "category": data.get("category", "Functional"),
            })
        except Exception:
            pass
    return results

@app.get("/warehouse-list")
def list_warehouse_docs():
    """Lists files in the warehouse/knowledge directory."""
    from rag import list_warehouse_files
    return list_warehouse_files()


# ─── Single document (sync) ───────────────────────────────────────────────────

@app.post("/generate-document")
async def generate_doc(request: GenerateRequest) -> dict:
    selected = _load_selected(request.requirement_ids)
    # Directly await the now-async generate_document
    md = await generate_document(
        selected,
        request.user_query,
        request.template_type,
        request.prev_doc_context or "",
    )
    return {"markdown": md}


# ─── Single document streaming ────────────────────────────────────────────────

@app.post("/generate-document-stream")
async def generate_doc_stream(request: GenerateRequest):
    """SSE streaming — single document type."""
    selected = _load_selected(request.requirement_ids)

    async def event_stream():
        try:
            # Use async for to iterate over the async generator
            async for evt in generate_document_sections(
                selected,
                request.user_query,
                request.template_type,
                request.prev_doc_context or "",
            ):
                yield f"data: {json.dumps(evt)}\n\n"
        except ClientDisconnected:
            print("  ℹ️  Client disconnected during single stream.")

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":     "no-cache",
            "X-Accel-Buffering": "no",
            "Connection":        "keep-alive",
        },
    )

@app.post("/rephrase")
async def rephrase_section(request: RephraseRequest) -> dict:
    from llm_handler import rephrase_content
    selected = _load_selected(request.requirement_ids)
    suggestions = await rephrase_content(request.text, selected, request.style)
    return {"suggestions": suggestions}


# ─── Full document chain streaming ────────────────────────────────────────────

@app.post("/generate-chain-stream")
async def generate_chain_stream(request: ChainRequest) -> StreamingResponse:
    """
    Full document generation chain: SyRS → HRS → SRS → SDD with context handoff.
    Streams back individual sections as SSE events.

    Workflow:
        1. For each document type in CHAIN_TYPES:
           a. Fills sections using LLM and relevant requirements.
           b. Extracts summary context from the result.
           c. Passes context to the next document in the chain.
        2. Emits 'chain_phase_done' event after each document.
        3. Emits 'all_done' event when entire chain is complete.

    Args:
        request (ChainRequest): Selected requirement IDs and optional global user query.

    Returns:
        StreamingResponse: text/event-stream of JSON events.
    """
    from uvicorn.protocols.utils import ClientDisconnected
    selected = _load_selected(request.requirement_ids)

    async def chain_stream():
        try:
            prev_context = ""

            for doc_type in CHAIN_TYPES:
                doc_md = ""

                async for evt in generate_document_sections(
                    selected,
                    request.user_query,
                    doc_type,
                    prev_context,
                ):
                    if evt.get("done"):
                        continue
                    
                    if "content" in evt and evt["content"]:
                        doc_md += evt["content"]
                    
                    evt["doc_type"] = doc_type
                    yield f"data: {json.dumps(evt)}\n\n"

                # Phase complete
                prev_context = extract_context_for_next(doc_md)
                yield f"data: {json.dumps({'type': 'chain_phase_done', 'doc_type': doc_type, 'full_markdown': doc_md})}\n\n"

            yield f"data: {json.dumps({'type': 'all_done'})}\n\n"
        except ClientDisconnected:
            print("  ℹ️  Client disconnected during chain stream.")

    return StreamingResponse(
        chain_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":     "no-cache",
            "X-Accel-Buffering": "no",
            "Connection":        "keep-alive",
        },
    )


# ─── Diagram endpoint ─────────────────────────────────────────────────────────

@app.post("/generate-diagram")
async def generate_diagram(request: DiagramRequest) -> dict:
    """
    Generates a Mermaid block diagram based on technical requirements.

    Logic:
        1. Loads selected requirement data.
        2. Calls LLM with a specialized Mermaid prompt.
        3. Sanitizes output to ensure compatibility with Mermaid.js.
        4. Provides a fallback diagram if LLM output is unparseable.

    Args:
        request (DiagramRequest): IDs of requirements to visualize and optional heading.

    Returns:
        dict: Contains 'mermaid' key with the raw Mermaid syntax.
    """
    try:
        selected = _load_selected(request.requirement_ids)
        llm      = get_document_llm()
        if not llm:
            return {"mermaid": "graph TD\nA[LLM not loaded] --> B[Check model path]"}

        block   = generate_mermaid_block(llm, request.diagram_heading, selected[:12])
        mermaid = re.sub(r"```mermaid\n?|```", "", block).strip()
        if not mermaid.startswith("graph"):
            mermaid = "graph TD\n" + mermaid
        return {"mermaid": mermaid}
    except Exception as exc:
        return {"mermaid": f"graph TD\nA[Error] --> B[\"{str(exc)[:60]}\"]"}


# ─── Code generation ──────────────────────────────────────────────────────────

@app.post("/generate-code")
async def generate_code(request: CodeRequest) -> dict:
    """
    Generates production-quality C header and source code for selected requirements.

    Logic:
        1. Detects communication protocols (e.g., UART, PCIe) within the requirement text.
        2. Generates a .h and .c file pair for EACH detected protocol using a specialized Code LLM.
        3. Persists generated files to the 'generated_code/' directory.

    Args:
        request (CodeRequest): List of requirement IDs to transform into code.

    Returns:
        dict: List of metadata for all generated files under the 'generated' key.
    """
    all_results = []
    for rid in request.requirement_ids:
        pairs = await process_requirement_to_code(rid)
        all_results.extend(pairs)
    return {"generated": all_results}


# ─── Traceability ─────────────────────────────────────────────────────────────

@app.post("/traceability")
async def get_traceability_endpoint(request: TraceabilityRequest) -> dict:
    from rag import get_traceability
    return get_traceability(request.requirement_ids or None)

@app.post("/export-document")
async def export_document_endpoint(request: ExportDocRequest):
    import subprocess
    import tempfile
    from fastapi.responses import FileResponse
    
    doc_type = request.doc_type.upper()
    reference_docs = {
        "SRS": "warehouse/reference/SRS/DP-SPL-0220-V1-01-SRS-1V00.odt",
        "SDD": "warehouse/reference/SDD/DP-SPL-0220-V1-01-SDD-1V00.odt",
        "HRS": "warehouse/reference/HRS/DP-SPL-0220-000-HRS-0V06.odt",
        "SYRS": "warehouse/reference/SyRS/DP-SPL-0220-V1-01-SyRS-1V00.odt"
    }
    
    ref_path = Path(__file__).parent.parent / reference_docs.get(doc_type, "")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".md", mode="w", encoding="utf-8") as in_f:
        in_f.write(request.content)
        in_path = in_f.name
        
    out_path = in_path.replace(".md", ".odt")
    
    cmd = ["pandoc", in_path, "-f", "markdown", "-t", "odt", "-o", out_path]
    if ref_path.exists():
        cmd.extend(["--reference-doc", str(ref_path)])
        
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Pandoc export failed: {e.stderr.decode()}")
        
    return FileResponse(out_path, media_type="application/vnd.oasis.opendocument.text", filename=f"export_{doc_type}.odt")

@app.post("/export-excel")
async def export_excel(request: TraceabilityRequest):
    """Exports traceability and requirements to Excel."""
    from rag import get_traceability
    import pandas as pd
    from io import BytesIO
    
    data = get_traceability(request.requirement_ids or None)
    
    # Requirements sheet
    req_df = pd.DataFrame(data["requirements"])
    
    # Traceability sheet
    trace_rows = []
    for upstream, downstreams in data["matrix"].items():
        for ds in downstreams:
            trace_rows.append({
                "Upstream ID": upstream,
                "Downstream ID": ds["linked_to"],
                "Link Type": ds["link_tag"],
                "Keywords": ", ".join(ds["common_keywords"])
            })
    trace_df = pd.DataFrame(trace_rows)
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        req_df.to_excel(writer, sheet_name='Requirements', index=False)
        trace_df.to_excel(writer, sheet_name='Traceability', index=False)
    
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=ArchTech_Traceability.xlsx"}
    )


# ─── File Upload Endpoints ───────────────────────────────────────────────────

@app.post("/upload-warehouse")
async def upload_warehouse_files(files: List[UploadFile] = File(...)):
    """Uploads and indexes documents into the Knowledge Warehouse."""
    KNOWLEDGE_DIR = Path("warehouse/knowledge")
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    
    saved_count = 0
    for file in files:
        target = KNOWLEDGE_DIR / file.filename
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_count += 1
        except Exception as e:
            print(f"Error saving {file.filename}: {e}")
            
    # Re-index the warehouse
    from rag import index_warehouse
    index_warehouse()
    
    total_files = len(list(KNOWLEDGE_DIR.glob("*")))
    return {"success": True, "count": saved_count, "total": total_files}

@app.post("/upload-requirements")
@app.post("/projects/upload-techspec")
async def upload_requirements_files(files: List[UploadFile] = File(...)):
    """Uploads PDFs directly to UPLOAD_DIR and triggers a scan."""
    if UPLOAD_DIR.exists():
        shutil.rmtree(UPLOAD_DIR)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    
    for file in files:
        # Sanitize filename to prevent directory traversal attacks if necessary,
        # but since we want to preserve folder structure uploaded via webkitdirectory,
        # we just ensure the parent directory exists.
        target = UPLOAD_DIR / file.filename
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
    # Trigger scan on UPLOAD_DIR
    removed = 0
    for f in REQ_DIR.glob("*.json"):
        f.unlink()
        removed += 1
        
    reqs = scan_folder(str(UPLOAD_DIR))
    ids  = save_to_json(reqs)
    index_requirements()
    
    return {"status": "success", "extracted_count": len(ids), "ids": ids}


@app.post("/upload-template")
async def upload_template(file: UploadFile = File(...)):
    """Uploads a custom .md template to templates/ directory."""
    from config import TEMPLATE_DIR
    TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)
    
    if not file.filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Only .md templates are supported.")
        
    target = TEMPLATE_DIR / file.filename
    with target.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"status": "success", "filename": file.filename}



# ─── Static frontend ──────────────────────────────────────────────────────────
try:
    from config import BASE_DIR
    frontend_dist = BASE_DIR.parent / "Frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
    else:
        print(f"⚠️  Frontend dist folder not found at {frontend_dist}. Proceeding in independent proxy mode.")
except Exception as e:
    print(f"⚠️  Failed to mount frontend: {e}")


if __name__ == "__main__":
    import uvicorn
    print("🚀 ArchTech RAG v3.0 (Fixed) — chained document generation active")
    uvicorn.run("main:app", host="127.0.0.1", port=8015, reload=False)