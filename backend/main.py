# backend/main.py
import logging
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import QuizInput
from prompt_builder import build_prompt
from ai_client import get_ai_response

logger = logging.getLogger("trading_path_builder")

app = FastAPI(title="Trading Path Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, exc: RequestValidationError):
    logger.warning("Validation error: %s", exc.errors())
    first_error = exc.errors()[0]["msg"] if exc.errors() else "invalid payload"
    return JSONResponse(
        status_code=400,
        content={"error": f"Bad request: {first_error}"},
    )


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "message": "Backend is running"}


@app.post("/generate-summary", tags=["ai"])
async def generate_summary(body: QuizInput):
    """Accept quiz answers, forward to OpenAI, and return the generated summary."""
    try:
        answers = body.model_dump()
        logger.debug("Received answers: %s", answers)

        prompt = build_prompt(answers)
        logger.debug("Built prompt preview: %s", prompt[:400])

        summary = get_ai_response(prompt)
        logger.debug("AI summary snippet: %s", summary[:200])

        return {"summary": summary}
    except RuntimeError as exc:
        logger.exception("AI client failed")
        return JSONResponse(
            status_code=502,
            content={"error": "Server is busy. Please try again in a minute."},
        )
    except Exception:
        logger.exception("Unexpected error while generating summary")
        return JSONResponse(
            status_code=500,
            content={"error": "Server is busy. Please try again in a minute."},
        )
