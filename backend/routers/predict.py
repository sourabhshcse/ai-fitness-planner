from fastapi import APIRouter
from pydantic import BaseModel
from services.bmi import calculate_bmi
from services.diet import get_diet_plan
from services.workout import get_workout_plan

router = APIRouter()

# ✅ Input model
class UserInput(BaseModel):
    age: int
    weight: float
    height: float
    goal: str  # "fat_loss" or "muscle_gain"

# ✅ Main predict endpoint
@router.post("/predict")
def predict(data: UserInput):

    # Step 1 — Calculate BMI
    bmi_result = calculate_bmi(data.weight, data.height)

    # Step 2 — Get Diet Plan
    diet_result = get_diet_plan(data.goal, bmi_result["bmi"])

    # Step 3 — Get Workout Plan
    workout_result = get_workout_plan(data.goal)

    return {
        "age": data.age,
        "weight": data.weight,
        "height": data.height,
        "goal": data.goal,
        "bmi": bmi_result,
        "diet_plan": diet_result,
        "workout_plan": workout_result
    }