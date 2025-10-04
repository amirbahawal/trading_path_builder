import React from "react";

function Summary({ summary, onRestart }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard!");
  };

  return (
    <div className="summary-box">
      <h2>Your Trading Path</h2>
      <p>{summary}</p>
      <div className="summary-actions">
        <button onClick={copyToClipboard} className="cta-button">Copy</button>
        <button onClick={onRestart} className="secondary-button">Generate Another</button>
      </div>
    </div>
  );
}

export default Summary;
