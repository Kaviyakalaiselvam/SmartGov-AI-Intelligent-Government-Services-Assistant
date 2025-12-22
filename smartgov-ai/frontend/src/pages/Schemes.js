import axios from "axios";
import { useEffect, useState } from "react";
import SchemeCard from "../components/SchemeCard";

function Schemes() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/schemes/")
      .then(res => setSchemes(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Government Schemes</h2>
      {schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
    </div>
  );
}

export default Schemes;
