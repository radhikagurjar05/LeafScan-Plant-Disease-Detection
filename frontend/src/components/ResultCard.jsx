import { generatePdfReport } from "../utils/generatePdf";

export default function ResultCard({ result }) {
  if (!result) return null;

  const renderContent = (data) => {
    if (!data) return "N/A";
    if (Array.isArray(data)) {
      return (
        <ul className="result-list">
          {data.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p>{data}</p>;
  };

  const confidenceScore = Number(result.confidence || 0);

  const getConfidenceBadge = (score) => {
    if (score >= 80) return { label: "High Confidence", color: "#16a34a", bg: "#dcfce7" };
    if (score >= 50) return { label: "Moderate Confidence", color: "#d97706", bg: "#fef3c7" };
    return { label: "Low Confidence", color: "#dc2626", bg: "#fee2e2" };
  };

  const badge = getConfidenceBadge(confidenceScore);

  return (
    <div className="result-wrapper">
      <div className="result-card">

        <div className="result-header">
          <div>
            <h2>🌿 Diagnosis &amp; Remedy Plan</h2>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span className="confidence-pill" style={{ background: badge.bg, color: badge.color }}>
              {badge.label} ({confidenceScore.toFixed(2)}%)
            </span>

            <button
              className="pdf-btn"
              onClick={() => generatePdfReport(result)}
              title="Download Diagnostic PDF Report"
            >
              📄 Download PDF Report
            </button>
          </div>
        </div>

        <div className="result-grid">

          {/* DISEASE & CONFIDENCE */}
          <div className="result-item highlight">
            <h4>Detected Issue / Disease</h4>
            <p className="disease-title">{result.disease || "Unknown"}</p>
          </div>

          <div className="result-item highlight">
            <h4>Model Confidence</h4>
            <div className="confidence-meter">
              <span className="confidence-num">{confidenceScore.toFixed(2)}%</span>
              <div className="meter-bg">
                <div
                  className="meter-fill"
                  style={{ width: `${Math.min(100, Math.max(0, confidenceScore))}%`, backgroundColor: badge.color }}
                />
              </div>
            </div>
          </div>

          {/* PESTICIDES / FUNGICIDES */}
          <div className="result-item full pesticide-box">
            <h4>🧪 Recommended Pesticides &amp; Fungicides</h4>
            {renderContent(result.pesticides)}
          </div>

          {/* ORGANIC REMEDIES & NUTRIENTS */}
          <div className="result-item organic-box">
            <h4>🍃 Organic Remedies &amp; Nutrients</h4>
            {renderContent(result.organic_nutrients)}
          </div>

          {/* INORGANIC REMEDIES & NUTRIENTS */}
          <div className="result-item inorganic-box">
            <h4>⚡ Inorganic Fertilizers &amp; Chemical Nutrients</h4>
            {renderContent(result.inorganic_nutrients)}
          </div>

          {/* CAUSE */}
          {result.cause && (
            <div className="result-item">
              <h4>🔍 Primary Cause</h4>
              {renderContent(result.cause)}
            </div>
          )}

          {/* SYMPTOMS */}
          {result.symptoms && (
            <div className="result-item">
              <h4>📋 Symptoms</h4>
              {renderContent(result.symptoms)}
            </div>
          )}

          {/* TREATMENT */}
          <div className="result-item full">
            <h4>🛠️ Immediate Treatment Action</h4>
            {renderContent(result.treatment)}
          </div>

          {/* PREVENTION */}
          <div className="result-item full">
            <h4>🛡️ Long-term Prevention &amp; Care</h4>
            {renderContent(result.prevention)}
          </div>

        </div>

        {/* TIP BOX FOR HIGHER ACCURACY */}
        <div className="accuracy-tip-box">
          💡 <strong>Tip to Improve Photo Accuracy (95%+):</strong> Take a sharp close-up photo under bright natural daylight, focusing on a single leaf with visible spots or symptoms against a clear background.
        </div>

      </div>
    </div>
  );
}