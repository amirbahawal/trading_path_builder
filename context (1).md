# context.md

## Project
**Name:** Trading Path Builder  
**One-liner:** Quiz in, personalized trading summary out. Simple MVP built for speed, clarity, and future scale.

---

## Purpose and Scope
Build a minimal but extensible skeleton that does exactly two things:
1) Shows a short, engaging quiz.  
2) Returns a single AI generated “Summary” tailored to the user’s answers.

This version ships without auth, payments, or saved profiles. The code and structure anticipate future features like chapters, subscriptions, multi niche forks, and reusable content blocks.

---

## Core User Flow
1) Landing screen with a single commitment button: **“Yes, build my plan.”**  
2) Honesty nudge: “Answer with ego off. This only works if you tell the truth.”  
3) 10 step quiz, one question per screen, mobile first.  
4) Submit answers → backend formats prompt → AI returns a concise summary.  
5) Summary page displays the result with a copy button and a “Generate another” CTA.

---

## Quiz Content v1
- **Q0 (Button, not stored):** “Do you want to learn more about markets?” [Yes]  
  If No, show: “No problem. Come back when you are ready.”
- **Honesty prompt:** “The more honest you are, the more accurate your path will be. This is not about proving anything. It is about clarity.”

**Stored questions and options**
1) `experience`: How would you describe your current experience with trading?  
   [Just getting started, I know the basics, I have placed a few trades, I trade often, I am consistently profitable]
2) `years`: How many years have you been actively learning or trading?  
   [<1, 1–2, 3–5, 5+]
3) `goal`: What is your current goal?  
   [Learn the basics, Consistent part time, Full time eventually, Long term allocation, Use AI or automation]
4) `style`: Which style attracts you the most?  
   [Scalping, Day trading, Swing trading, Long term investing, Algorithmic or automated, Not sure]
5) `time`: How much time can you realistically dedicate per day?  
   [<1h, 1–2h, 3+h, Varies]
6) `learning`: How do you learn best?  
   [Step by step, Watch real examples, Try and iterate, Read deep theory]
7) `frustration`: Biggest frustration right now?  
   [Too much info, Inconsistent results, Do not know where to start, Emotions and psychology, Systems feel too complex]
8) `tools`: Do you use any tools today?  
   [None, Charting apps, Exchanges, Backtesters or bots or Python]
9) `risk`: How comfortable are you with risk and volatility?  
   [Prefer safety, Some risk with control, I like volatility, Risk is fine if there is edge]
10) `focus`: What are you more interested in right now?  
   [Mindset and discipline, Tools and strategies, Both equally]

---

## Data Contract

### Request payload
```json
{
  "experience": "I know the basics",
  "years": "1–2",
  "goal": "Consistent part time",
  "style": "Swing trading",
  "time": "1–2h",
  "learning": "Watch real examples",
  "frustration": "Inconsistent results",
  "risk": "Some risk with control",
  "tools": "Charting apps",
  "focus": "Both equally"
}
```

### JSON Schema
```json
{
  "type": "object",
  "required": [
    "experience","years","goal","style",
    "time","learning","frustration","risk","tools","focus"
  ],
  "properties": {
    "experience": { "type": "string" },
    "years": { "type": "string" },
    "goal": { "type": "string" },
    "style": { "type": "string" },
    "time": { "type": "string" },
    "learning": { "type": "string" },
    "frustration": { "type": "string" },
    "risk": { "type": "string" },
    "tools": { "type": "string" },
    "focus": { "type": "string" }
  },
  "additionalProperties": false
}
```

### API
- `POST /generate-summary`  
  Input: quiz JSON as above  
  Output:
  ```json
  { "summary": "string" }
  ```
- Errors return:
  ```json
  { "error": "Bad request: <details>" }
  ```

---

## AI Prompting

### System intent
- Role: neutral mentor for traders.  
- Goal: produce a motivating, realistic summary under 300 words.  
- Constraints: avoid hype, avoid financial advice phrasing, give clear direction and pitfalls.

### Prompt template
```
You are a mentor helping someone navigate their trading journey.

Here are their quiz answers:
- Experience level: {experience}
- Years trading: {years}
- Goal: {goal}
- Style: {style}
- Time available: {time}
- Learning style: {learning}
- Current frustration: {frustration}
- Risk tolerance: {risk}
- Tools used: {tools}
- Current focus: {focus}

Write a concise, motivating, and realistic summary under 300 words.
Speak directly to the user in second person.
Include:
1) what likely fits them given time and style,
2) 2 to 4 concrete next steps for the coming week,
3) the top trap they should avoid based on frustration and risk profile.
Do not give financial advice. Do not promise results.
End with a single sentence that reinforces patience and process.
```

### Temperature and length
- temp 0.6 to 0.8  
- max tokens ~500

---

## Tech Stack

- **Frontend:** React or Next.js 14 app router. Mobile first, CSS modules or Tailwind.  
- **Backend:** FastAPI with Pydantic models, Uvicorn.  
- **AI:** OpenAI Chat Completions or Responses API. Key from environment.  
- **Data:** No DB for MVP. Consider adding SQLite or Postgres later.  
- **Deploy:**  
  - Backend: Render or Railway  
  - Frontend: Vercel or Netlify  
- **Analytics (later):** PostHog or Plausible.

---

## Repo Structure

```
trading-path-builder/
├─ backend/
│  ├─ main.py
│  ├─ prompt_builder.py
│  ├─ ai_client.py
│  └─ models.py
├─ frontend/
│  ├─ app/ or src/
│  │  ├─ pages or app/
│  │  ├─ components/
│  │  │  ├─ Quiz/
│  │  │  │  ├─ QuizStepper.tsx
│  │  │  │  ├─ QuestionCard.tsx
│  │  │  │  └─ Progress.tsx
│  │  │  └─ SummaryCard.tsx
│  │  ├─ lib/api.ts
│  │  └─ styles/
├─ .env.example
├─ requirements.txt
└─ README.md
```

---

## Implementation Steps for Cursor AI

### Phase A. Backend scaffold
1) Create FastAPI app with a `POST /generate-summary`.  
2) Define `QuizInput` Pydantic model with the 10 fields, all strings.  
3) Implement `prompt_builder.build_prompt(user_data: dict)`.  
4) Implement `ai_client.get_ai_response(prompt: str)` that calls OpenAI.  
5) Return `{ "summary": "<ai text>" }`.  
6) Add simple error handling and CORS for the frontend.

**Cursor prompt for backend file:**
- Create `backend/main.py`, `backend/prompt_builder.py`, `backend/ai_client.py`, and `backend/models.py`.  
- Add CORS, load `OPENAI_API_KEY` from env, validate body against `QuizInput`.

### Phase B. Frontend scaffold
1) Landing screen with commitment button and honesty prompt.  
2) Quiz stepper with one question per screen and a simple progress indicator.  
3) On submit, call backend, show loading state, then render SummaryCard.  
4) Include copy to clipboard and “Generate another” buttons.  
5) Minimal styling, clean typography, focus on mobile.

**Cursor prompt for frontend:**
- Create a Next.js app.  
- Pages: `/` for quiz, `/summary` optional if you prefer routes.  
- Components in `components/Quiz` and `components/SummaryCard`.  
- `lib/api.ts` with `postSummary(payload)`.

### Phase C. Config and scripts
- `.env.example` with `OPENAI_API_KEY=` and `BACKEND_URL=`.  
- `requirements.txt` with `fastapi`, `uvicorn`, `openai`, `python-dotenv`.  
- NPM scripts for dev server.  
- Backend run: `uvicorn backend.main:app --reload`.

### Phase D. QA
- Validate JSON request types and presence.  
- Try all option combinations to confirm prompt composes correctly.  
- Force error paths and verify user friendly messages.

---

## UI and UX Notes

- Single column layout, large targets, no text input fields for MVP.  
- Use concise microcopy.  
- Progress hint like “7 of 10” to reduce drop off.  
- Keep the summary readable: short paragraphs and bullets for next steps.  
- Include a small disclaimer: “Educational content only. Not financial advice.”

---

## Code Guidelines

- Type everything. Use Pydantic models on the backend and TypeScript on the frontend.  
- Keep functions pure where possible.  
- One component = one job.  
- Centralize answer options in a constants file to avoid drift between UI and backend.  
- All network calls funneled through `lib/api.ts`.

---

## Env and Secrets

- `OPENAI_API_KEY` required by backend.  
- `BACKEND_URL` used by frontend.  
- Never commit real keys. Use `.env.local` in dev and platform secrets in prod.

---

## Error Handling

- On 4xx: show “Check your answers and try again.”  
- On 5xx or OpenAI failure: show “Server is busy. Please try again in a minute.”  
- Log server exceptions with trace. Do not expose stack traces to users.

---

## Scalability and Extension Plan

- Add auth and Stripe for unlocking longer plans.  
- Persist profiles and generated summaries to DB.  
- Introduce modular content blocks so AI fills only the variable parts.  
- Allow multiple “paths” per user and versioning.  
- Add export to PDF.  
- Fork to new niches by swapping question sets and prompt templates.  
- Multi tenant support with a `workspace_id` used to load quiz and prompt presets.

---

## Testing Checklist

- Unit tests for prompt builder: correct interpolation for all fields.  
- Contract tests for `POST /generate-summary` with valid and invalid payloads.  
- Frontend e2e smoke test: full quiz → summary render.  
- Accessibility check: focus order, keyboard nav, aria labels on buttons.

---

## Deployment Outline

- Backend: Render or Railway. Expose HTTPS endpoint.  
- Frontend: Vercel. Configure `BACKEND_URL`.  
- Set proper CORS origins.  
- Add uptime monitoring and logging.

---

## Sample Copy

- Commitment button: “Yes, build my plan”  
- Honesty nudge: “Answer with ego off. Your path should match your truth, not your fantasy.”  
- Summary header: “Your personalized trading summary”
