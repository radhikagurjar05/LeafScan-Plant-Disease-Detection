import { useEffect, useState } from "react";
import { generatePdfReport } from "../utils/generatePdf";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/delete-history/${id}`, {
        method: "DELETE",
      });

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete history item");
    }
  };

  // FETCH
  useEffect(() => {
    const email = localStorage.getItem("user");
    if (!email) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/history?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDiseaseName = (name) => {
    if (!name) return "Unknown Disease";
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="history-page">
      <h1 className="title">Scan History</h1>
      <p className="subtitle">
        Your past leaf diagnosis records and AI confidence scores
      </p>

      <div className="history-list">
        {loading ? (
          <p className="empty-msg">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="empty-history">
            <p>🌱 No scan history found yet.</p>
            <span>Scan your first leaf to see records here!</span>
          </div>
        ) : (
          history.map((item) => {
            const conf = item.confidence ? Number(item.confidence).toFixed(0) : 0;
            return (
              <div key={item.id} className="history-card">
                {/* IMAGE */}
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/static/${item.image}`}
                  alt="leaf scan"
                  className="history-img"
                  onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300")}
                />

                {/* CONTENT */}
                <div className="history-content">
                  <div className="history-top-row">
                    <span className="history-date">📅 {item.date || "N/A"}</span>
                    <span className="history-confidence-badge">
                      Confidence: {conf}%
                    </span>
                  </div>

                  <h3 className="history-disease-title">
                    {formatDiseaseName(item.disease)}
                  </h3>

                  {/* PROGRESS BAR */}
                  <div className="history-progress-bg">
                    <div
                      className="history-progress-fill"
                      style={{ width: `${Math.min(100, Math.max(0, conf))}%` }}
                    ></div>
                  </div>

                  {/* ACTION BUTTONS: PDF REPORT & DELETE */}
                  <div className="history-actions">
                    <button
                      className="pdf-btn"
                      onClick={() => generatePdfReport(item)}
                      title="Download Diagnostic PDF Report"
                    >
                      📄 Download PDF Report
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                      title="Delete History Record"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}