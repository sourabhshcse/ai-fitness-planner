import json
import os

# ─── File Paths ──────────────────────────────────────────────────────────────

PROGRESS_FILE   = "data/progress.json"
CHALLENGES_FILE = "data/challenges.json"

# ─── Generic Helpers ─────────────────────────────────────────────────────────

def read_json(filepath: str, default):
    try:
        with open(filepath, "r") as f:
            return json.load(f)
    except:
        return default

def write_json(filepath: str, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

# ─── Progress ────────────────────────────────────────────────────────────────

def load_progress() -> list:
    return read_json(PROGRESS_FILE, [])

def save_progress(data: list):
    write_json(PROGRESS_FILE, data)

# ─── Challenges ──────────────────────────────────────────────────────────────

def load_challenges() -> dict:
    return read_json(CHALLENGES_FILE, {})

def save_challenges(data: dict):
    write_json(CHALLENGES_FILE, data)