from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# ✅ In-memory storage (simple list)
progress_store: List[dict] = []

# ✅ Input model
class ProgressEntry(BaseModel):
    date: str          # e.g. "2024-06-01"
    weight: float      # in kg
    notes: Optional[str] = ""

# ✅ Add progress entry
@router.post("/progress/add")
def add_progress(entry: ProgressEntry):
    new_entry = {
        "date": entry.date,
        "weight": entry.weight,
        "notes": entry.notes
    }
    progress_store.append(new_entry)
    return {
        "status": "success",
        "message": "Progress entry added!",
        "entry": new_entry
    }

# ✅ Get all progress entries
@router.get("/progress/get")
def get_progress():
    if not progress_store:
        return {
            "status": "empty",
            "message": "No progress entries yet",
            "data": []
        }
    return {
        "status": "success",
        "total_entries": len(progress_store),
        "data": progress_store
    }

# ✅ Clear all progress entries
@router.delete("/progress/clear")
def clear_progress():
    progress_store.clear()
    return {
        "status": "success",
        "message": "All progress entries cleared!"
    }
