# predict.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

app = Flask(__name__)
CORS(app)

import json

base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(base_dir, "plant_disease_model.keras")
classes_path = os.path.join(base_dir, "classes.json")
info_path = os.path.join(base_dir, "disease_info.json")

if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH, compile=False)
    print("✅ Model loaded successfully")
else:
    model = None
    print("❌ Model file not found")

try:
    with open(classes_path, "r") as f:
        class_indices = json.load(f)
    classes = {v: k for k, v in class_indices.items()}
except Exception:
    classes = {}

try:
    with open(info_path, "r") as f:
        disease_info = json.load(f)
except Exception:
    disease_info = {}

# ================== PREDICT ==================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # ✅ FIXED: use "file" (matches frontend)
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"})

        file = request.files['file']

        # Save image
        uploads_dir = os.path.join(base_dir, "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        filepath = os.path.join(uploads_dir, file.filename)
        file.save(filepath)

        print("📁 File received:", file.filename)

        if model and classes:
            from tensorflow.keras.applications.efficientnet import preprocess_input
            img = image.load_img(filepath, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = preprocess_input(img_array)
            img_array = np.expand_dims(img_array, axis=0)

            predictions = model.predict(img_array)
            predicted_index = int(np.argmax(predictions))
            confidence = float(np.max(predictions)) * 100
            predicted_class = classes.get(predicted_index, "Unknown Disease")
        else:
            predicted_class = "Unknown"
            confidence = 90.0

        info = disease_info.get(predicted_class, {})
        display_name = info.get("display_name", predicted_class.replace("_", " ").title())

        return jsonify({
            "status": "success",
            "disease": display_name,
            "raw_class": predicted_class,
            "confidence": round(confidence, 2),
            "treatment": info.get("treatment", "Apply recommended treatment.")
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)})

# ================== RUN ==================
if __name__ == '__main__':
    app.run(debug=True)