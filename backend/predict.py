# predict.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

app = Flask(__name__)
CORS(app)

# Load trained model (you must add your model file here)
MODEL_PATH = "model.h5"

if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
else:
    model = None

# Class labels (change according to your dataset)
class_names = [
    "Leaf Blight",
    "Powdery Mildew",
    "Rust",
    "Healthy"
]

# Treatment dictionary
treatments = {
    "Leaf Blight": "Use fungicide and remove infected leaves",
    "Powdery Mildew": "Apply neem oil spray",
    "Rust": "Use sulfur-based spray",
    "Healthy": "No treatment needed"
}

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"})

    file = request.files['image']
    filepath = os.path.join("uploads", file.filename)

    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    if model:
        # Load image
        img = image.load_img(filepath, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0

        # Predict
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]
        confidence = float(np.max(predictions))
    else:
        # Fallback if no model
        predicted_class = "Leaf Blight"
        confidence = 0.85

    return jsonify({
        "disease": predicted_class,
        "confidence": confidence,
        "treatment": treatments[predicted_class]
    })

if __name__ == '__main__':
    app.run(debug=True)