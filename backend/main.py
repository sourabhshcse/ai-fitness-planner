from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, chat, progress

app = FastAPI(title="AI Fitness & Diet Planner")

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

# ✅ Root test route
@app.get("/")
def root():
    return {"message": "AI Fitness Planner API is running!"}