from flask import Flask,  request, render_template, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
from tensorflow.keras.applications.efficientnet import preprocess_input
from openai import OpenAI
import os
import sqlite3
from datetime import datetime
from dotenv import load_dotenv
from google import genai


from flask import send_from_directory


client = genai.Client(api_key="AIzaSyD8ABl_7kw9X_PDXBJXRpc8NP-gUZwRkyM")

# Load env
load_dotenv()
#AIzaSyD8ABl_7kw9X_PDXBJXRpc8NP-gUZwRkyM
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load model
disease_model = tf.keras.models.load_model("plant_disease_model.h5", compile=False)

# Load class mapping
with open("classes.json", "r") as f:
    class_indices = json.load(f)

classes = {v: k for k, v in class_indices.items()}

# Load disease info
with open("disease_info.json") as f:
    disease_info = json.load(f)


@app.route('/')
def home():
    return render_template('index.html')


# ================= LOGIN =================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("database.db")
    conn.execute(
        "INSERT INTO users (name,email,password) VALUES (?,?,?)",
        (name, email, password)
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (email, password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failed"})


# ================= PREDICT =================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']

        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        img = np.array(img)
        img = preprocess_input(img)
        img = np.expand_dims(img, axis=0)

        prediction = disease_model.predict(img)

        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))
        predicted_class = classes[predicted_index]

        info = disease_info.get(predicted_class, {})

        conn = sqlite3.connect("database.db")
        conn.execute(
            """
            INSERT INTO history (user_email,disease,confidence,image,date)
            VALUES (?,?,?,?,?)
            """,
            (
                "user@example.com",
                predicted_class,
                confidence,
                file.filename,
                datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            )
        )
        conn.commit()
        conn.close()

        return jsonify({
            "disease": predicted_class,
            "confidence": confidence,
            "cause": info.get("cause"),
            "symptoms": info.get("symptoms"),
            "treatment": info.get("treatment"),
            "prevention": info.get("prevention")
        })

    except Exception as e:
        return jsonify({"error": str(e)})


# ================= HISTORY =================
@app.route("/history", methods=["GET"])
def get_history():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row

    rows = conn.execute(
        "SELECT disease, confidence, image, date FROM history ORDER BY id DESC"
    ).fetchall()

    conn.close()

    history_data = []
    for r in rows:
        history_data.append({
            "disease": r[0],
            "confidence": r[1],
            "image": r[2],
            "date": r[3]
        })

    return jsonify({"history": history_data})

@app.route('/static/<path:filename>')
def serve_image(filename):
    return send_from_directory('static', filename)

# ================= AI =================
@app.route("/ask-ai", methods=["POST"])
def ask_ai():
    try:
        data = request.get_json()
        message = data.get("message", "").lower()

        # SIMPLE AI LOGIC (NO API)
        if "potato" in message:
            reply = "For potato diseases, use fungicides like Mancozeb or Chlorothalonil. Ensure proper watering and remove infected leaves."

        elif "pesticide" in message:
            reply = "Use neem oil or organic pesticides. Avoid overuse of chemicals and follow crop-specific guidelines."

        elif "yellow leaves" in message:
            reply = "Yellow leaves may indicate overwatering or nutrient deficiency. Check soil drainage and add nitrogen fertilizer."

        elif "mites" in message:
            reply = "Use insecticidal soap or neem oil spray weekly to control mites."

        else:
            reply = "I can help with plant diseases, treatments, and care tips 🌱"

        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "Something went wrong 😢"})
if __name__ == "__main__":
    app.run(debug=True)

    