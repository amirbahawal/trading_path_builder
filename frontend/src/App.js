import React, { useState } from "react";
import Landing from "./components/landing";
import Quiz from "./components/quiz";
import Summary from "./components/summary";
import "./style.css";

function App() {
  const [stage, setStage] = useState("landing"); // landing | quiz | summary
  const [answers, setAnswers] = useState({});
  const [summary, setSummary] = useState("");

  return (
    <div className="container">
      {stage === "landing" && <Landing onStart={() => setStage("quiz")} />}
      {stage === "quiz" && (
        <Quiz
          answers={answers}
          setAnswers={setAnswers}
          setSummary={(s) => {
            setSummary(s);
            setStage("summary");
          }}
        />
      )}
      {stage === "summary" && (
        <Summary
          summary={summary}
          onRestart={() => {
            setAnswers({});
            setSummary("");
            setStage("landing");
          }}
        />
      )}
    </div>
  );
}

export default App;
