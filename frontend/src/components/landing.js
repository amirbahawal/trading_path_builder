import React from "react";

function Landing({ onStart }) {
  return (
    <div className="landing">
      <h1>Trading Path Builder</h1>
      <p className="nudge">
        Answer with <strong>ego off</strong>. This only works if you tell the truth.
      </p>
      <button className="cta-button" onClick={onStart}>
        Yes, build my plan
      </button>
    </div>
  );
}

export default Landing;
