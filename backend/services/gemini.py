import os
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# ─── Client Setup ────────────────────────────────────────────────────────────

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ─── System Prompt ───────────────────────────────────────────────────────────

SYSTEM_PROMPT = """
You are an expert AI fitness and diet assistant.
You only answer questions related to:
- Fitness and workouts
- Diet and nutrition
- Weight loss and muscle gain
- Healthy lifestyle
- BMI and body health

Keep your answers clear, structured and friendly.
Use bullet points, bold text and headings to make responses easy to read.
If someone asks something not related to fitness or diet,
politely tell them you can only help with fitness related topics.
Always give vegetarian food suggestions.
Give hostel friendly and home friendly workout suggestions.
"""

# ─── Core Function ───────────────────────────────────────────────────────────

def get_chat_response(message: str, retries: int = 3, delay: int = 2) -> str:
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model  = "gemini-2.5-flash",
                contents = message,
                config = types.GenerateContentConfig(
                    system_instruction = SYSTEM_PROMPT
                )
            )
            return response.text

        except Exception as e:
            error = str(e)

            # ── Retry on 503 ──
            if "503" in error or "UNAVAILABLE" in error:
                if attempt < retries - 1:
                    print(f"⚠️ Gemini 503 — retrying in {delay}s (attempt {attempt + 1}/{retries})")
                    time.sleep(delay)
                    delay *= 2  # exponential backoff: 2s → 4s → 8s
                    continue
                else:
                    return "⚠️ Gemini is experiencing high demand right now. Please try again in a moment!"

            # ── Other errors ──
            return f"Sorry, I could not process your request. Error: {error}"