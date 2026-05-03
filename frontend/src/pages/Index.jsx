import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div>

      {/* HERO */}
      <div className="hero">
        <div className="overlay">

          <h1>
            Detect Plant Diseases <br />
            <span>Instantly</span>
          </h1>

          <p>
            Upload a photo of any leaf and let AI identify diseases,
            nutrient deficiencies, and health issues in seconds.
          </p>

          <button onClick={() => navigate("/predict")}>
            Start Scanning ↓
          </button>

        </div>
      </div>

      {/* SCAN SECTION */}
      <section id="scan" className="scan">

        <h2>Scan Your Leaf</h2>
        <p>Drop a leaf image below and our AI will analyze it.</p>

        {/* ✅ FIXED UPLOAD BOX */}
        <div className="upload-box">
          <div className="upload-content">

            <div className="upload-icon">📤</div>

            <h3 className="upload-title">
              Drag & Drop your leaf image
            </h3>

            <p className="upload-sub">
              or click to browse
            </p>

            <span className="upload-format">
              JPG, PNG • Max 10MB
            </span>

          </div>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how">

        <h2>How It Works</h2>
        <p>Three simple steps</p>

        <div className="cards">

          <div className="card">
            📷
            <h3>Capture</h3>
            <p>Upload leaf image</p>
          </div>

          <div className="card">
            🤖
            <h3>Analyze</h3>
            <p>AI detects disease</p>
          </div>

          <div className="card">
            📄
            <h3>Results</h3>
            <p>Get diagnosis & treatment</p>
          </div>

        </div>

      </section>

      {/* WHY SECTION */}
      <section id="why" className="why">

        <h2>Why LeafScan?</h2>

        <div className="why-grid">

          <div className="why-card">
            ⚡ Instant Detection
            <p>Get results in seconds</p>
          </div>

          <div className="why-card">
            🛡 High Accuracy
            <p>AI trained on real data</p>
          </div>

          <div className="why-card">
            🌍 100+ Diseases
            <p>Wide crop coverage</p>
          </div>

          <div className="why-card">
            🌱 Treatment Tips
            <p>Actionable solutions</p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer>
        @ 2026 LeafScan. Helping plants thrive.
      </footer>

    </div>
  );
}