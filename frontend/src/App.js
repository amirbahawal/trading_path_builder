// src/App.js
import React, { useState } from "react";
import Quiz from "./components/quiz";
import Summary from "./components/summary";
import "./style.css";

function App() {
  const [summary, setSummary] = useState("");

  // This function will be passed to Quiz
  const handleQuizComplete = async (collectedAnswers) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: Object.values(collectedAnswers) }),
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setSummary("Error: Could not generate summary.");
    }
  };

  const handleRestart = () => {
    setSummary("");
  };

  return (
    <div className="container">
      <h1>Trading Path Builder</h1>
      {summary ? (
        <Summary summary={summary} onRestart={handleRestart} />
      ) : (
        <Quiz onComplete={handleQuizComplete} />
      )}
    </div>
  );
}

export default App;
