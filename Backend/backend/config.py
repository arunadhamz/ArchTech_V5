"""
config.py  —  ArchTech RAG v3 Centralized Configuration

This module centralizes all directory paths, model paths, and operational settings
to facilitate easy environment configuration for agents and developers.
"""

from pathlib import Path
import os

# ─── Base Directories ────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent.parent
UPLOAD_DIR  = BASE_DIR / "uploads"
REQ_DIR     = BASE_DIR / "requirements"
CODE_DIR    = BASE_DIR / "generated_code"
TEMPLATE_DIR = BASE_DIR / "templates"
CHROMA_DIR  = BASE_DIR / "chroma_db"

# ─── Model Paths ─────────────────────────────────────────────────────────────
MODEL_BASE_DIR = BASE_DIR / "models"
EMBEDDING_MODEL_PATH = "all-MiniLM-L6-v2"

# ─── Operational Settings ────────────────────────────────────────────────────
API_HOST = "127.0.0.1"
API_PORT = 8015

# Ensure critical directories exist
for _d in (UPLOAD_DIR, REQ_DIR, CODE_DIR, TEMPLATE_DIR):
    _d.mkdir(exist_ok=True)
