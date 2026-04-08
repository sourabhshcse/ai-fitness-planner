def get_diet_plan(goal: str, bmi: float) -> dict:

    if goal == "fat_loss":
        return {
            "goal": "Fat Loss",
            "calories": "1500-1800 kcal/day",
            "meals": {
                "breakfast": [
                    "Oats with low fat milk",
                    "1 banana",
                    "Green tea (no sugar)"
                ],
                "lunch": [
                    "2 Rotis",
                    "1 bowl Dal",
                    "Sabzi (any vegetable)",
                    "Salad (cucumber + tomato)"
                ],
                "snack": [
                    "1 bowl Sprouts chaat",
                    "1 glass Buttermilk"
                ],
                "dinner": [
                    "1 Roti",
                    "1 bowl Vegetable soup",
                    "1 bowl Curd"
                ]
            },
            "tips": [
                "Avoid fried and junk food completely",
                "Drink minimum 3 litres of water daily",
                "Eat dinner before 8 PM",
                "Avoid sugar and cold drinks",
                "Eat slowly and chew properly"
            ]
        }

    elif goal == "muscle_gain":
        return {
            "goal": "Muscle Gain",
            "calories": "2200-2700 kcal/day",
            "meals": {
                "breakfast": [
                    "4 Whole eggs or 1 cup Soya milk",
                    "2 Rotis with peanut butter",
                    "1 banana"
                ],
                "lunch": [
                    "3-4 Rotis",
                    "1 big bowl Paneer curry",
                    "1 bowl Dal",
                    "1 bowl Rice"
                ],
                "snack": [
                    "1 bowl Roasted chana",
                    "1 glass Milk with turmeric",
                    "Handful of dry fruits"
                ],
                "dinner": [
                    "2 Rotis",
                    "1 bowl Soyabean curry",
                    "1 bowl Curd",
                    "1 bowl Salad"
                ]
            },
            "tips": [
                "Eat every 3-4 hours — never skip meals",
                "Focus on protein in every meal",
                "Drink 4 litres of water daily",
                "Sleep 8 hours — muscles grow during sleep",
                "Avoid junk food even if hungry"
            ]
        }

    else:
        return {"error": "Invalid goal. Use fat_loss or muscle_gain"}