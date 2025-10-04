import React, { useState } from "react";

function Summary({ summary, onRestart }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      console.error("Copy failed:", error);
      setCopied(false);
    }
  };

  return (
    <section className="summary-panel">
      <div className="summary-panel__header">
        <span className="badge badge--soft">AI Generated</span>
        <h2>Your Trading Path</h2>
        <p>Review the plan, keep what resonates, iterate as you grow.</p>
      </div>
      <pre className="summary-text">{summary}</pre>
      <div className="summary-actions">
        <button onClick={copyToClipboard} className="cta-button">
          Copy to clipboard
        </button>
        <button onClick={onRestart} className="secondary-button">
          Generate another
        </button>
      </div>
      <div className="copy-feedback" role="status" aria-live="polite">
        {copied ? "Summary copied!" : ""}
      </div>
    </section>
  );
}

export default Summary;
