// src/components/quiz.js
import React, { useState } from "react";

const QUESTIONS = [
  {
    key: "experience",
    label: "How would you describe your current experience with trading?",
    placeholder:
      "Describe your experience in your own words (e.g. 'Just getting started', 'I have placed a few trades', or 'I trade often and feel comfortable').",
  },
  {
    key: "years",
    label: "How many years have you been actively learning or trading?",
    placeholder: "Write how long you have been learning or trading (e.g. '<1', '1-2', '3-5', '5+').",
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
      "Be honest about the daily time you can commit (e.g. '<1h', '1-2h', '3+h', 'Varies between days').",
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
      "Explain what is holding you back (e.g. 'Too much info', 'Inconsistent results', 'Emotional decision-making').",
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
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const totalSteps = 2 + QUESTIONS.length;
  const currentStoredIndex = step - 2;
  const isStoredStep = step >= 2 && currentStoredIndex < QUESTIONS.length;
  const progressPercent = Math.round(
    ((Math.min(step, totalSteps - 1) + 1) / totalSteps) * 100
  );

  const goToStep = (nextStep, updatedAnswers = answers) => {
    const target = Math.min(nextStep, totalSteps);
    if (target >= totalSteps) {
      onComplete(updatedAnswers);
      return;
    }

    setStep(target);
    const nextIndex = target - 2;
    if (nextIndex >= 0 && nextIndex < QUESTIONS.length) {
      const nextKey = QUESTIONS[nextIndex].key;
      setInput(updatedAnswers[nextKey] || "");
    } else {
      setInput("");
    }
    setError("");
  };

  const handleQ0 = (answer) => {
    if (answer === "No") {
      alert("No problem. Come back when you are ready.");
      setStep(0);
      return;
    }
    goToStep(1);
  };

  const handleContinueFromHonesty = () => {
    goToStep(2);
  };

  const handleNext = () => {
    if (isStoredStep) {
      if (!input || input.trim().length === 0) {
        setError("Please type your answer to proceed.");
        return;
      }

      const key = QUESTIONS[currentStoredIndex].key;
      const updated = { ...answers, [key]: input.trim() };
      setAnswers(updated);
      goToStep(step + 1, updated);
      return;
    }

    goToStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      return;
    }

    const prevStep = Math.max(0, step - 1);
    setStep(prevStep);

    const prevIndex = prevStep - 2;
    if (prevIndex >= 0 && prevIndex < QUESTIONS.length) {
      const prevKey = QUESTIONS[prevIndex].key;
      setInput(answers[prevKey] || "");
    } else {
      setInput("");
    }
    setError("");
  };

  if (step === 0) {
    return (
      <section className="flow-card flow-card--intro">
        <div className="flow-card__meta" aria-hidden>
          <span className="stage-pill">Checkpoint 01</span>
          <span className="stage-line" />
          <span className="stage-label">Set your intention</span>
        </div>
        <h2 className="flow-card__title">
          Do you want to learn more about markets?
        </h2>
        <p className="flow-card__subtitle">(Quick check – this will not be saved)</p>
        <div className="button-stack">
          <button className="cta-button" onClick={() => handleQ0("Yes")}>
            Yes
          </button>
          <button className="secondary-button" onClick={() => handleQ0("No")}>
            No
          </button>
        </div>
        <div className="flow-card__hint">Tip: honest answers give better suggestions.</div>
        <div className="insight-chips" aria-hidden>
          <span>Curiosity</span>
          <span>Momentum</span>
          <span>Clarity</span>
        </div>
      </section>
    );
  }

  if (step === 1) {
    return (
      <section className="flow-card flow-card--intro">
        <div className="flow-card__meta" aria-hidden>
          <span className="stage-pill">Honesty Lock</span>
          <span className="stage-line" />
          <span className="stage-label">Transparency powers the AI</span>
        </div>
        <h3 className="flow-card__title">Honesty nudge</h3>
        <p className="flow-card__subtitle">
          The more honest you are, the more accurate your path will be. This is not about
          proving anything. It is about clarity.
        </p>
        <div className="button-stack">
          <button className="cta-button" onClick={handleContinueFromHonesty}>
            Continue
          </button>
          <button className="secondary-button" onClick={() => goToStep(0)}>
            Back
          </button>
        </div>
      </section>
    );
  }

  const q = QUESTIONS[currentStoredIndex];
  const questionNumber = currentStoredIndex + 1;
  const isLastQuestion = questionNumber === QUESTIONS.length;

  return (
    <section className="flow-card">
      <div className="progress-wrapper">
        <div className="progress-track" aria-hidden>
          <div
            className="progress-indicator"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-meta">
          <span>
            Question {questionNumber} of {QUESTIONS.length}
          </span>
          <span>{progressPercent}% complete</span>
        </div>
      </div>

      <div className="question-header">
        <h3 className="flow-card__title">{q.label}</h3>
        <p className="flow-card__subtitle flow-card__subtitle--muted">
          {q.placeholder}
        </p>
      </div>

      <textarea
        className="input-box interactive-textarea"
        rows={6}
        value={input}
        placeholder={q.placeholder}
        onChange={(event) => setInput(event.target.value)}
        autoFocus
      />

      {error && (
        <div className="error-text" role="alert">
          {error}
        </div>
      )}

      <div className="button-stack button-stack--stretch">
        <button className="secondary-button" onClick={handleBack}>
          Back
        </button>
        <button
          className="cta-button"
          onClick={handleNext}
          disabled={!input || input.trim().length === 0}
        >
          {isLastQuestion ? "Build My Plan" : "Next"}
        </button>
      </div>
    </section>
  );
}

export default Quiz;


