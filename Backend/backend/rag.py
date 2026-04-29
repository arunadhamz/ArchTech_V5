"""
rag.py  —  ArchTech RAG v3 (Fixed)
Fixes:
  • index_requirements(): delete + recreate collection for a true clean slate.
    collection.delete(where={}) silently fails on many ChromaDB versions;
    deleting + recreating the collection guarantees old requirements are gone.
  • Module-level `collection` reference is refreshed after recreate.
  • Traceability threshold kept at 1 shared keyword.
  • Cross-chain link-type tagging unchanged.
"""

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.utils import embedding_functions
import json
from pathlib import Path
from collections import Counter, defaultdict
import pdfplumber

# ─── Global Configuration ───────────────────────────────────────────────────
import os
os.environ["ANONYMIZED_TELEMETRY"] = "False"

# Load dictionaries from warehouse
warehouse_path = Path(__file__).parent.parent / "warehouse"

with open(warehouse_path / "lists.json", "r") as f:
    warehouse_lists = json.load(f)

from config import REQ_DIR, EMBEDDING_MODEL_PATH as LOCAL_EMBEDDING_MODEL, CHROMA_DIR

model = SentenceTransformer(str(LOCAL_EMBEDDING_MODEL))

chroma_client = chromadb.PersistentClient(path=str(CHROMA_DIR))

_EF = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name=str(LOCAL_EMBEDDING_MODEL)
)

def _get_collection(name="requirements"):
    return chroma_client.get_or_create_collection(
        name=name,
        embedding_function=_EF,
    )

collection = _get_collection("requirements")
warehouse_collection = _get_collection("knowledge_warehouse")

# Document chain order
CHAIN_ORDER = warehouse_lists["chain_types"]
CHAIN_INDEX  = {t: i for i, t in enumerate(CHAIN_ORDER)}


def index_requirements() -> None:
    """
    Clears and rebuilds the ChromaDB vector index from the requirements/ directory.

    Side Effects:
        - Drops the 'requirements' collection from ChromaDB.
        - Re-reads all JSON files from the 'requirements/' directory.
        - Re-embeds all requirement texts using the local SentenceTransformer model.
        - Re-populates the ChromaDB collection.
    """
    global collection

    # ── 1. Drop & recreate ────────────────────────────────────────────────────
    try:
        chroma_client.delete_collection("requirements")
        print("🗑️  Cleared previous ChromaDB collection.")
    except Exception as exc:
        print(f"⚠️  Could not delete collection (may not exist yet): {exc}")

    collection = _get_collection()

    # ── 2. Load from disk ─────────────────────────────────────────────────────
    ids, texts, metadatas = [], [], []
    for json_file in REQ_DIR.glob("*.json"):
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            keywords_str = ",".join(data.get("keywords", []))
            ids.append(data["id"])
            texts.append(data["text"])
            metadatas.append({
                "type":     data.get("type", "TechSpec"),
                "category": data.get("category", "Functional"),
                "source":   data.get("source", "Unknown"),
                "page":     int(data.get("page", 0)),
                "keywords": keywords_str,
                "priority": data.get("priority", "Normal"),
            })
        except Exception as exc:
            print(f"  ⚠️  Skipping {json_file.name}: {exc}")

    if ids:
        collection.add(documents=texts, ids=ids, metadatas=metadatas)
        print(f"✅ Indexed {len(ids)} requirements.")
    else:
        print("⚠️  No requirements found to index.")


def index_warehouse() -> None:
    """
    Indexes files in warehouse/knowledge/ into the warehouse_collection.
    Supports .pdf, .docx, .md, .txt.
    """
    global warehouse_collection
    KNOWLEDGE_DIR = Path("warehouse/knowledge")
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        chroma_client.delete_collection("knowledge_warehouse")
        print("🗑️  Cleared warehouse collection.")
    except Exception:
        pass
    
    warehouse_collection = _get_collection("knowledge_warehouse")
    
    ids, texts, metadatas = [], [], []
    supported = ['.pdf', '.docx', '.md', '.txt']
    
    for f in KNOWLEDGE_DIR.rglob("*"):
        if f.suffix.lower() not in supported:
            continue
        
        print(f"  🔍 Processing warehouse doc: {f.name}")
        try:
            # Simple extraction for warehouse
            content = ""
            if f.suffix.lower() == '.pdf':
                with pdfplumber.open(f) as pdf:
                    content = "\n".join([p.extract_text() or "" for p in pdf.pages])
            elif f.suffix.lower() == '.docx':
                from docx import Document
                doc = Document(f)
                content = "\n".join([p.text for p in doc.paragraphs])
            else:
                content = f.read_text(encoding='utf-8')

            # Chunking (approx 1000 chars)
            chunks = [content[i:i+1000] for i in range(0, len(content), 800)]
            for i, chunk in enumerate(chunks):
                if len(chunk.strip()) < 50: continue
                chunk_id = f"WH-{f.stem}-{i}"
                ids.append(chunk_id)
                texts.append(chunk)
                metadatas.append({"source": f.name, "chunk": i})
        except Exception as e:
            print(f"  ⚠️ Warehouse error {f.name}: {e}")

    if ids:
        warehouse_collection.add(documents=texts, ids=ids, metadatas=metadatas)
        print(f"✅ Indexed {len(ids)} warehouse chunks.")


def search_warehouse(query: str, top_k: int = 3) -> list[dict]:
    """Search for relevant chunks in the knowledge warehouse."""
    if warehouse_collection.count() == 0:
        return []
    
    results = warehouse_collection.query(
        query_texts=[query],
        n_results=top_k
    )
    
    out = []
    if results["ids"][0]:
        for i in range(len(results["ids"][0])):
            out.append({
                "text": results["documents"][0][i],
                "source": results["metadatas"][0][i]["source"]
            })
    return out


def get_global_keywords():
    """Count unique keywords across all requirements JSON files."""
    all_keywords = []
    for json_file in REQ_DIR.glob("*.json"):
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            all_keywords.extend(data.get("keywords", []))
        except Exception:
            pass
    return Counter(all_keywords).most_common(50)


def search_requirements(query: str, filters: dict = None, top_k: int = 5) -> list[dict]:
    """
    Performs a hybrid search (vector similarity + keyword boosting) on the requirements.

    Logic:
        1. Query ChromaDB for top results based on vector distance.
        2. Boost scores for requirements whose keywords overlap with the query string.
        3. Sort by the boosted score and return the top_k results.

    Args:
        query (str): The search string (e.g., "power supply specifications").
        filters (dict, optional): ChromaDB 'where' clause filters. Defaults to None.
        top_k (int): Number of results to return. Defaults to 5.

    Returns:
        list[dict]: List of matching requirement records with metadata and scores.
    """
    where_clause = filters or {}
    n = min(top_k * 2, max(1, collection.count()))
    if n == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=n,
        where=where_clause if where_clause else None,
    )
    if not results["ids"][0]:
        return []

    query_words = set(query.lower().split())
    fused = []
    for i in range(len(results["ids"][0])):
        doc_id   = results["ids"][0][i]
        doc_text = results["documents"][0][i]
        metadata = results["metadatas"][0][i]
        distance = results["distances"][0][i]

        kw_set = set(metadata.get("keywords", "").split(","))
        boost  = len(query_words & kw_set) * 0.1
        score  = distance - boost

        fused.append({"id": doc_id, "text": doc_text, "metadata": metadata, "score": score})

    fused.sort(key=lambda x: x["score"])
    return fused[:top_k]


# ─── Traceability ─────────────────────────────────────────────────────────────

def get_traceability(selected_ids: list[str] = None) -> dict:
    """
    Constructs a traceability matrix for the specified requirements.

    Logic:
        1. Loads requirement metadata for the provided IDs (or all if None).
        2. Compares requirements based on shared keywords.
        3. Assigns 'upstream', 'downstream', or 'peer' tags based on the CHAIN_ORDER.
        4. Calculates a 'trace_strength' based on the ratio of shared to total keywords.

    Args:
        selected_ids (list[str], optional): Subset of requirement IDs to analyze.

    Returns:
        dict: Traceability matrix, summary statistics, and metadata.
    """
    if not selected_ids:
        selected_ids = [f.stem for f in REQ_DIR.glob("*.json")]

    req_data: dict[str, dict] = {}
    for req_id in selected_ids:
        json_file = REQ_DIR / f"{req_id}.json"
        if not json_file.exists():
            continue
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            req_data[req_id] = {
                "text":     data.get("text", ""),
                "keywords": data.get("keywords", []),
                "source":   data.get("source", "Unknown"),
                "type":     data.get("type", "TechSpec"),
                "priority": data.get("priority", "Normal"),
            }
        except Exception:
            pass

    traceability_matrix: dict[str, list] = {}
    total_links = 0

    for req_id, info in req_data.items():
        kw_set = set(info["keywords"])
        links  = []

        for other_id, other_info in req_data.items():
            if other_id == req_id:
                continue
            other_kw = set(other_info["keywords"])
            common   = kw_set & other_kw
            if len(common) < 1:
                continue

            strength  = len(common) / max(len(kw_set), 1)
            own_idx   = CHAIN_INDEX.get(info["type"],       0)
            other_idx = CHAIN_INDEX.get(other_info["type"], 0)

            if own_idx < other_idx:
                link_tag = "downstream"
            elif own_idx > other_idx:
                link_tag = "upstream"
            else:
                link_tag = "peer"

            links.append({
                "linked_to":       other_id,
                "linked_type":     other_info["type"],
                "common_keywords": list(common)[:5],
                "trace_strength":  round(strength, 3),
                "linked_source":   other_info["source"],
                "linked_priority": other_info["priority"],
                "link_tag":        link_tag,
            })
            total_links += 1

        links.sort(key=lambda x: (x["link_tag"] != "downstream", -x["trace_strength"]))
        traceability_matrix[req_id] = links

    type_summary: dict[str, dict] = defaultdict(lambda: {"count": 0, "linked": 0})
    for req_id, info in req_data.items():
        t = info["type"]
        type_summary[t]["count"] += 1
        if traceability_matrix.get(req_id):
            type_summary[t]["linked"] += 1

    # Flatten requirements for easier processing in frontend/excel
    requirements_list = []
    for req_id, info in req_data.items():
        requirements_list.append({
            "id": req_id,
            **info
        })

    return {
        "matrix": traceability_matrix,
        "requirements": requirements_list,
        "total_requirements": len(req_data),
        "total_trace_links": total_links,
        "type_summary": dict(type_summary),
        "supported_chain": ["TechSpec", "SyRS", "HRS", "SRS", "SDD"],
        "note": "link_tag: downstream = child-doc, upstream = parent-doc, peer = same-level."
    }

def list_warehouse_files() -> list[dict]:
    """Returns metadata for all files in the warehouse/knowledge directory."""
    KNOWLEDGE_DIR = Path("warehouse/knowledge")
    if not KNOWLEDGE_DIR.exists():
        return []
    
    files = []
    import time
    # Import locally to avoid potential circular dependency if needed
    for f in KNOWLEDGE_DIR.rglob("*"):
        if f.is_file():
            # Filter for supported types
            if f.suffix.lower() in ['.pdf', '.docx', '.md', '.txt']:
                files.append({
                    "name": f.name,
                    "size": f.stat().st_size,
                    "modified": time.ctime(f.stat().st_mtime),
                    "type": f.suffix[1:].upper() if f.suffix else "UNKNOWN"
                })
    return files