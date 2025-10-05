import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY environment variable.")

client = OpenAI(api_key=OPENAI_API_KEY)
DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
SYSTEM_PROMPT = (
    "You are a neutral mentor for traders. Produce a motivating yet realistic summary "
    "under 300 words. Avoid hype, avoid financial-advice phrasing, and highlight clear "
    "direction plus pitfalls."
)

def _temperature() -> float:
    try:
        value = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
    except ValueError:
        value = 0.7
    return max(0.6, min(0.8, value))

def _max_output_tokens() -> int:
    try:
        raw = int(os.getenv("OPENAI_MAX_OUTPUT_TOKENS", "500"))
    except ValueError:
        raw = 500
    return max(100, min(900, raw))

def get_ai_response(prompt: str) -> str:
    try:
        completion = client.chat.completions.create(
            model=DEFAULT_MODEL,
            temperature=_temperature(),
            max_tokens=_max_output_tokens(),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        )
        content = completion.choices[0].message.content
        if content:
            return content.strip()
        raise RuntimeError("OpenAI completion returned no content.")
    except Exception as exc:
        raise RuntimeError(f"OpenAI completion failed: {exc}") from exc
