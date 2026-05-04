import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/delete-history/${id}`, {
        method: "DELETE",
      });

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // FETCH
  useEffect(() => {
    const email = localStorage.getItem("user");

    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/history?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("HISTORY DATA:", data);
        setHistory(data.history || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="history-page">
      <h1 className="title">Scan History</h1>

      <p className="subtitle">
        Your past leaf scans with confidence scores
      </p>

      <div className="history-list">
        {history.length === 0 ? (
          <p>No history found</p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-card">

              {/* IMAGE */}
              <img
                src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/static/${item.image}`}
                alt="leaf"
                className="history-img"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />

              {/* CONTENT */}
              <div className="history-content">
                <div className="top-row">
                  <span className="date">{item.date}</span>

                  <span className="percent">
                    {item.confidence ? item.confidence.toFixed(0) : 0}%
                  </span>
                </div>

                <h2 className="disease">
                  {item.disease
                    ? item.disease.replaceAll("_", " ")
                    : "Unknown Disease"}
                </h2>

                <p className="desc">
                  Detected:{" "}
                  {item.disease
                    ? item.disease.replaceAll("_", " ")
                    : "Unknown"}
                </p>

                {/* PROGRESS */}
                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.confidence || 0}%`,
                    }}
                  ></div>
                </div>

                {/* DELETE BUTTON */}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑 Delete
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}