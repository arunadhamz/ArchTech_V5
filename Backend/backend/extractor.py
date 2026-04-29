"""
extractor.py  —  ArchTech RAG v3
Fixes:
  • Sequential IDs (FUN-1, HAR-1) across multiple files in a scan.
  • Categorization: Functional, Non-Functional, Hardware, Software.
  • OCR Fallback stub.
"""

import pdfplumber
import json
import uuid
from pathlib import Path
import datetime
import yake
import re
import time

kw_extractor = yake.KeywordExtractor(lan="en", n=3, dedupLim=0.8, top=12, features=None)

# ─── Protocol detection ───────────────────────────────────────────────────────
# Load dictionaries from warehouse
warehouse_path = Path(__file__).parent.parent / "warehouse"

with open(warehouse_path / "lists.json", "r") as f:
    warehouse_lists = json.load(f)

TECH_UNITS = r'\b(' + '|'.join(warehouse_lists["tech_units"]) + r')\b'
DIRECTIVES = r'\b(' + '|'.join(warehouse_lists["directives"]) + r')\b'
PROTOCOLS = set(warehouse_lists["protocols"])

# ─── Inference Helpers ───────────────────────────────────────────────────────

_DOC_TYPE_MAP = warehouse_lists["document_types"]

def _infer_doc_type(stem: str) -> str:
    s = stem.lower().replace("-", "").replace("_", "")
    for fragment, dtype in _DOC_TYPE_MAP:
        if fragment in s:
            return dtype
    return "TechSpec"

def _infer_req_category(text: str) -> str:
    lower = text.lower()
    if any(k in lower for k in ["environment", "safety", "reliability", "security", "standard"]):
        return "Non-Functional"
    if any(k in lower for k in ["software", "firmware", "driver", "application"]):
        return "Software"
    if any(k in lower for k in ["hardware", "circuit", "pcb", "fpga", "voltage", "current", "pin"]):
        return "Hardware"
    return "Functional"

# ─── Filtering & keyword extraction ──────────────────────────────────────────

def is_technically_significant(text: str) -> bool:
    if len(text.strip()) < 25:
        return False
    lower = text.lower()
    if re.search(DIRECTIVES, lower):
        return True
    if re.search(r'\d+\s*' + TECH_UNITS, text, re.IGNORECASE):
        return True
    if any(p in lower for p in PROTOCOLS):
        return True
    return len(text) > 40

def extract_keywords(text: str):
    keywords = []
    lower = text.lower()
    for p in PROTOCOLS:
        if p in lower:
            keywords.append(p)
    try:
        raw = kw_extractor.extract_keywords(text)
        for kw, score in raw[:10]:
            clean = kw.lower().strip()
            if len(clean) > 3 and clean not in keywords:
                keywords.append(clean)
    except Exception:
        pass
    return list(dict.fromkeys(keywords))[:8]

# ─── Core extraction ─────────────────────────────────────────────────────────

def extract_requirements(pdf_path: str, doc_type: str, counters: dict = None) -> list[dict]:
    requirements = []
    pdf_file = Path(pdf_path)
    start = time.time()
    print(f"🚀 Extraction started: {pdf_file.name} [{doc_type}]")

    if counters is None:
        counters = {"Functional": 0, "Non-Functional": 0, "Hardware": 0, "Software": 0}

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text() or ""
                
                # --- OCR Fallback ---
                if not text.strip():
                    try:
                        import pytesseract
                        from PIL import Image
                        # Convert page to image for OCR
                        pix = page.to_image(resolution=300).original
                        text = pytesseract.image_to_string(pix)
                        print(f"  [OCR] Page {page_num} extracted via Tesseract")
                    except Exception as e:
                        print(f"  [OCR] Failed: {e}")
                        pass

                if not text:
                    continue

                segments = re.split(r'(?<=[.!?])\s+', text.replace('\n', ' '))
                page_count = 0

                for seg in segments:
                    seg = seg.strip()
                    if len(seg) < 25:
                        continue
                    if seg.lower().startswith(('page ', 'figure ', 'table ')):
                        continue

                    if is_technically_significant(seg):
                        category = _infer_req_category(seg)
                        counters[category] += 1
                        
                        prefix = {"Functional": "FUN", "Non-Functional": "NON", "Hardware": "HAR", "Software": "SOF"}.get(category, "REQ")
                        req_id = f"{prefix}-{counters[category]}"
                        
                        keywords = extract_keywords(seg)
                        priority = "High" if re.search(r'\b(shall|must)\b', seg.lower()) else "Normal"

                        requirements.append({
                            "id":           req_id,
                            "type":         doc_type,
                            "category":     category,
                            "priority":     priority,
                            "text":         seg,
                            "source":       pdf_file.name,
                            "page":         page_num,
                            "keywords":     keywords,
                            "extracted_at": datetime.datetime.now().isoformat(),
                        })
                        page_count += 1

                page.flush_cache()
                print(f"  Page {page_num}: {page_count} requirements")

        elapsed = time.time() - start
        print(f"✅ Done in {elapsed:.1f}s | Total: {len(requirements)}")
    except Exception as e:
        print(f"Extraction error: {e}")

    return requirements

# ─── Public API ──────────────────────────────────────────────────────────────

from config import REQ_DIR

def save_to_json(requirements: list, output_dir: str = None) -> list:
    out_path = Path(output_dir) if output_dir else REQ_DIR
    out_path.mkdir(exist_ok=True)
    saved = []
    for req in requirements:
        fpath = out_path / f"{req['id']}.json"
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(req, f, indent=2)
        saved.append(req['id'])
    return saved

def scan_file(file_path: str, doc_type: str = None, counters: dict = None) -> list:
    p = Path(file_path)
    dtype = doc_type or _infer_doc_type(p.stem)
    ext = p.suffix.lower()
    
    if ext == '.pdf':
        return extract_requirements(str(p), dtype, counters)
    elif ext == '.docx':
        return extract_from_docx(str(p), dtype, counters)
    elif ext in ['.md', '.txt']:
        return extract_from_text(str(p), dtype, counters)
    return []

def extract_from_docx(path: str, doc_type: str, counters: dict) -> list:
    try:
        from docx import Document
        doc = Document(path)
        text = "\n".join([p.text for p in doc.paragraphs])
        return _extract_from_string(text, Path(path).name, doc_type, counters)
    except Exception as e:
        print(f"Docx error: {e}")
        return []

def extract_from_text(path: str, doc_type: str, counters: dict) -> list:
    try:
        text = Path(path).read_text(encoding='utf-8')
        return _extract_from_string(text, Path(path).name, doc_type, counters)
    except Exception as e:
        print(f"Text error: {e}")
        return []

def _extract_from_string(text: str, filename: str, doc_type: str, counters: dict) -> list:
    requirements = []
    segments = re.split(r'(?<=[.!?])\s+', text.replace('\n', ' '))
    for seg in segments:
        seg = seg.strip()
        if is_technically_significant(seg):
            category = _infer_req_category(seg)
            counters[category] += 1
            prefix = {"Functional": "FUN", "Non-Functional": "NON", "Hardware": "HAR", "Software": "SOF"}.get(category, "REQ")
            req_id = f"{prefix}-{counters[category]}"
            keywords = extract_keywords(seg)
            priority = "High" if re.search(r'\b(shall|must)\b', seg.lower()) else "Normal"
            requirements.append({
                "id":           req_id,
                "type":         doc_type,
                "category":     category,
                "priority":     priority,
                "text":         seg,
                "source":       filename,
                "page":         1,
                "keywords":     keywords,
                "extracted_at": datetime.datetime.now().isoformat(),
            })
    return requirements

def scan_folder(folder_path: str) -> list:
    folder = Path(folder_path)
    all_reqs = []
    counters = {"Functional": 0, "Non-Functional": 0, "Hardware": 0, "Software": 0}
    supported = ['.pdf', '.docx', '.md', '.txt']

    if folder.is_file():
        if folder.suffix.lower() in supported:
            return scan_file(str(folder), counters=counters)
        return []

    if not folder.is_dir():
        return []

    files = []
    for ext in supported:
        files.extend(list(folder.rglob(f"*{ext}")))
    
    for f in sorted(files):
        all_reqs.extend(scan_file(str(f), counters=counters))

    return all_reqs