import axios from "axios";
import { useState } from "react";

function Chatbot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const askAI = async () => {
    const res = await axios.post("http://localhost:8000/chat/", {
      question: query,
      language: "ta-en"
    });
    setResponse(res.data.answer);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ask Government Scheme Assistant</h2>

      <textarea
        placeholder="Ask in Tamil or English..."
        onChange={e => setQuery(e.target.value)}
        rows="4"
        style={{ width: "100%" }}
      />

      <button onClick={askAI} style={{ marginTop: "10px" }}>
        Ask AI
      </button>

      <div style={{ marginTop: "20px", background: "#F1F5F9", padding: "15px" }}>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default Chatbot;

