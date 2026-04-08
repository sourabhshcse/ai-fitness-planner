def get_workout_plan(goal: str) -> dict:

    if goal == "fat_loss":
        return {
            "goal": "Fat Loss",
            "duration": "45-60 minutes/day",
            "frequency": "5 days a week",
            "warmup": [
                "Jumping jacks — 2 minutes",
                "Arm circles — 1 minute",
                "Leg swings — 1 minute"
            ],
            "exercises": [
                {
                    "name": "Pushups",
                    "sets": 3,
                    "reps": "15-20",
                    "rest": "30 seconds"
                },
                {
                    "name": "Squats",
                    "sets": 3,
                    "reps": "20",
                    "rest": "30 seconds"
                },
                {
                    "name": "Plank",
                    "sets": 3,
                    "reps": "30-45 seconds hold",
                    "rest": "30 seconds"
                },
                {
                    "name": "Mountain Climbers",
                    "sets": 3,
                    "reps": "20 each leg",
                    "rest": "30 seconds"
                },
                {
                    "name": "Burpees",
                    "sets": 3,
                    "reps": "10",
                    "rest": "45 seconds"
                },
                {
                    "name": "High Knees",
                    "sets": 3,
                    "reps": "1 minute",
                    "rest": "30 seconds"
                }
            ],
            "cooldown": [
                "Child pose stretch — 1 minute",
                "Hamstring stretch — 1 minute",
                "Deep breathing — 2 minutes"
            ],
            "tips": [
                "No gym needed — all exercises are home friendly",
                "Do cardio (walking/running) for 20 mins after workout",
                "Stay consistent — results show after 3-4 weeks",
                "Drink water before and after workout"
            ]
        }

    elif goal == "muscle_gain":
        return {
            "goal": "Muscle Gain",
            "duration": "45-60 minutes/day",
            "frequency": "5 days a week",
            "warmup": [
                "Arm circles — 1 minute",
                "Shoulder rotations — 1 minute",
                "Light squats — 10 reps"
            ],
            "exercises": [
                {
                    "name": "Pushups (Wide grip)",
                    "sets": 4,
                    "reps": "12-15",
                    "rest": "60 seconds"
                },
                {
                    "name": "Diamond Pushups",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": "60 seconds"
                },
                {
                    "name": "Squats",
                    "sets": 4,
                    "reps": "15",
                    "rest": "60 seconds"
                },
                {
                    "name": "Lunges",
                    "sets": 3,
                    "reps": "12 each leg",
                    "rest": "60 seconds"
                },
                {
                    "name": "Plank",
                    "sets": 3,
                    "reps": "45-60 seconds hold",
                    "rest": "45 seconds"
                },
                {
                    "name": "Glute Bridge",
                    "sets": 3,
                    "reps": "15",
                    "rest": "45 seconds"
                }
            ],
            "cooldown": [
                "Full body stretch — 2 minutes",
                "Chest stretch — 1 minute",
                "Deep breathing — 2 minutes"
            ],
            "tips": [
                "Focus on slow and controlled movements",
                "Progressive overload — increase reps each week",
                "Rest day is important — muscles grow on rest days",
                "Sleep 8 hours minimum for muscle recovery"
            ]
        }

    else:
        return {"error": "Invalid goal. Use fat_loss or muscle_gain"}