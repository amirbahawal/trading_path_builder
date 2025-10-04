# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QuizInput          # your Pydantic model (if you keep it in models.py)
from prompt_builder import build_prompt
from ai_client import get_ai_response

app = FastAPI(title="Trading Path Builder API")

# === CORS configuration ===
# Allow only the local frontend during development.
# In production, change allow_origins to your hosted frontend domain(s).
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "message": "Backend is running"}

@app.post("/generate-summary", tags=["ai"])
async def generate_summary(input: QuizInput):
    """
    Receives quiz answers (as JSON matching QuizInput), builds a prompt,
    sends to the AI client (Mistral/OpenAI depending on your ai_client),
    and returns {"summary": "<text>"}.
    """
    try:
        answers = input.dict()
        # DEBUG: print incoming payload to backend terminal (helpful while testing)
        print("DEBUG: Received answers:", answers)

        prompt = build_prompt(answers)
        # DEBUG: print the prompt (first 400 chars) so you can inspect it if needed
        print("DEBUG: Built prompt:", prompt[:400])

        summary = get_ai_response(prompt)

        # DEBUG: log a snippet of the model reply
        print("DEBUG: AI summary (snippet):", summary[:200])

        return {"summary": summary}
    except Exception as exc:
        # Log the error in terminal for debugging, and return 500 to client
        print("ERROR in /generate-summary:", exc)
        raise HTTPException(status_code=500, detail=str(exc))
