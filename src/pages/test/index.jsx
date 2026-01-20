// src/pages/Test.jsx
import { useEffect } from "react";
import api from "../../service/api"

export default function Test() {

  useEffect(() => {
    api.get("/api/test")
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <p>Check console for backend response</p>
    </div>
  );
}
