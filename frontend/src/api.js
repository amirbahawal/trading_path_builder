export async function sendAnswers(answers) {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
  
      if (!response.ok) {
        console.error("Backend returned non-OK:", response.status, await response.text());
        return "Error from server. Check backend logs.";
      }
  
      const data = await response.json();
      return data.summary || "No summary received";
    } catch (error) {
      console.error("Error calling backend:", error);
      return "Error generating summary (network).";
    }
  }
  