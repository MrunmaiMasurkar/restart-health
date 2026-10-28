import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
base_url = os.getenv("LLM_ENDPOINT")
model = os.getenv("LLM_MODEL")

if not api_key:
    raise ValueError("OPENROUTER_API_KEY is missing from .env")

client = OpenAI(
    api_key=api_key,
    base_url=base_url
)


def generate_habit_suggestion(
    goal_title: str,
    category: str,
    daily_target: int,
    barrier: str | None
) -> str:
    prompt = f"""
Suggest one practical, encouraging next step for this habit.
Goal: {goal_title}
Category: {category}
Daily target: {daily_target}
Barrier: {barrier or "not specified"}

Keep the answer to 2 short sentences.
Do not give medical advice.
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You generate safe, practical healthy-habit suggestions."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=300
    )

    message = response.choices[0].message

    print("Finish reason:", response.choices[0].finish_reason)
    print("Message content:", repr(message.content))
    print("Refusal:", getattr(message, "refusal", None))
    print("Model used:", response.model)

    if not message.content or not message.content.strip():
        raise RuntimeError(
            "The AI returned no text. Check the diagnostic output above."
        )

    return message.content.strip()