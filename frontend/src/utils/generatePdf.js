import { diseaseData } from "./diseaseData";

export const generatePdfReport = (item) => {
  if (!item) return;

  const rawClass = item.raw_class || item.disease || "Unknown";
  const normalizedKey = rawClass.toLowerCase().trim().replace(/ /g, "_");

  const fallbackInfo = diseaseData[normalizedKey] || {};

  const diseaseName =
    item.disease && !item.disease.includes("_")
      ? item.disease
      : fallbackInfo.display_name || rawClass.replace(/_/g, " ").toUpperCase();

  const confidence = item.confidence
    ? Number(item.confidence).toFixed(2)
    : "0.00";
  const userEmail = localStorage.getItem("user") || "Registered User";
  const userName = localStorage.getItem("name") || "Farmer / User";
  const dateStr = item.date || new Date().toLocaleString();
  const imageUrl = item.image
    ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/static/${item.image}`
    : "";

  const cause = item.cause || fallbackInfo.cause || "N/A";
  const pesticides = item.pesticides || fallbackInfo.pesticides || "N/A";
  const organicNutrients =
    item.organic_nutrients || fallbackInfo.organic_nutrients || "N/A";
  const inorganicNutrients =
    item.inorganic_nutrients || fallbackInfo.inorganic_nutrients || "N/A";
  const treatment = item.treatment || fallbackInfo.treatment || "N/A";
  const prevention = item.prevention || fallbackInfo.prevention || "N/A";

  const symptoms = item.symptoms || fallbackInfo.symptoms || [];
  const symptomsHtml = Array.isArray(symptoms)
    ? `<ul>${symptoms.map((s) => `<li>${s}</li>`).join("")}</ul>`
    : `<p>${symptoms}</p>`;

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>LeafScan_Report_${diseaseName.replace(/[^a-zA-Z0-9]/g, "_")}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background: #ffffff;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #16a34a;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .header-title {
          font-size: 24px;
          font-weight: bold;
          color: #15803d;
        }
        .header-subtitle {
          font-size: 12px;
          color: #64748b;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .meta-item strong { color: #334155; }
        .main-section {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .leaf-img {
          width: 160px;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
        }
        .diag-box {
          flex: 1;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 16px;
          border-radius: 8px;
        }
        .diag-name {
          font-size: 20px;
          font-weight: bold;
          color: #166534;
          margin-bottom: 6px;
        }
        .conf-badge {
          display: inline-block;
          background: #22c55e;
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 3px 10px;
          border-radius: 12px;
        }
        .section-box {
          margin-bottom: 16px;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pesticide-box { background: #f0fdf4; border-color: #bbf7d0; }
        .pesticide-box .section-title { color: #166534; }
        .organic-box { background: #f7fee7; border-color: #d9f99d; }
        .organic-box .section-title { color: #3f6212; }
        .inorganic-box { background: #eff6ff; border-color: #bfdbfe; }
        .inorganic-box .section-title { color: #1e40af; }
        .cause-box .section-title { color: #854d0e; }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
          text-align: center;
          font-size: 11px;
          color: #94a3b8;
        }
        ul { margin: 4px 0; padding-left: 20px; }
        li { margin-bottom: 4px; font-size: 13px; }
        p { margin: 4px 0; font-size: 13px; }
      </style>
    </head>
    <body>
      <div className="header">
        <div>
          <div className="header-title">🌿 LeafScan AI Diagnostic Report</div>
          <div className="header-subtitle">Automated Crop Health & Remediations System</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          Medicaps University Research Project<br/>
          Developed by Radhika Gurjar & Priyanshi Bijghawane
        </div>
      </div>

      <div className="meta-grid">
        <div className="meta-item"><strong>Patient / User:</strong> ${userName} (${userEmail})</div>
        <div className="meta-item"><strong>Scan Date & Time:</strong> ${dateStr}</div>
        <div className="meta-item"><strong>Crop Type:</strong> ${diseaseName.split(" ")[0]}</div>
        <div className="meta-item"><strong>Report Status:</strong> Verified AI Diagnosis</div>
      </div>

      <div className="main-section">
        ${
          imageUrl
            ? `<img src="${imageUrl}" class="leaf-img" alt="Scanned Leaf" crossorigin="anonymous" />`
            : `<div class="leaf-img" style="display:flex;align-items:center;justify-content:center;background:#e2e8f0;color:#64748b;font-size:12px;">No Image</div>`
        }
        <div className="diag-box">
          <div className="diag-name">${diseaseName}</div>
          <div className="conf-badge">AI Confidence: ${confidence}%</div>
          <p style="margin-top: 10px; font-size: 12px; color: #166534;">
            High-precision EfficientNet deep neural network diagnosis based on foliar symptom patterns.
          </p>
        </div>
      </div>

      <div className="section-box pesticide-box">
        <div className="section-title">🧪 Recommended Pesticides & Fungicides</div>
        <p>${pesticides}</p>
      </div>

      <div className="section-box organic-box">
        <div className="section-title">🍃 Organic Remedies & Bio-Nutrients</div>
        <p>${organicNutrients}</p>
      </div>

      <div className="section-box inorganic-box">
        <div className="section-title">⚡ Inorganic Chemical Fertilizers & Nutrients</div>
        <p>${inorganicNutrients}</p>
      </div>

      <div className="section-box cause-box">
        <div className="section-title">🔍 Primary Cause & Symptoms</div>
        <p><strong>Cause:</strong> ${cause}</p>
        <div style="margin-top: 6px;"><strong>Symptoms:</strong> ${symptomsHtml}</div>
      </div>

      <div className="section-box">
        <div className="section-title" style="color: #1e293b;">🛠️ Immediate Treatment & Prevention</div>
        <p><strong>Treatment Action:</strong> ${treatment}</p>
        <p><strong>Preventive Care:</strong> ${prevention}</p>
      </div>

      <div className="footer">
        © 2026 LeafScan. Helping plants thrive. Generated on ${new Date().toLocaleDateString()}.
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(reportHtml);
    printWindow.document.close();
  } else {
    alert("Please allow pop-ups for this site to download/print PDF report.");
  }
};
