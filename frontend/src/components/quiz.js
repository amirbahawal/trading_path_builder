import React, { useState } from "react";
import { sendAnswers } from "../api";

const questions = [
  { key: "experience", text: "What is your trading experience?" },
  { key: "years", text: "How many years have you been trading?" },
  { key: "goal", text: "What is your main trading goal?" },
  { key: "style", text: "What trading style do you prefer?" },
  { key: "time", text: "How much time can you spend daily?" },
  { key: "learning", text: "What is your learning preference?" },
  { key: "frustration", text: "What frustrates you the most in trading?" },
  { key: "risk", text: "What is your risk tolerance?" },
  { key: "tools", text: "Which trading tools do you use?" },
  { key: "focus", text: "Do you focus on technical, fundamental, or both?" }
];

function Quiz({ answers, setAnswers, setSummary }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const key = questions[step].key;
    const newAnswers = { ...answers, [key]: input };
    setAnswers(newAnswers);
    setInput("");

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const summaryText = await sendAnswers(newAnswers);
      setSummary(summaryText);
      setLoading(false);
    }
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="quiz">
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {loading ? (
        <p className="loading">⏳ Generating your plan...</p>
      ) : (
        <>
          <h3>{questions[step].text}</h3>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
          />
          <button className="cta-button" onClick={handleNext}>
            {step < questions.length - 1 ? "Next" : "Build My Plan"}
          </button>
          <p className="muted">Question {step + 1} of {questions.length}</p>
        </>
      )}
    </div>
  );
}

export default Quiz;
