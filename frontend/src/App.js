// src/App.js
import React, { useRef, useState } from "react";
import Quiz from "./components/quiz";
import Summary from "./components/summary";
import "./style.css";

function App() {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stageRef = useRef(null);
  const cardRef = useRef(null);

  const handleQuizComplete = async (collectedAnswers) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setSummary("");
  };

  const handleMouseMove = (event) => {
    if (!stageRef.current || !cardRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const percentX = Math.min(Math.max(x / rect.width, 0), 1);
    const percentY = Math.min(Math.max(y / rect.height, 0), 1);

    const tiltX = (0.5 - percentY) * 18; // rotateX (vertical)
    const tiltY = (percentX - 0.5) * 18; // rotateY (horizontal)

    cardRef.current.style.setProperty("--tilt-x", `${tiltX}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${tiltY}deg`);
    cardRef.current.style.setProperty("--glow-x", `${percentX * 100}%`);
    cardRef.current.style.setProperty("--glow-y", `${percentY * 100}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--tilt-x", "0deg");
    cardRef.current.style.setProperty("--tilt-y", "0deg");
    cardRef.current.style.setProperty("--glow-x", "50%");
    cardRef.current.style.setProperty("--glow-y", "50%");
  };

  return (
    <div className="app-wrapper">
      <div className="background-grid" aria-hidden />
      <div className="background-orb orb-one" aria-hidden />
      <div className="background-orb orb-two" aria-hidden />
      <div
        className="card-stage"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-shell" ref={cardRef}>
          <div className="card-surface">
            <header className="card-header">
              <span className="badge">Interactive Journey</span>
              <h1>Trading Path Builder</h1>
              <p>Honest reflections unlock the most precise AI plan.</p>
            </header>
            <main className={`card-main${isLoading ? " is-loading" : ""}`}>
              {summary ? (
                <Summary summary={summary} onRestart={handleRestart} />
              ) : (
                <Quiz onComplete={handleQuizComplete} />
              )}
            </main>
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner" aria-hidden />
                <p>Composing your personalized path…</p>
              </div>
            )}
          </div>
          <div className="card-shadow" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export default App;
