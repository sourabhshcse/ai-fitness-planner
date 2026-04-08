def calculate_bmi(weight: float, height: float) -> dict:
    bmi = round(weight / ((height / 100) ** 2), 2)

    if bmi < 18.5:
        category = "Underweight"
        advice = "You need to eat more — focus on protein and healthy calories"
    elif bmi < 25:
        category = "Normal weight"
        advice = "Great! Maintain your current lifestyle"
    elif bmi < 30:
        category = "Overweight"
        advice = "Focus on low calorie diet and regular exercise"
    else:
        category = "Obese"
        advice = "Consult a doctor and start with light exercise and diet control"

    return {
        "bmi": bmi,
        "category": category,
        "advice": advice
    }