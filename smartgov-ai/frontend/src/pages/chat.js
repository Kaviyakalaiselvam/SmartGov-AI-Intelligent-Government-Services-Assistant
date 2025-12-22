import axios from "axios";
import { useState } from "react";

function Chat() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");

  const askAI = async () => {
    const res = await axios.post("http://localhost:8000/chat/", {
      query: query
    });
    setReply(res.data.reply);
  };

  return (
    <div>
      <input onChange={e => setQuery(e.target.value)} />
      <button onClick={askAI}>Ask</button>
      <p>{reply}</p>
    </div>
  );
}

export default Chat;
