// src/components/quiz.js
import React, { useState } from "react";

/**
 * Quiz component (text answers)
 * Props:
 * - onComplete(answers)  -> called when user finishes the stored questions (answers is an object)
 *
 * Behavior:
 * - Q0 is a non-stored Yes/No button. If user selects No, we show a friendly message and stop.
 * - Honesty nudge is an info screen (not stored).
 * - Then 10 stored questions: user types free-text answers (textarea), one screen per question.
 * - Back / Next navigation, simple validation (non-empty).
 */

const QUESTIONS = [
  // Note: Q0 and honesty are handled inside component flow (Q0 not stored, honesty not stored)
  {
    key: "experience",
    label: "How would you describe your current experience with trading?",
    placeholder:
      "Describe your experience in your own words (e.g. 'Just getting started', 'I have placed a few trades', or 'I trade often and feel comfortable').",
  },
  {
    key: "years",
    label: "How many years have you been actively learning or trading?",
    placeholder: "Write how long you've been learning/trading (e.g. '<1', '1-2', '3-5', '5+').",
  },
  {
    key: "goal",
    label: "What is your current goal?",
    placeholder:
      "Say what you want from trading (e.g. 'Learn the basics', 'Consistent part-time gains', 'Eventually trade full-time').",
  },
  {
    key: "style",
    label: "Which style attracts you the most?",
    placeholder:
      "Describe the style that interests you (e.g. 'Swing trading because I have limited time', 'Day trading', 'Long-term investing').",
  },
  {
    key: "time",
    label: "How much time can you realistically dedicate per day?",
    placeholder:
      "Be honest about daily time you can commit (e.g. '<1h', '1-2h', '3+h', 'Varies between days').",
  },
  {
    key: "learning",
    label: "How do you learn best?",
    placeholder:
      "Describe your learning style (e.g. 'Step by step courses', 'Watching real trade examples', 'Hands-on trial and error').",
  },
  {
    key: "frustration",
    label: "What is your biggest frustration right now?",
    placeholder:
      "Explain what's holding you back (e.g. 'Too much info', 'Inconsistent results', 'Emotional decision-making').",
  },
  {
    key: "tools",
    label: "Do you use any tools today?",
    placeholder:
      "List tools you use (e.g. 'None', 'TradingView charting', 'A specific exchange', 'I use Python for backtesting').",
  },
  {
    key: "risk",
    label: "How comfortable are you with risk and volatility?",
    placeholder:
      "Describe your risk comfort (e.g. 'Prefer safety', 'I accept some risk with clear rules', 'I like volatile setups').",
  },
  {
    key: "focus",
    label: "What are you more interested in right now?",
    placeholder:
      "Write what you most want to improve (e.g. 'Mindset and discipline', 'Specific tools and strategies', 'Both equally').",
  },
];

function Quiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [q0Answered, setQ0Answered] = useState(false); // whether user picked Yes on Q0
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [showHonesty, setShowHonesty] = useState(false);
  const [error, setError] = useState("");

  // Flow:
  // step 0 = Q0 (Yes/No)
  // step 1 = honesty prompt (info)
  // step 2.. => stored questions index = step - 2
  const totalSteps = 2 + QUESTIONS.length; // Q0 + honesty + stored questions

  const progressPercent = Math.round(((step + 1) / totalSteps) * 100);

  const currentStoredIndex = step - 2;
  const isStoredStep = step >= 2 && currentStoredIndex < QUESTIONS.length;

  const handleQ0 = (answer) => {
    if (answer === "No") {
      // user chose No: polite message and stop the flow
      alert("No problem. Come back when you are ready.");
      // reset to start (or optionally could navigate away)
      setStep(0);
      return;
    }
    // Yes: move to honesty prompt
    setQ0Answered(true);
    setStep(1);
  };

  const handleContinueFromHonesty = () => {
    setShowHonesty(false);
    setStep(2); // first stored question
    setInput("");
    setError("");
  };

  const handleNext = () => {
    // validate input for stored steps
    if (isStoredStep) {
      if (!input || input.trim().length < 1) {
        setError("Please type your answer to proceed.");
        return;
      }
      setError("");
      const key = QUESTIONS[currentStoredIndex].key;
      setAnswers((prev) => ({ ...prev, [key]: input.trim() }));
    }

    // move forward
    if (step + 1 < totalSteps) {
      setStep((s) => s + 1);
      // prefill next input if we already have an answer
      const nextIndex = step + 1 - 2;
      if (nextIndex >= 0 && nextIndex < QUESTIONS.length) {
        const nextKey = QUESTIONS[nextIndex].key;
        setInput(answers[nextKey] || "");
      } else {
        setInput("");
      }
    } else {
      // finished all stored questions -> call onComplete with answers
      onComplete(answers);
    }
  };

  const handleBack = () => {
    // if at honesty screen, go back to Q0
    if (step === 1) {
      setStep(0);
      return;
    }

    if (step === 0) return;

    // if going back from a stored question, save current input into answers
    if (isStoredStep) {
      const key = QUESTIONS[currentStoredIndex].key;
      setAnswers((prev) => ({ ...prev, [key]: input.trim() }));
    }

    const prevStep = Math.max(0, step - 1);
    setStep(prevStep);

    // populate input with previous saved answer if any
    const prevIndex = prevStep - 2;
    if (prevIndex >= 0 && prevIndex < QUESTIONS.length) {
      const prevKey = QUESTIONS[prevIndex].key;
      setInput(answers[prevKey] || "");
    } else {
      setInput("");
    }
    setError("");
  };

  // Render helpers
  if (step === 0) {
    return (
      <div className="card">
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>Do you want to learn more about markets?</h2>
          <p style={{ color: "#bbb", marginTop: 8 }}>
            (Quick — this will not be saved)
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            className="cta-button"
            onClick={() => handleQ0("Yes")}
            style={{ minWidth: 120 }}
          >
            Yes
          </button>
          <button
            onClick={() => handleQ0("No")}
            className="secondary-button"
            style={{ minWidth: 120 }}
          >
            No
          </button>
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: "#9aa" }}>
          Tip: honest answers give better suggestions.
        </div>
      </div>
    );
  }

  if (step === 1) {
    // honesty nudge screen
    return (
      <div className="card">
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ margin: 0 }}>Honesty nudge</h3>
          <p style={{ color: "#ccc", marginTop: 10 }}>
            The more honest you are, the more accurate your path will be.
            This is not about proving anything. It is about clarity.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="cta-button" onClick={handleContinueFromHonesty}>
            Continue
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setStep(0);
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Stored question screens (step >=2)
  const q = QUESTIONS[currentStoredIndex];

  return (
    <div className="card">
      <div style={{ marginBottom: 12 }}>
        <div className="progress" aria-hidden>
          <div
            className="progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ color: "#9aa", fontSize: 13 }}>
            Question {currentStoredIndex + 1} of {QUESTIONS.length}
          </div>
          <div style={{ color: "#9aa", fontSize: 13 }}>{progressPercent}%</div>
        </div>
      </div>

      <h3 style={{ marginTop: 12 }}>{q.label}</h3>

      <textarea
        className="input-box"
        rows={5}
        value={input}
        placeholder={q.placeholder}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        style={{ resize: "vertical" }}
      />

      {error && <div style={{ color: "#ffb3b3", marginBottom: 8 }}>{error}</div>}

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button className="secondary-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="cta-button"
          onClick={handleNext}
          disabled={!input || input.trim().length === 0}
        >
          {currentStoredIndex + 1 === QUESTIONS.length ? "Build My Plan" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
