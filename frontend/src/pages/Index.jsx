import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadCard from "../components/UploadCard";
import ResultCard from "../components/ResultCard";
import Loader from "../components/Loader";

export default function Index() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const scanRef = useRef(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/users`)
      .then(res => {
        if (res.data && res.data.users) {
          setUsers(res.data.users);
        }
      })
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const scrollToScan = () => {
    scanRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please upload a leaf image first!");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/predict`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      setResult(response.data);

      // Save history if logged in
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        await axios.post(
          `${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/save-history`,
          {
            email: loggedInUser,
            disease: response.data.disease || "Unknown",
            confidence: response.data.confidence || 0,
            image: response.data.image || "",
            date: new Date().toLocaleString(),
          }
        );
      }
    } catch (err) {
      console.error("ERROR:", err);
      alert("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Upload a photo of leaf and let AI identify diseases,
            nutrient deficiencies, and health issues in seconds.
          </p>
          <button onClick={scrollToScan}>Start Scanning ↓</button>
        </div>
      </div>

      {/* SCAN SECTION — FULLY FUNCTIONAL ON HOME */}
      <section id="scan" className="scan" ref={scanRef}>
        <h2>Scan Your Leaf</h2>
        <p>Drop a leaf image below and our AI will analyze it.</p>

        <UploadCard onFile={setFile} />

        <button className="analyze-btn" onClick={handlePredict}>
          🌿 Analyze Plant
        </button>

        {loading && <Loader />}
        {result && <ResultCard result={result} />}
      </section>

      {/* SUPPORTED CROPS SECTION (MANGO, CHILI, POTATO) */}
      <section id="plants" className="supported-plants">
        <h2>Multi-Plant Support</h2>
        <p>Detect diseases in 3 supported crops with high AI accuracy</p>

        <div className="plant-grid">
          {/* MANGO */}
          <div className="plant-card">
            <div className="plant-card-header">
              <div className="plant-thumbnail-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80"
                  alt="Mango Crop"
                  className="plant-thumbnail"
                />
              </div>
              <div className="plant-header-details">
                <h3>Mango 🥭</h3>
                <span className="plant-badge">8 Disease Classes</span>
              </div>
              <div className="plant-chevron">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            <p className="plant-desc">
              Anthracnose, Powdery Mildew, Bacterial Canker, Die-back, Gall Midge &amp; Sooty Mould
            </p>
          </div>

          {/* CHILI */}
          <div className="plant-card">
            <div className="plant-card-header">
              <div className="plant-thumbnail-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80"
                  alt="Chili Crop"
                  className="plant-thumbnail"
                />
              </div>
              <div className="plant-header-details">
                <h3>Chili 🌶️</h3>
                <span className="plant-badge">4 Disease Classes</span>
              </div>
              <div className="plant-chevron">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            <p className="plant-desc">
              Cercospora Leaf Spot, Powdery Mildew, Mites &amp; Thrips Attack, Healthy leaves
            </p>
          </div>

          {/* POTATO */}
          <div className="plant-card">
            <div className="plant-card-header">
              <div className="plant-thumbnail-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80"
                  alt="Potato Crop"
                  className="plant-thumbnail"
                />
              </div>
              <div className="plant-header-details">
                <h3>Potato 🥔</h3>
                <span className="plant-badge">7 Disease Classes</span>
              </div>
              <div className="plant-chevron">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
            <p className="plant-desc">
              Late Blight (Phytophthora), Bacterial Wilt, Nematodes, Leaf Pests, Virus &amp; Fungal
            </p>
          </div>
        </div>

        {/* COMING SOON BANNER */}
        <div className="coming-soon-banner">
          <span className="coming-soon-icon">💡</span>
          <p>
            <strong>More plants coming soon!</strong> We're constantly expanding our plant database.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — DETAILED 2-3 LINES */}
      <section id="how" className="how">
        <h2>How It Works</h2>
        <p>Three simple steps to diagnose plant health</p>

        <div className="cards">
          <div className="card">
            📷
            <h3>1. Capture &amp; Upload</h3>
            <p>Take or upload a clear, focused photo of your plant leaf directly from your camera or gallery.</p>
          </div>
          <div className="card">
            🤖
            <h3>2. Instant AI Analysis</h3>
            <p>Our deep learning neural network analyzes leaf patterns to accurately detect diseases and confidence score.</p>
          </div>
          <div className="card">
            📄
            <h3>3. Complete Action Plan</h3>
            <p>Receive immediate diagnosis along with organic remedies, chemical pesticides, and preventive care tips.</p>
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
            🌱 3 Key Crops
            <p>Mango, Chili &amp; Potato</p>
          </div>
          <div className="why-card">
            💊 Treatment Tips
            <p>Organic &amp; Chemical remedies</p>
          </div>
        </div>
      </section>

      {/* USER REVIEWS & RATINGS SECTION */}
      <section className="users-section">
        <h2>User Ratings &amp; Feedback</h2>
        <p>What our top users say about their experience with LeafScan</p>

        <div className="ticker-container">
          <div className="ticker-track">
            {/* Set 1 */}
            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">RG</div>
                <div className="user-meta">
                  <h3>Ram Gurjar</h3>
                  <span className="user-role">Mango Cultivator</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "LeafScan is highly accurate! It successfully detected Anthracnose on my mango leaves and the suggested organic remedy saved my crop. Very reliable tool."
              </p>
            </div>

            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">RJ</div>
                <div className="user-meta">
                  <h3>Rashi Jain</h3>
                  <span className="user-role">Home Gardener</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "Very easy to use. I scanned my chili plants and it immediately diagnosed Cercospora Leaf Spot with 98% confidence. The AI Chat also answered all my follow-up questions."
              </p>
            </div>

            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">KR</div>
                <div className="user-meta">
                  <h3>Kanak Rajput</h3>
                  <span className="user-role">Potato Farmer</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "A must-have app for farmers. Diagnosed Late Blight on my potato crops and suggested both chemical and organic solutions. Highly satisfied with the speed and accuracy!"
              </p>
            </div>

            {/* Set 2 (Duplicate for seamless scroll loop) */}
            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">RG</div>
                <div className="user-meta">
                  <h3>Ram Gurjar</h3>
                  <span className="user-role">Mango Cultivator</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "LeafScan is highly accurate! It successfully detected Anthracnose on my mango leaves and the suggested organic remedy saved my crop. Very reliable tool."
              </p>
            </div>

            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">RJ</div>
                <div className="user-meta">
                  <h3>Rashi Jain</h3>
                  <span className="user-role">Home Gardener</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "Very easy to use. I scanned my chili plants and it immediately diagnosed Cercospora Leaf Spot with 98% confidence. The AI Chat also answered all my follow-up questions."
              </p>
            </div>

            <div className="user-card review-card">
              <div className="user-card-top">
                <div className="user-avatar">KR</div>
                <div className="user-meta">
                  <h3>Kanak Rajput</h3>
                  <span className="user-role">Potato Farmer</span>
                </div>
              </div>
              <div className="user-rating">⭐⭐⭐⭐⭐</div>
              <p className="user-feedback">
                "A must-have app for farmers. Diagnosed Late Blight on my potato crops and suggested both chemical and organic solutions. Highly satisfied with the speed and accuracy!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE DEVELOPERS */}
      <section className="developers-section">
        <h2>Meet the Developers</h2>
        <p>Students at Medicaps University building the future of plant health</p>

        <div className="cards" style={{ marginTop: "30px" }}>
          <div className="card">
            👩‍💻
            <h3>Radhika Gurjar</h3>
            <p>Developer</p>
          </div>

          <div className="card">
            👩‍💻
            <h3>Priyanshi Bijghawane</h3>
            <p>Developer</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        © 2026 LeafScan. Helping plants thrive.
      </footer>
    </div>
  );
}