from fastapi import APIRouter
from pydantic import BaseModel
from services.gemini import get_chat_response

router = APIRouter()

# ✅ Input model
class ChatInput(BaseModel):
    message: str

# ✅ Chat endpoint
@router.post("/chat")
def chat(data: ChatInput):
    try:
        response = get_chat_response(data.message)
        return {
            "status": "success",
            "user_message": data.message,
            "bot_response": response
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Something went wrong: {str(e)}"
        }