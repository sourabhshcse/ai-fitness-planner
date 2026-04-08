from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_chat_response(message: str) -> str:
    try:
        system_prompt = """
        You are an expert AI fitness and diet assistant.
        You only answer questions related to:
        - Fitness and workouts
        - Diet and nutrition
        - Weight loss and muscle gain
        - Healthy lifestyle
        - BMI and body health

        Keep your answers short, clear and friendly.
        If someone asks something not related to fitness or diet,
        politely tell them you can only help with fitness related topics.
        Always give vegetarian food suggestions.
        Give hostel friendly and home friendly workout suggestions.
        """

        response = client.models.generate_content(
          model="gemini-2.5-flash",
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt
            )
        )
        return response.text

    except Exception as e:
        return f"Sorry, I could not process your request. Error: {str(e)}"