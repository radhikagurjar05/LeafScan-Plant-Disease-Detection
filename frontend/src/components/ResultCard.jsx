import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="result-wrapper">

      <div className="result-card">

        <h2 className="result-title">🌿 Diagnosis Result</h2>

        <div className="result-grid">

          <div className="result-item">
            <h4>Disease</h4>
            <p>{result.disease}</p>
          </div>

          <div className="result-item">
            <h4>Confidence</h4>
            <p>{(result.confidence * 100).toFixed(2)}%</p>
          </div>

          <div className="result-item full">
            <h4>Treatment</h4>
            <p>{result.treatment}</p>
          </div>

          <div className="result-item full">
            <h4>Prevention</h4>
            <p>{result.prevention}</p>
          </div>

        </div>

      </div>

    </div>
  );
}