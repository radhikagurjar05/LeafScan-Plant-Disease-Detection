import { useState } from "react";
import axios from "axios";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";

export default function Predict() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file) {
      alert("Upload image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // 🔥 PREDICT API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/predict`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API RESULT:", response.data);

      if (response.data.error) {
        alert(response.data.error);
        setLoading(false);
        return;
      }

      setResult(response.data);

      // 🔥 DEBUG (optional)
      console.log("SENDING TO HISTORY:", {
        email: localStorage.getItem("user"),
        disease: response.data.disease,
        confidence: response.data.confidence,
        image: response.data.image,
      });

      // 🔥 SAVE HISTORY (Only if logged in)
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/save-history`, {
          email: loggedInUser,
          disease: response.data.disease || "Unknown",
          confidence: response.data.confidence || 0,
          image: response.data.image || "",
          date: new Date().toLocaleString(),
        });
      }

    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="predict-page">
      <h1 className="predict-title">Scan Your Leaf</h1>

      <p className="predict-sub">
        Drop a leaf image and our AI will analyze it
      </p>

      {/* Upload Component */}
      <UploadCard onFile={setFile} />

      {/* Analyze Button */}
      <button className="analyze-btn" onClick={handlePredict}>
        🌿 Analyze Plant
      </button>

      {/* Loader */}
      {loading && <Loader />}

      {/* Result */}
      {result && <ResultCard result={result} />}
    </div>
  );
}