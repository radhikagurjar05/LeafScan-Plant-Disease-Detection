import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/history?email=${localStorage.getItem("user")}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.history));
  }, []);

  return (
    <div className="history-container">
      <h1>Scan History</h1>
      <p className="subtitle">
        Your past leaf scans with confidence scores
      </p>

      {history.map((item, index) => (
        <div key={index} className="history-card">

          {/* LEFT IMAGE */}
          <img
            src={`http://127.0.0.1:5000/static/${item.image}`}
            alt="leaf"
            className="history-img"
          />

          {/* RIGHT CONTENT */}
          <div className="history-content">

            <p className="date">{item.date}</p>

            <h3 className="disease">
              {item.disease.replaceAll("_", " ")}
            </h3>

            {/* PROGRESS BAR */}
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${(item.confidence * 100).toFixed(0)}%`,
                }}
              ></div>
              <span className="percent">
                {(item.confidence * 100).toFixed(0)}%
              </span>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}