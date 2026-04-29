"""
llm_handler.py  —  ArchTech RAG v3 (Fixed)

Fixes applied:
  1. HEADING DUPLICATION — _strip_leading_heading() strips any heading the LLM
     echoes back at the top of its output; fill_section() calls it before
     building the final "heading + body" string.

  2. TABLE GENERATION — Table sections now:
       • Pass the FULL template content (no 900-char snip) so rows are not cut.
       • Use max_tokens=1024 (up from 700) so long tables are not truncated.
       • Have explicit instructions: "Output ONLY the filled markdown table."

  3. MERMAID / DIAGRAM GENERATION — Three improvements:
       • _sanitize_mermaid() removes characters that break the Mermaid parser
         ([<>"{|\\] inside labels, node IDs starting with digits).
       • _fallback_mermaid() generates a safe diagram from keywords when the LLM
         produces unparseable output.
       • generate_mermaid_block() / generate_flowchart_block() both sanitize and
         fall back gracefully.

  4. CHAIN SECTION ORDERING — fill_section() now includes the template_type in
     the system prompt with doc-specific guidance so each document type produces
     content that belongs to it (SyRS ≠ HRS ≠ SRS ≠ SDD).
     prev_doc_context is labelled "REFERENCE ONLY — do not copy".

  5. SECTION BODY ISOLATION — The LLM is told to output only the section body,
     and any echoed heading / preamble is stripped in post-processing.
"""

from openai import AsyncOpenAI
from pathlib import Path
from markdown_it import MarkdownIt
import os, re, asyncio, time, json

from config import TEMPLATE_DIR
from rag import search_warehouse

_document_llm = None
_code_llm     = None

# Type alias for OpenAI client
OpenAI_API = AsyncOpenAI

# ─── Protocol detection ───────────────────────────────────────────────────────
# Load dictionaries from warehouse
warehouse_path = Path(__file__).parent.parent / "warehouse"

with open(warehouse_path / "dicts.json", "r") as f:
    warehouse_dicts = json.load(f)

def get_document_llm():
    global _document_llm
    if _document_llm is None:
        _document_llm = AsyncOpenAI(
            api_key="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",
            base_url="https://integrate.api.nvidia.com/v1"
        )
    return _document_llm


def get_code_llm():
    global _code_llm
    if _code_llm is None:
        _code_llm = AsyncOpenAI(
            api_key="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",
            base_url="https://integrate.api.nvidia.com/v1"
        )
    return _code_llm


# ─── Template loading & parsing ───────────────────────────────────────────────

def load_template(template_type: str) -> str:
    path = TEMPLATE_DIR / f"{template_type}_Template.md"
    if not path.exists():
        return f"# {template_type} Document\n\n<!-- Add content here -->"
    return path.read_text(encoding="utf-8")

GLOBAL_PLACEHOLDER_MAP = {
    "<COMPLETE BOARD ID>": "BRD-900X",
    "<VERSION>": "1.0.0",
    "<DATE>": "2026-04-29",
    "<AUTHOR>": "System Engineer",
    "<REVIEWER>": "Lead Engineer",
    "<TECHNICAL_REVIEWER>": "System Architect",
    "<PROCESS_REVIEWER>": "QA Lead",
    "<APPROVER>": "Project Manager",
    "<PRODUCT NAME>": "Advanced Flight Controller",
    "<PRODUCT/BOARD NAME>": "Advanced Flight Controller",
    "<PROJECT NAME>": "Aero-X Avionics",
    "<PROJECT TITLE>": "Aero-X Avionics System",
    "<VERSION NO>": "1.0.0",
    "<BOARD_ACRONYM>": "AFC",
    "<VER>": "1.0",
    "<DESCRIPTION>": "Initial Release",
    "<REF ID or NEW>": "N/A",
    "<ADD MORE>": "N/A",
    "<DEFINITION>": "N/A",
    "<HRS DOCUMENT ID>": "HRS-100",
    "<SyRS DOCUMENT ID>": "SyRS-100",
    "<STANDARD/SPECIFICATION>": "MIL-STD-810G",
    "<REFERENCE ID>": "REF-001",
    "<MCU MODEL>": "STM32H753",
    "<SECTION>": "TBD",
    "<REQ_ID>": "REQ-000",
    "<HRS_REF>": "HRS-000"
}

def _parse_with_map(template: str, placeholder_map: dict) -> list[dict]:
    """Generic DSA parser that applies a specific hash map."""
    raw_sections = re.split(r'\n(?=#+ )', "\n" + template)
    
    sections = []
    for sec in raw_sections:
        if not sec.strip(): continue
        
        lines = sec.strip().split('\n')
        heading = lines[0].strip()
        heading_text = heading.lstrip('#').strip()
        content = "\n".join(lines[1:]).strip()
        
        # Apply DSA Mapping to fill static variables instantly
        for k, v in placeholder_map.items():
            content = content.replace(k, v)
            
        # Optional: Suppress simple generic placeholders that don't need prose LLM generation
        content = re.sub(r"<[^>]*\b(ID|Test)\b[^>]*>", "TBD", content, flags=re.IGNORECASE)
        
        has_placeholder = bool(re.search(r"<[A-Z0-9_\-/\s]+>", content))
        has_comment = bool(re.search(r"<!--.*?-->", content))
        needs_filling = has_placeholder or has_comment
        
        m = re.match(r'^(#+)', heading)
        level = len(m.group(1)) if m else 1

        sections.append({
            "level": level,
            "heading": heading,
            "heading_text": heading_text,
            "content": content,
            "has_table": bool(re.search(r"\|.+\|", content)),
            "has_list": "\n-" in content or "\n*" in content or "\n1." in content,
            "needs_filling": needs_filling
        })
    return sections

def parse_srs_template(template: str) -> list[dict]:
    # SRS has deeply nested test requirements. The global map is tailored for it.
    return _parse_with_map(template, GLOBAL_PLACEHOLDER_MAP)

def parse_hrs_template(template: str) -> list[dict]:
    # Future: Use a dedicated HRS map if needed
    return _parse_with_map(template, GLOBAL_PLACEHOLDER_MAP)

def parse_syrs_template(template: str) -> list[dict]:
    # Future: Use a dedicated SyRS map if needed
    return _parse_with_map(template, GLOBAL_PLACEHOLDER_MAP)

def parse_sdd_template(template: str) -> list[dict]:
    # SDD might require flowchart adjustments in the future
    return _parse_with_map(template, GLOBAL_PLACEHOLDER_MAP)

def parse_template_sections(template: str, template_type: str = "SyRS") -> list[dict]:
    """Router to direct parsing logic to document-specific handlers."""
    template_type = template_type.upper()
    if template_type == "SRS":
        return parse_srs_template(template)
    elif template_type == "HRS":
        return parse_hrs_template(template)
    elif template_type == "SYRS":
        return parse_syrs_template(template)
    elif template_type == "SDD":
        return parse_sdd_template(template)
    return _parse_with_map(template, GLOBAL_PLACEHOLDER_MAP)

# ─── Document-type guidance (used to keep chain docs distinct) ────────────────

_DOC_GUIDANCE = warehouse_dicts["document_guidance"]


# ─── Heading deduplication ────────────────────────────────────────────────────

def _strip_leading_heading(body: str, heading_text: str) -> str:
    """
    Remove a heading line from the START of an LLM response.
    """
    if not heading_text:
        return body
    lines = body.lstrip("\n").split("\n")
    new_lines = []
    heading_lower = heading_text.lower().strip()
    stripped_already = False
    for i, line in enumerate(lines):
        if i < 4 and not stripped_already:
            candidate = line.lstrip("#").strip().lower()
            if candidate == heading_lower:
                stripped_already = True
                continue
        new_lines.append(line)
    return "\n".join(new_lines).lstrip("\n").strip()


# ─── Diagram / flowchart detection ────────────────────────────────────────────

_DIAGRAM_HEADING_KW = warehouse_dicts["diagram_heading_keywords"]["block_diagram"]
_FLOWCHART_HEADING_KW = warehouse_dicts["diagram_heading_keywords"]["flowchart"]


def _is_diagram_section(section: dict) -> bool:
    h = section["heading_text"].lower()
    c = section["content"].lower()
    if any(k in h for k in _DIAGRAM_HEADING_KW):
        return True
    if "figure" in c and ("block diagram" in c or "block level" in c):
        return True
    return False


def _is_flowchart_section(section: dict, template_type: str) -> bool:
    if template_type != "SDD":
        return False
    h = section["heading_text"].lower()
    return any(k in h for k in _FLOWCHART_HEADING_KW)


# ─── Mermaid sanitisation & fallback ─────────────────────────────────────────

_MERMAID_UNSAFE = re.compile(r'[<>"{|\\]')
_STARTS_WITH_DIGIT = re.compile(r'^(\s*)(\d+)(\w*)\s*(-->|---|==>|-.->)')


def _sanitize_mermaid(text: str) -> str:
    lines = []
    for raw_line in text.split("\n"):
        line = raw_line
        line = re.sub(
            r'\[([^\]]+)\]',
            lambda m: "[" + _MERMAID_UNSAFE.sub("", m.group(1))[:60].strip() + "]",
            line,
        )
        line = re.sub(
            r'\(([^)]+)\)',
            lambda m: "(" + _MERMAID_UNSAFE.sub("", m.group(1))[:60].strip() + ")",
            line,
        )
        line = _STARTS_WITH_DIGIT.sub(lambda m: f"{m.group(1)}N{m.group(2)}{m.group(3)} {m.group(4)}", line)
        lines.append(line)

    result = "\n".join(lines).strip()
    if not re.match(r"^\s*(graph|flowchart)\s+(TD|LR|TB|BT|RL)", result):
        result = "graph TD\n" + result
    return result


def _fallback_mermaid(reqs: list[dict], heading: str) -> str:
    PROTO_KW = {"uart","spi","i2c","can","rs422","rs232","pcie","pci",
                "adc","dac","jtag","ethernet","usart"}
    protocols: list[str] = []
    for r in reqs[:8]:
        for kw in r.get("keywords", []):
            if kw.lower() in PROTO_KW and kw.upper() not in protocols:
                protocols.append(kw.upper())

    lines = ["graph TD", "    CPU[Processor]"]
    for i, p in enumerate(protocols[:6]):
        nid = f"IF{i}"
        lines.append(f"    {nid}[{p} Interface]")
        lines.append(f"    CPU --> {nid}")

    if not protocols:
        lines += [
            "    SYS[System Core]",
            "    HW[Hardware Interface]",
            "    SW[Software Module]",
            "    SYS --> HW",
            "    SYS --> SW",
        ]
    return "\n".join(lines)


# ─── LLM raw call ─────────────────────────────────────────────────────────────

async def _call_llm_raw(llm: OpenAI_API, prompt: str, max_tokens: int = 1024) -> str:
    for attempt in range(3):
        try:
            if attempt > 0:
                await asyncio.sleep(2 * attempt)
            resp = await llm.chat.completions.create(
                model="meta/llama-3.1-8b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                top_p=0.7,
                max_tokens=max_tokens,
                stop=["<|im_end|>", "<|im_start|>"],
                stream=False
            )
            return resp.choices[0].message.content.strip()
        except Exception as exc:
            err_msg = str(exc).lower()
            if any(k in err_msg for k in ("429", "rate limit", "too many requests")):
                if attempt < 2: continue
            print(f"  LLM raw call error: {exc}")
            return ""
    return ""


# ─── Mermaid generation ───────────────────────────────────────────────────────

async def generate_mermaid_block(llm: OpenAI_API, section_heading: str, reqs: list[dict]) -> str:
    req_lines = "\n".join(f"- {r.get('text', '')}" for r in reqs[:10])
    prompt = (
        "<|im_start|>system\n"
        "You are a technical documentation expert generating Mermaid graph TD diagrams.\n"
        "Rules:\n"
        "• Output ONLY raw Mermaid syntax starting with 'graph TD' — no explanation, no fences.\n"
        "• Use alphanumeric node IDs only (A, B, CPU, ADC1 — never start with a digit).\n"
        "• Keep node labels short (≤ 6 words); NO special characters inside [ ] labels.\n"
        "• Show major components and their communication interfaces as edges.\n"
        "• Label edges with interface/protocol names where known.\n"
        "• 6–12 nodes maximum.\n"
        "<|im_end|>\n"
        "<|im_start|>user\n"
        f"Section: {section_heading}\n\n"
        f"Requirements (identify components and interfaces):\n{req_lines}\n"
        "<|im_end|>\n"
        "<|im_start|>assistant\n"
        "graph TD\n"
    )
    raw = await _call_llm_raw(llm, prompt, max_tokens=1024)
    full = "graph TD\n" + raw if not raw.startswith("graph TD") else raw
    full = re.sub(r"```[a-zA-Z]*\n?", "", full).strip()
    try:
        mermaid = _sanitize_mermaid(full)
    except Exception:
        mermaid = _fallback_mermaid(reqs, section_heading)

    if "-->" not in mermaid and "---" not in mermaid:
        mermaid = _fallback_mermaid(reqs, section_heading)

    return f"\n```mermaid\n{mermaid}\n```\n"


async def generate_flowchart_block(llm: OpenAI_API, section_heading: str, reqs: list[dict]) -> str:
    req_lines = "\n".join(f"- {r.get('text', '')}" for r in reqs[:8])
    prompt = (
        "<|im_start|>system\n"
        "You are a test engineer creating Mermaid flowchart TD diagrams.\n"
        "Rules:\n"
        "• Output ONLY raw Mermaid 'flowchart TD' syntax — no explanation, no fences.\n"
        "• Use alphanumeric node IDs only (never start with a digit).\n"
        "• Keep labels ≤ 8 words; NO special characters inside [ ] or { } labels.\n"
        "• Model: Start → Setup → Execute → Check → Pass/Fail → End.\n"
        "• Diamond shapes for decisions, rectangles for actions. 8–14 nodes max.\n"
        "<|im_end|>\n"
        "<|im_start|>user\n"
        f"Section: {section_heading}\n\n"
        f"Requirements:\n{req_lines}\n"
        "<|im_end|>\n"
        "<|im_start|>assistant\n"
        "flowchart TD\n"
    )
    raw = await _call_llm_raw(llm, prompt, max_tokens=1024)
    full = "flowchart TD\n" + raw if not raw.startswith("flowchart TD") else raw
    full = re.sub(r"```[a-zA-Z]*\n?", "", full).strip()
    try:
        fc = _sanitize_mermaid(full)
    except Exception:
        fc = "flowchart TD\n    S([Start]) --> T[Setup Test]\n    T --> E[Execute]\n    E --> C{Pass?}\n    C -- Yes --> P([Pass])\n    C -- No --> F([Fail])"
    return f"\n```mermaid\n{fc}\n```\n"


# ─── Requirement routing ──────────────────────────────────────────────────────

_DOMAIN_KW = warehouse_dicts["domain_keywords"]


def route_requirements(reqs: list[dict], heading: str, content: str) -> list[dict]:
    if not reqs:
        return []
    ctx    = (heading + " " + content).lower()
    active = {d for d, kws in _DOMAIN_KW.items() if any(k in ctx for k in kws)}

    scored: list[tuple[int, dict]] = []
    for r in reqs:
        score = 0
        rtxt  = (r.get("text", "") + " " + " ".join(r.get("keywords", []))).lower()
        for d in active:
            if any(k in rtxt for k in _DOMAIN_KW[d]):
                score += 3
        for kw in r.get("keywords", []):
            if len(kw) > 3 and kw.lower() in ctx:
                score += 1
        if r.get("priority") == "High":
            score += 1
        if score > 0:
            scored.append((score, r))

    scored.sort(key=lambda x: -x[0])
    top = [r for _, r in scored[:8]]
    if not top:
        top = [r for r in reqs if r.get("priority") == "High"][:4] or reqs[:4]
    return top


# ─── Markdown fence stripper ──────────────────────────────────────────────────

def _strip_md_fences(text: str) -> str:
    return re.sub(r"```[a-zA-Z]*\n?", "", text).strip()


# ─── Section filling ──────────────────────────────────────────────────────────
def _get_prompt_strategy(content: str) -> tuple[str, str, int]:
    """Determines the LLM task and snippet size based on section content."""
    has_table = bool(re.search(r"\|.+\|", content))
    
    if has_table:
        task = (
            "Fill ALL empty table cells in the markdown table(s) below using data from the "
            "REQUIREMENTS. Output ONLY the completed markdown table(s) — no prose before or "
            "after, no headings. You MUST use | pipe characters for every cell, INCLUDING leading and trailing pipes for EVERY row (e.g., | Cell 1 | Cell 2 |). "
            "Keep ALL existing rows and columns. Do not add or remove rows."
        )
        return task, content, 1024
    
    snippet = content[:900] if len(content) > 900 else content
    task = (
        "Replace every HTML comment <!-- ... --> with 2–4 sentences of precise technical "
        "content sourced from the REQUIREMENTS. Replace \\<placeholder\\> tokens with real "
        "values from the requirements. Preserve all markdown headings, bullets, and bold text."
    )
    return task, snippet, 1024

def _get_context_blocks(heading_text: str, content: str, prev_doc_context: str) -> tuple[str, str]:
    """Gathers warehouse hits and relevant slices of previous document context."""
    # Warehouse Context
    warehouse_hits = search_warehouse(heading_text + " " + (content[:100] if content else ""), top_k=2)
    warehouse_block = ""
    if warehouse_hits:
        warehouse_block = "\n\nKNOWLEDGE WAREHOUSE REFERENCE (External standards/guides):\n"
        warehouse_block += "".join(f"- [{h['source']}] {h['text']}\n" for h in warehouse_hits)

    # Previous Document Context
    prev_ctx_block = ""
    if prev_doc_context:
        best_slice = prev_doc_context[:400]
        # Search for heading keywords in previous context to find relevant overlap
        for word in re.findall(r'\w+', heading_text.lower()):
            idx = prev_doc_context.lower().find(word)
            if idx >= 0:
                best_slice = prev_doc_context[max(0, idx - 50): idx + 350]
                break
        prev_ctx_block = (
            "\n\nPREVIOUS DOCUMENT CONTEXT — REFERENCE ONLY. "
            "Do NOT copy this text; use it only for consistency:\n"
            f"{best_slice}\n"
        )
    
    return warehouse_block, prev_ctx_block

def _build_fill_messages(
    template_type: str, 
    heading_text: str, 
    heading: str,
    task: str, 
    snippet: str, 
    req_lines: str, 
    warehouse_context: str, 
    prev_ctx_block: str, 
    user_query: str
) -> list[dict]:
    """Constructs the system and user messages for the LLM."""
    doc_guidance = _DOC_GUIDANCE.get(template_type, "technical embedded-systems specifications")
    
    system_msg = (
        f"You are a senior technical writer producing the '{heading_text}' section "
        f"of a {template_type} document for aerospace/defense embedded systems.\n"
        f"This {template_type} document covers: {doc_guidance}.\n"
        f"Task: {task}\n"
        "Rules:\n"
        "• Output ONLY the filled section body — NO heading line, NO preamble, NO explanation.\n"
        "• All content must be grounded in the REQUIREMENTS below.\n"
        "• Keep all Markdown table pipes, bullets, and bold text intact.\n"
        f"• Write content appropriate for a {template_type} — do NOT include content that "
        "belongs to a different document type."
    )
    
    user_msg = (
        f"SECTION HEADING: {heading}\n\n"
        f"TEMPLATE CONTENT TO FILL:\n{snippet}\n\n"
        f"REQUIREMENTS:\n{req_lines}"
        + warehouse_context
        + prev_ctx_block
        + (f"\nADDITIONAL INSTRUCTIONS: {user_query}\n" if user_query else "")
    )
    
    return [
        {"role": "system", "content": system_msg},
        {"role": "user", "content": user_msg}
    ]


# ─── Main Section Filling Logic ───────────────────────────────────────────────

async def fill_section(
    llm: OpenAI_API,
    section: dict,
    reqs: list[dict],
    user_query: str = "",
    prev_doc_context: str = "",
    template_type: str = "SyRS",
) -> str:
    """
    Async Generator that fills a document section using RAG and an LLM.
    Yields status updates and streaming deltas, finishing with the full content.
    """
    heading, heading_text, content = section["heading"], section["heading_text"], section["content"]

    # 1. Immediate Return for Static Sections
    if not section.get("needs_filling"):
        result = f"{heading}\n\n{content}" if content else heading
        if heading and _is_diagram_section(section) and reqs:
            result += await generate_mermaid_block(llm, heading_text, reqs)
        yield {"type": "content", "body": result}
        return

    # 2. Context & Requirement Routing
    relevant = route_requirements(reqs, heading, content)
    if not relevant:
        # Fallback if no requirements found
        clean = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL).strip()
        result = f"{heading}\n\n{clean}" if clean else heading
        if heading and _is_diagram_section(section):
            result += await generate_mermaid_block(llm, heading_text, reqs[:8] if reqs else [])
        elif _is_flowchart_section(section, template_type):
            result += await generate_flowchart_block(llm, heading_text, reqs[:8] if reqs else [])
        yield {"type": "content", "body": result}
        return

    # 3. Preparation for LLM Call
    req_lines = "\n".join(f"[{r.get('id','?')}] {r.get('text','')}" for r in relevant[:6])
    task, snippet, max_tok = _get_prompt_strategy(content)
    warehouse_ctx, prev_ctx = _get_context_blocks(heading_text, content, prev_doc_context)
    
    messages = _build_fill_messages(
        template_type, heading_text, heading, task, snippet, 
        req_lines, warehouse_ctx, prev_ctx, user_query
    )

    # 4. LLM Call with Retry Logic
    result_body = ""
    for attempt in range(3):
        print(f"  🔄 Section '{heading_text}' - Attempt {attempt+1}/3")
        try:
            # Base delay to prevent burst limit issues
            if attempt > 0:
                wait_time = 5 * (2 ** attempt)
                msg = f"⏳ API busy. Retrying {attempt+1}/3..."
                yield {"type": "status", "message": msg}
                await asyncio.sleep(wait_time)
            else:
                await asyncio.sleep(0.5)

            yield {"type": "section_start", "heading": heading}

            # Use streaming for better UX
            resp = await llm.chat.completions.create(
                model="meta/llama-3.1-8b-instruct",
                messages=messages,
                max_tokens=max_tok,
                temperature=0.2,
                top_p=0.7,
                stop=["<|im_end|>", "<|im_start|>"],
                stream=True
            )
            
            raw_body = ""
            heading_stripped = False
            buffer = ""

            print(f"  📡 Streaming '{heading_text}': ", end="", flush=True)
            async for chunk in resp:
                if not hasattr(chunk, "choices") or not chunk.choices: continue
                delta = chunk.choices[0].delta.content
                if not delta: continue
                print(repr(delta), end="|", flush=True)
                raw_body += delta
                
                # Logic to strip the heading if the LLM parrots it back
                if not heading_stripped and heading_text:
                    buffer += delta
                    if "\n" in buffer:
                        lines = buffer.split("\n", 1)
                        if lines[0].lstrip("#").strip().lower() == heading_text.lower().strip():
                            heading_stripped = True
                            if len(lines) > 1: yield {"type": "delta", "delta": lines[1].lstrip("\n")}
                        else:
                            heading_stripped = True
                            yield {"type": "delta", "delta": buffer}
                    elif len(buffer) > 150: # Give up on stripping if no newline soon
                        heading_stripped = True
                        yield {"type": "delta", "delta": buffer}
                else:
                    yield {"type": "delta", "delta": delta}
            print(" [DONE]")

            result_body = _strip_leading_heading(raw_body.strip(), heading_text)
            print(f"  ✨ Section '{heading_text}' filled successfully ({len(result_body)} chars).")
            break # Success

        except Exception as exc:
            err_msg = str(exc).lower()
            if any(k in err_msg for k in ("429", "rate limit", "too many requests")):
                if attempt < 2:
                    continue
                msg = f"❌ Rate limit exceeded for '{heading_text}'. Using fallback content."
                print(f"  {msg}")
                yield {"type": "status", "message": msg}
            else:
                print(f"  ⚠️  LLM error ({heading_text}): {exc}")
                yield {"type": "status", "message": f"⚠️ Error filling section: {exc}"}
            
            # Final fallback to original template content if LLM fails after retries
            clean = re.sub(r"<!--.*?-->", "", content, flags=re.DOTALL).strip()
            result_body = clean
            break

    # 5. Assemble Final Result
    final_md = f"{heading}\n\n{result_body}" if heading else result_body
    
    # Append diagrams if applicable
    if heading and _is_diagram_section(section) and reqs:
        final_md += await generate_mermaid_block(llm, heading_text, relevant)
    elif _is_flowchart_section(section, template_type) and reqs:
        final_md += await generate_flowchart_block(llm, heading_text, relevant)

    yield {"type": "content", "body": final_md}



# ─── Public API ───────────────────────────────────────────────────────────────

async def generate_document(
    reqs: list[dict],
    user_query: str = "",
    template_type: str = "SyRS",
    prev_doc_context: str = "",
) -> str:
    t0  = time.time()
    document_llm = get_document_llm()
    if not document_llm:
        return "**Error:** Document model not loaded. Check model path in llm_handler.py."

    template = load_template(template_type)
    sections = parse_template_sections(template, template_type)
    need_fill = sum(1 for s in sections if s["needs_filling"])
    print("======================================================================")
    print(f"📄 {template_type}: {need_fill} to fill : Start Time : {t0}")
    print("======================================================================")
   
    parts: list[str] = []
    for index, section in enumerate(sections):
        # Handle the generator output for non-streaming calls
        filled_body = ""
        async for update in fill_section(document_llm, section, reqs, user_query, prev_doc_context, template_type):
            if update["type"] == "content":
                filled_body = update["body"]
        parts.append(filled_body)
        
    doc = "\n\n".join(parts) if parts else ""
    print(f"✅ {template_type} complete in {time.time()-t0:.1f}s")
    return doc


async def generate_document_sections(
    reqs: list[dict],
    user_query: str = "",
    template_type: str = "SyRS",
    prev_doc_context: str = "",
):
    llm = get_document_llm()
    if not llm:
        yield {"error": "Document model not loaded", "done": True}
        return

    template = load_template(template_type)
    sections = parse_template_sections(template, template_type)
    total    = len(sections)

    for i, sec in enumerate(sections):
        filled_body = ""
        async for update in fill_section(llm, sec, reqs, user_query, prev_doc_context, template_type):
            if update["type"] in ("status", "delta", "section_start"):
                yield {**update, "done": False, "section_num": i + 1}
            elif update["type"] == "content":
                filled_body = update["body"]

        yield {
            "section_num": i + 1,
            "total":       total,
            "heading":     sec["heading"],
            "content":     filled_body,
            "done":        False,
        }

    yield {"section_num": total, "total": total, "heading": "", "content": "", "done": True}


def extract_context_for_next(doc_md: str, max_chars: int = 800) -> str:
    lines   = doc_md.split("\n")
    keeper  = []
    in_spec = False
    for line in lines:
        low = line.lower()
        if re.match(r"^#{1,3} ", line) and any(
            k in low for k in ["specification", "requirement", "overview",
                                "hardware", "software", "interface",
                                "environmental", "power", "communication"]
        ):
            in_spec = True
        if in_spec:
            keeper.append(line)
        if len("\n".join(keeper)) > max_chars:
            break
    result = "\n".join(keeper)
    return result[:max_chars] if result else doc_md[:max_chars]


# ─── Rephrasing Logic ─────────────────────────────────────────────────────────

async def rephrase_content(text: str, selected_reqs: list, style: str = "concise") -> list[str]:
    llm = get_document_llm()
    if not llm:
        return [text] * 3
    
    req_context = "\n".join([f"- {r['text']}" for r in selected_reqs[:5]])
    
    prompt = f"""Rephrase the following technical document section in 3 different ways.
Style: {style}
Context Requirements:
{req_context}

Section to rephrase:
{text}

Return exactly 3 versions, separated by '---VERSION-SEP---'. Do not include any other text."""
    
    try:
        response = await llm.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            stream=False
        )
        content = response.choices[0].message.content.strip()
        
        versions = [v.strip() for v in content.split('---VERSION-SEP---') if v.strip()]
        return (versions + [text, text, text])[:3]
    except Exception as e:
        print(f"Rephrase error: {e}")
        return [text] * 3

# ─── AIR-GAPPED CONFIGURATION (Uncomment to use local Ollama) ────────────────
# def get_document_llm():
#     global _document_llm
#     if _document_llm is None:
#         _document_llm = OpenAI(
#             api_key="ollama",
#             base_url="http://localhost:11434/v1"
#         )
#     return _document_llm
# ─────────────────────────────────────────────────────────────────────────────
