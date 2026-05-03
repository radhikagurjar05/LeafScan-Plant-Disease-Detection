import { useState } from "react";
import axios from "axios";
import ResultCard from "../ResultCard";

export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) return alert("Upload image");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", localStorage.getItem("user"));

    setLoading(true);

    const res = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData
    );

    setResult(res.data);
    setLoading(false);
  };

  return (
    <div className="upload-card">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handlePredict}>
        {loading ? "Analyzing..." : "Analyze Plant"}
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}