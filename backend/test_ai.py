from ai_service import generate_habit_suggestion

suggestion = generate_habit_suggestion(
    goal_title="Walk for 20 minutes",
    category="movement",
    daily_target=20,
    barrier="not_enough_time"
)

print("AI suggestion:")
print(suggestion)