from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, chat, progress, challenge
from services.email_sender import start_scheduler

app = FastAPI(title="AI Fitness & Diet Planner")
# ─── Start Daily Email Scheduler ─────────────────────────────────────────────
start_scheduler("08:00")  # Change time as you want — 24hr format

# ✅ CORS — allows React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register all routers
app.include_router(predict.router)
app.include_router(chat.router)
app.include_router(progress.router)
app.include_router(challenge.router)

# ✅ Root test route
@app.get("/")
def root():
    return {"message": "AI Fitness Planner API is running!"}
