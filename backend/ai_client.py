import os
import requests
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

API_URL = "https://api.mistral.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {MISTRAL_API_KEY}",
    "Content-Type": "application/json"
}

def get_ai_response(prompt: str) -> str:
    try:
        payload = {
            "model": "mistral-tiny",  # or mistral-medium / mistral-large
            "messages": [
                {"role": "system", "content": "You are a mentor for traders."},
                {"role": "user", "content": prompt}
            ]
        }
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"Error: {str(e)}"
