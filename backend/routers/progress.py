from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.storage import load_progress, save_progress

# ─── Router Setup ────────────────────────────────────────────────────────────

router = APIRouter()

# ─── Request Model ───────────────────────────────────────────────────────────

class ProgressEntry(BaseModel):
    date:   str
    weight: float
    notes:  Optional[str] = ""

# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/progress/add")
def add_progress(entry: ProgressEntry):
    progress_store = load_progress()

    new_entry = {
        "date":   entry.date,
        "weight": entry.weight,
        "notes":  entry.notes,
    }

    progress_store.append(new_entry)
    save_progress(progress_store)

    return {
        "status":  "success",
        "message": "Progress entry added!",
        "entry":   new_entry,
    }


@router.get("/progress/get")
def get_progress():
    progress_store = load_progress()

    if not progress_store:
        return {
            "status":  "empty",
            "message": "No progress entries yet",
            "data":    [],
        }

    return {
        "status":        "success",
        "total_entries": len(progress_store),
        "data":          progress_store,
    }


@router.delete("/progress/clear")
def clear_progress():
    save_progress([])

    return {
        "status":  "success",
        "message": "All progress entries cleared!",
    }