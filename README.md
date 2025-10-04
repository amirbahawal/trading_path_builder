# Trading Path Builder

This repo contains a FastAPI backend and a React frontend for guiding users through a trading readiness quiz and generating an AI-based summary.

## Prerequisites

- Python 3.10+ (for the backend)
- Node.js 18+ with npm (for the frontend build)
- Optional: virtual environment tool (`python -m venv`) for isolating backend dependencies

## Backend Setup

```powershell
python -m venv .venv
.venv\Scripts\Activate
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will default to `http://127.0.0.1:8000`. Update `Backend/.env` with your model keys before calling the AI endpoint.

## Frontend Setup

```powershell
cd frontend
npm install
```

### Run the Development Server

```powershell
npm start
```

This serves the app at `http://localhost:3000` with hot reload.

### Create a Production Build

To produce the optimized bundle (the command you ran earlier):

```powershell
npm run build
```

After the build finishes, the static assets live in `frontend\build`. To preview the production build locally you can use `npx serve -s build` and open the printed URL (typically `http://localhost:5000`).

## Deploying the Frontend

Upload the contents of `frontend\build` to your hosting provider (Netlify, Vercel, S3, etc.). If you will serve the build from a subpath, set the `homepage` field in `frontend/package.json` before building.
