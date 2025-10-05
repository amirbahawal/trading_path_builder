// src/components/quiz.js
import React, { useMemo, useState } from "react";
import { QUIZ_QUESTIONS } from "../constants/questions";

const TOTAL_STEPS = 2 + QUIZ_QUESTIONS.length;

function Quiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");

  const currentStoredIndex = step - 2;
  const isStoredStep = step >= 2 && currentStoredIndex < QUIZ_QUESTIONS.length;

  const progressPercent = useMemo(() => {
    const safeStep = Math.min(step, TOTAL_STEPS - 1);
    return Math.round(((safeStep + 1) / TOTAL_STEPS) * 100);
  }, [step]);

  const currentQuestion = isStoredStep
    ? QUIZ_QUESTIONS[currentStoredIndex]
    : null;

  const syncSelectedForStep = (targetStep, updatedAnswers) => {
    if (targetStep >= 2 && targetStep - 2 < QUIZ_QUESTIONS.length) {
      const upcomingQuestion = QUIZ_QUESTIONS[targetStep - 2];
      setSelectedOption(updatedAnswers[upcomingQuestion.key] || "");
    } else {
      setSelectedOption("");
    }
  };

  const goToStep = (nextStep, updatedAnswers = answers) => {
    const target = Math.min(nextStep, TOTAL_STEPS);
    if (target >= TOTAL_STEPS) {
      onComplete(updatedAnswers);
      return;
    }

    setStep(target);
    syncSelectedForStep(target, updatedAnswers);
    setError("");
  };

  const handleQ0 = (answer) => {
    if (answer === "No") {
      alert("No problem. Come back when you are ready.");
      setStep(0);
      setSelectedOption("");
      return;
    }
    goToStep(1);
  };

  const handleContinueFromHonesty = () => {
    goToStep(2);
  };

  const handleNext = () => {
    if (isStoredStep && currentQuestion) {
      if (!selectedOption) {
        setError("Please choose the option that fits you best.");
        return;
      }

      const updated = {
        ...answers,
        [currentQuestion.key]: selectedOption,
      };
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
    const target = Math.max(0, step - 1);
    goToStep(target);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
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
        <p className="flow-card__subtitle">(Quick check - this will not be saved)</p>
        <div className="button-stack">
          <button className="cta-button" onClick={() => handleQ0("Yes")}>
            Yes, build my plan
          </button>
          <button className="secondary-button" onClick={() => handleQ0("No")}>
            Not right now
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
          Answer with ego off. Your path should match your truth, not your fantasy.
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

  if (!currentQuestion) {
    return null;
  }

  const questionNumber = currentStoredIndex + 1;
  const isLastQuestion = questionNumber === QUIZ_QUESTIONS.length;

  return (
    <section className="flow-card">
      <div className="progress-wrapper">
        <div className="progress-track" aria-hidden>
          <div className="progress-indicator" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="progress-meta">
          <span>
            Question {questionNumber} of {QUIZ_QUESTIONS.length}
          </span>
          <span>{progressPercent}% complete</span>
        </div>
      </div>

      <div className="question-header">
        <h3 className="flow-card__title">{currentQuestion.label}</h3>
        <p className="flow-card__subtitle flow-card__subtitle--muted">
          Choose the option that describes you best.
        </p>
      </div>

      <div className="option-grid" role="group" aria-label={currentQuestion.label}>
        {currentQuestion.options.map((option) => {
          const isActive = selectedOption === option;
          return (
            <button
              key={option}
              type="button"
              className={`option-button${isActive ? " is-selected" : ""}`}
              onClick={() => handleOptionSelect(option)}
            >
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="error-text" role="alert">
          {error}
        </div>
      )}

      <div className="button-stack button-stack--stretch">
        <button className="secondary-button" onClick={handleBack}>
          Back
        </button>
        <button className="cta-button" onClick={handleNext} disabled={!selectedOption}>
          {isLastQuestion ? "Build My Plan" : "Next"}
        </button>
      </div>
    </section>
  );
}

export default Quiz;
