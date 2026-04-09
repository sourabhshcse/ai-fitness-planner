from fastapi import APIRouter
from pydantic import BaseModel
from services.challenge_logic import (
    start_challenge,
    get_challenge,
    get_daily_content,
    cancel_challenge,
)
from services.pdf_generator import generate_daily_pdf
from services.email_sender import send_daily_plan

# ─── Router Setup ────────────────────────────────────────────────────────────

router = APIRouter(prefix="/challenge", tags=["Challenge"])

# ─── Request Models ──────────────────────────────────────────────────────────

class StartRequest(BaseModel):
    email:          str
    duration:       int
    goal:           str
    preferred_time: str

class DailyRequest(BaseModel):
    email: str
    day:   int

class EmailRequest(BaseModel):
    email: str
    day:   int

# ─── Routes ──────────────────────────────────────────────────────────────────

@router.post("/start")
def start(req: StartRequest):
    return start_challenge(req.email, req.duration, req.goal, req.preferred_time)


@router.get("/status")
def status(email: str):
    return get_challenge(email)


@router.get("/daily")
def daily(email: str, day: int):
    challenge = get_challenge(email)
    if challenge["status"] == "not_found":
        return challenge
    goal = challenge["challenge"]["goal"]
    return get_daily_content(goal, day)


@router.post("/send-pdf")
def send_pdf(req: EmailRequest):
    challenge = get_challenge(req.email)
    if challenge["status"] == "not_found":
        return challenge

    goal    = challenge["challenge"]["goal"]
    content = get_daily_content(goal, req.day)

    pdf_path = generate_daily_pdf(
        email    = req.email,
        day      = req.day,
        goal     = content["goal"],
        meal_plan= content["meal_plan"],
        workout  = content["workout"],
        tip      = content["tip"],
    )

    return send_daily_plan(req.email, req.day, content["goal"], pdf_path)


@router.delete("/cancel")
def cancel(email: str):
    return cancel_challenge(email)