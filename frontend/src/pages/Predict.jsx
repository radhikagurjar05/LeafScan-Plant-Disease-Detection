import { useState } from "react";
import axios from "axios";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/Resultcard";
import Loader from "../components/Loader";


export default function Predict() {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [Loading, setLoading] = useState(false); 

  const handlePredict = async () => {

    if (!file) return alert("Upload image first");
   try {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://127.0.0.1:5000/predict",
      formData
    );

    setResult(res.data);

  } catch (err){
    console.error(err);
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

    <UploadCard onFile={setFile} />

    <button className="analyze-btn" onClick={handlePredict}>
      🌿 Analyze Planted 
    </button>

    {Loading && <Loader />}

    {result && (
      <>
        <ResultCard result={result} />
      </>
    )}

  </div>
); 
}