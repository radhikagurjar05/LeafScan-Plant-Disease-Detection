import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ConfidenceChart({ confidence }) {

  const data = {
    labels: ["Confidence", "Remaining"],
    datasets: [
      {
        data: [confidence * 100, 100 - confidence * 100],
        backgroundColor: ["#4CAF50", "#ddd"],
        borderWidth: 0
      }
    ]
  };

  return (
    <div style={{ width: "250px", margin: "20px auto" }}>
      <Pie data={data} />
    </div>
  );
}