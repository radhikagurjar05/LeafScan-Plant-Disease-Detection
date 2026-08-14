download_data.py
🌿 LeafScan – AI Powered Plant Disease Detection

Overview
LeafScan is an AI-powered web application designed to help farmers, gardeners, and plant enthusiasts quickly identify plant diseases through leaf images. Users can upload a photo of a plant leaf, and the system analyzes the image using a deep learning model to detect diseases, nutrient deficiencies, or other plant health issues.

The platform provides instant results along with disease information and recommended treatments, enabling users to take timely action and improve crop health and productivity.

Built with a modern full-stack architecture, LeafScan combines a responsive frontend, a Flask-based backend, and machine learning technology to deliver accurate and user-friendly plant disease diagnosis.

Key Features
📸 Upload leaf images for analysis
🤖 AI-powered disease detection using deep learning
⚡ Instant prediction results
🌱 Disease information and treatment recommendations
📊 Prediction history tracking
🔐 User authentication and personalized dashboard
📱 Responsive design for desktop
☁️ Cloud deployment using Vercel (Frontend) and Render (Backend)

Problem Statement
Plant diseases can significantly reduce crop yield and quality. Traditional disease identification often requires expert knowledge and can be time-consuming. LeafScan addresses this challenge by providing an accessible, fast, and automated solution that enables users to diagnose plant diseases directly from leaf images.

Solution
LeafScan leverages computer vision and machine learning techniques to analyze uploaded leaf images and classify plant diseases. The system processes images through a trained model, generates predictions, and presents users with actionable insights for disease management.

Technology/Tools Stack

Frontend : React.js,Vite, HTML5,CSS3,JavaScript
Backend:Flask,Python,Flask-CORS,Gunicorn
Machine Learning: TensorFlow / Keras,OpenCV,NumPy
Deployment: Frontend: Vercel, Backend: Render
Tools: VS code, Github

⚙️ Installation & Execution Steps
Prerequisites
Install the following software:

Python 3.10+
Node.js 18+
npm
Git

1️⃣ Clone the Repository
git clone https://github.com/radhikagurjar05/LeafScan-Plant-Disease-Detection

2️⃣ Backend Setup (Flask)

Navigate to backend folder:

cd backend
Create Virtual Environment
python -m venv venv
Activate Virtual Environment
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
Install Dependencies
pip install -r requirements.txt
Run Flask Server
python app.py

or

flask run

Backend will start on:
http://localhost:5000

3️⃣ Frontend Setup (React + Vite)

Open another terminal:
cd frontend
Install Dependencies
npm install
Configure Environment Variable

Create .env file:
VITE_API_URL=http://localhost:5000
Start Development Server
npm run dev

Frontend will start on:
http://localhost:5173

4️⃣ Using the Application
Register a new account.
Login to the platform.
Upload a leaf image.
Click Scan Leaf.
Wait for AI analysis.
View disease prediction and recommendations.
Access previous scans in the History section.

📂 Project Structure
LeafScan/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── model/
│   ├── static/
│   ├── requirements.txt
│   └── uploads/
│
├── README.md
└── .gitignore