# Trading Path Builder

This repo contains a FastAPI backend and a React frontend for guiding users through a trading readiness quiz and generating an AI-based summary.

## Prerequisites
- Python 3.10+ (for the backend)
- Node.js 18+ with npm (for the frontend build)
- Optional: virtual environment tool (`python -m venv`) for isolating backend dependencies

## Backend Setup
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
copy .env.example .env
notepad .env           # paste your OpenAI credentials
uvicorn main:app --reload
```

`backend/.env` requires `OPENAI_API_KEY`. You can also override `OPENAI_MODEL`, `OPENAI_TEMPERATURE` (0.6–0.8), and `OPENAI_MAX_OUTPUT_TOKENS` (default 500). The API listens on `http://127.0.0.1:8000`.

## Frontend Setup
```powershell
cd frontend
copy .env.example .env.local   # optional: point to a remote backend
npm install
```

### Run the Development Server
```powershell
npm start
```
This serves the app at `http://localhost:3000`.

### Create a Production Build
```powershell
npm run build
```
The optimized bundle lives in `frontend\build`. To preview locally:
```powershell
npx serve -s build
```
Then open the URL that `serve` prints (typically `http://localhost:5000`).

## Deploying the Frontend
Upload the contents of `frontend\build` to your hosting provider (Netlify, Vercel, S3, etc.). If you deploy under a subpath, set the `homepage` field in `frontend/package.json` before running `npm run build`.
