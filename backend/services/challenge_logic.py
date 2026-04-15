from datetime import date, timedelta
from services.storage import load_challenges, save_challenges

# ─── Challenge Blueprints ───────────────────────────────────────────────────

CHALLENGE_PLANS = {
    30: {
        "name": "30 Day Challenge",
        "phases": [
            {"days": "1-10",  "focus": "Foundation", "intensity": "Light"},
            {"days": "11-20", "focus": "Build",       "intensity": "Moderate"},
            {"days": "21-30", "focus": "Peak",        "intensity": "High"},
        ]
    },
    60: {
        "name": "60 Day Challenge",
        "phases": [
            {"days": "1-15",  "focus": "Foundation", "intensity": "Light"},
            {"days": "16-30", "focus": "Build",       "intensity": "Moderate"},
            {"days": "31-45", "focus": "Peak",        "intensity": "High"},
            {"days": "46-60", "focus": "Elite",       "intensity": "Very High"},
        ]
    }
}

# ─── Daily Meal Plans ───────────────────────────────────────────────────────

FAT_LOSS_MEALS = [
    {"breakfast": "Oats + banana + green tea",           "lunch": "2 roti + dal + salad",        "snack": "Sprouts chaat",        "dinner": "1 roti + vegetable soup"      },
    {"breakfast": "Poha + buttermilk",                   "lunch": "Brown rice + rajma + salad",  "snack": "Fruit bowl",           "dinner": "Moong dal chilla"             },
    {"breakfast": "Upma + green tea",                    "lunch": "2 roti + sabzi + curd",       "snack": "Roasted chana",        "dinner": "Vegetable khichdi"            },
]

MUSCLE_MEALS = [
    {"breakfast": "Soya milk + 2 roti + peanut butter",  "lunch": "3 roti + paneer curry + dal", "snack": "Roasted chana + milk", "dinner": "2 roti + soyabean curry + curd"},
    {"breakfast": "Banana + peanut butter toast + milk", "lunch": "Rajma rice + salad + curd",   "snack": "Dry fruits + milk",    "dinner": "Paneer bhurji + 2 roti"       },
    {"breakfast": "Sprouts + milk + banana",             "lunch": "Chole + 3 roti + salad",      "snack": "Boiled chana + lemon", "dinner": "Tofu stir fry + rice"         },
]

# ─── Daily Workout Plans ────────────────────────────────────────────────────

FAT_LOSS_WORKOUTS = [
    ["Jumping Jacks 3x30", "Pushups 3x15",        "Squats 3x20",       "Plank 3x40sec",        "Mountain Climbers 3x20"],
    ["High Knees 3x1min",  "Burpees 3x10",        "Lunges 3x12",       "Bicycle Crunches 3x20","Wall Sit 3x45sec"      ],
    ["Jump Squats 3x15",   "Diamond Pushups 3x12","Glute Bridge 3x20", "Leg Raises 3x15",      "Plank 3x1min"          ],
]

MUSCLE_WORKOUTS = [
    ["Wide Pushups 4x15",    "Squats 4x20",               "Plank 3x1min",     "Dips 3x12",        "Lunges 3x15"      ],
    ["Diamond Pushups 4x12", "Jump Squats 3x15",          "Glute Bridge 4x20","Pike Pushups 3x12","Plank 3x1min"      ],
    ["Pushups 4x20",         "Bulgarian Split Squats 3x12","Tricep Dips 3x15","Leg Raises 3x20",  "Side Plank 3x40sec"],
]

TIPS = {
    "fat_loss":    "Stay hydrated! Drink at least 3L water today 💧",
    "muscle_gain": "Focus on slow controlled reps for maximum muscle activation 💪",
}

# ─── Load from disk on startup ───────────────────────────────────────────────

active_challenges = load_challenges()

# ─── Core Functions ─────────────────────────────────────────────────────────

def start_challenge(email: str, duration: int, goal: str, preferred_time: str) -> dict:
    if duration not in [30, 60]:
        return {"error": "Duration must be 30 or 60 days"}

    challenge = {
        "email":          email,
        "duration":       duration,
        "goal":           goal,
        "preferred_time": preferred_time,
        "start_date":     str(date.today()),
        "end_date":       str(date.today() + timedelta(days=duration)),
        "current_day":    1,
        "active":         True,
        "plan":           CHALLENGE_PLANS[duration],
    }

    active_challenges[email] = challenge
    save_challenges(active_challenges)
    return {"status": "success", "message": f"{duration} day challenge started!", "challenge": challenge}


def get_challenge(email: str) -> dict:
    if email not in active_challenges:
        return {"status": "not_found", "message": "No active challenge found"}
    return {"status": "success", "challenge": active_challenges[email]}


def get_daily_content(goal: str, day: int) -> dict:
    i       = (day - 1) % 3
    meals   = FAT_LOSS_MEALS[i]    if goal == "fat_loss" else MUSCLE_MEALS[i]
    workout = FAT_LOSS_WORKOUTS[i] if goal == "fat_loss" else MUSCLE_WORKOUTS[i]

    return {
        "day":       day,
        "goal":      "Fat Loss" if goal == "fat_loss" else "Muscle Gain",
        "meal_plan": meals,
        "workout":   workout,
        "tip":       f"Day {day} tip: {TIPS[goal]}",
    }


def cancel_challenge(email: str) -> dict:
    if email not in active_challenges:
        return {"status": "not_found", "message": "No active challenge found"}
    del active_challenges[email]
    save_challenges(active_challenges)
    return {"status": "success", "message": "Challenge cancelled"}