from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import os
import io
import openai
import sqlite3
from datetime import datetime, timedelta
from threading import Lock
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment variables before reading keys
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# ================= SETUP =================
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB upload limit
CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,OPTIONS"
    return response



# ================= LOAD MODEL =================
base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "database.db")
model_path = os.path.join(base_dir, "plant_disease_model.keras")
classes_path = os.path.join(base_dir, "classes.json")
info_path = os.path.join(base_dir, "disease_info.json")

disease_model = tf.keras.models.load_model(model_path, compile=False)

with open(classes_path, "r") as f:
    class_indices = json.load(f)

classes = {v: k for k, v in class_indices.items()}

with open(info_path, "r") as f:
    disease_info = json.load(f)

static_folder = os.path.join(base_dir, "static")
os.makedirs(static_folder, exist_ok=True)
prediction_lock = Lock()

# ================= HOME =================
@app.route('/')
def home():
    return render_template('index.html')


# ================= DATABASE INITIALIZATION =================
def init_db():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            disease TEXT,
            confidence REAL,
            image TEXT,
            date TEXT,
            FOREIGN KEY (user_email) REFERENCES users(email)
        )
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS login_attempts (
            email TEXT PRIMARY KEY,
            attempts INTEGER DEFAULT 0,
            locked_until TEXT
        )
        """)
        conn.commit()
        conn.close()
        print("[DB] Database initialized successfully!")
    except Exception as e:
        print("[DB ERROR] Database initialization error:", e)

init_db()

def verify_password(stored_password, provided_password):
    if not stored_password or not provided_password:
        return False
    # Check if stored_password is a hash
    if stored_password.startswith(("scrypt:", "pbkdf2:", "$2b$", "$2a$")):
        try:
            return check_password_hash(stored_password, provided_password)
        except Exception:
            pass
    # Fallback to plain text match for legacy users
    return stored_password == provided_password


# ================= LOGIN, SIGNUP & LOGOUT =================
@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json or {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not name or not email or not password:
            return jsonify({"status": "failed", "message": "All fields are required"}), 400

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if email is already registered
        cursor.execute("SELECT id FROM users WHERE LOWER(email) = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({"status": "failed", "message": "This email is already registered! Please login instead."}), 400

        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, hashed_password)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Signup successful! Please login."})
    except sqlite3.IntegrityError:
        return jsonify({"status": "failed", "message": "This email is already registered! Please login instead."}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:
            return jsonify({"status": "failed", "message": "Please enter both email and password."}), 400

        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        now = datetime.now()

        # Check lock status
        cursor.execute("SELECT attempts, locked_until FROM login_attempts WHERE email = ?", (email,))
        attempt_row = cursor.fetchone()

        if attempt_row and attempt_row[1]:
            try:
                locked_until = datetime.fromisoformat(attempt_row[1])
                if now < locked_until:
                    remaining_sec = int((locked_until - now).total_seconds())
                    remaining_min = max(1, (remaining_sec + 59) // 60)
                    conn.close()
                    return jsonify({
                        "status": "failed",
                        "message": f"Account locked due to 10 failed login attempts. Please try again in {remaining_min} minute(s)."
                    }), 429
            except Exception:
                pass

        # Check user credentials
        cursor.execute(
            "SELECT id, name, email, password FROM users WHERE LOWER(email) = ?",
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            conn.close()
            return jsonify({"status": "failed", "message": "Invalid email or password."}), 401

        user_id, user_name, user_email, db_password = user

        if not verify_password(db_password, password):
            prev_attempts = attempt_row[0] if attempt_row else 0
            new_attempts = prev_attempts + 1

            if new_attempts >= 10:
                lock_time = (now + timedelta(minutes=15)).isoformat()
                cursor.execute("SELECT email FROM login_attempts WHERE email = ?", (email,))
                if cursor.fetchone():
                    cursor.execute("UPDATE login_attempts SET attempts = ?, locked_until = ? WHERE email = ?", (new_attempts, lock_time, email))
                else:
                    cursor.execute("INSERT INTO login_attempts (email, attempts, locked_until) VALUES (?, ?, ?)", (email, new_attempts, lock_time))
                conn.commit()
                conn.close()
                return jsonify({
                    "status": "failed",
                    "message": "Account locked for 15 minutes due to 10 consecutive failed login attempts."
                }), 429
            else:
                cursor.execute("SELECT email FROM login_attempts WHERE email = ?", (email,))
                if cursor.fetchone():
                    cursor.execute("UPDATE login_attempts SET attempts = ?, locked_until = NULL WHERE email = ?", (new_attempts, email))
                else:
                    cursor.execute("INSERT INTO login_attempts (email, attempts, locked_until) VALUES (?, ?, NULL)", (email, new_attempts))
                conn.commit()
                conn.close()
                left = 10 - new_attempts
                return jsonify({
                    "status": "failed",
                    "message": f"Invalid password. {left} attempt(s) remaining before 15-min lockout."
                }), 401

        # Successful login! Upgrade plain-text password to hash if needed
        if not db_password.startswith(("scrypt:", "pbkdf2:", "$2b$", "$2a$")):
            try:
                new_hash = generate_password_hash(password)
                cursor.execute("UPDATE users SET password = ? WHERE id = ?", (new_hash, user_id))
            except Exception:
                pass

        # Reset login attempts
        cursor.execute("SELECT email FROM login_attempts WHERE email = ?", (email,))
        if cursor.fetchone():
            cursor.execute("UPDATE login_attempts SET attempts = 0, locked_until = NULL WHERE email = ?", (email,))
        else:
            cursor.execute("INSERT INTO login_attempts (email, attempts, locked_until) VALUES (?, 0, NULL)", (email,))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Login successful",
            "user": {"name": user_name, "email": user_email}
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/logout", methods=["POST", "GET"])
def logout():
    return jsonify({
        "status": "success",
        "message": "Logged out successfully"
    })


# ================= PREDICT =================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files.get('file')

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # 🔥 Safe filename
        safe_name = secure_filename(file.filename or "leaf.jpg")
        ext = os.path.splitext(safe_name)[1].lower()

        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            ext = ".jpg"

        filename = str(int(datetime.now().timestamp())) + ext
        filepath = os.path.join(static_folder, filename)

        #  Load image bytes and save to disk
        file_bytes = file.read()
        if not file_bytes:
            return jsonify({"error": "Uploaded file is empty"}), 400

        with open(filepath, "wb") as f:
            f.write(file_bytes)
        print(" Saved:", filepath)

        img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
        img = img.resize((224, 224))
        img = np.array(img)
        img = tf.keras.applications.efficientnet.preprocess_input(img)
        img = np.expand_dims(img, axis=0)

        #  Run prediction under a global lock to avoid TensorFlow thread contention
        with prediction_lock:
            prediction = disease_model.predict(img)

        predicted_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction)) * 100

        print(f"Prediction result: index={predicted_index}, confidence={confidence:.2f}%")

        if confidence < 15.0:
            return jsonify({"error": "Unable to identify leaf clearly. Please upload a clear photo of a plant leaf."})

        predicted_class = classes.get(predicted_index, "Unknown Disease")

        info = disease_info.get(predicted_class, {})
        display_name = info.get("display_name", predicted_class.replace("_", " ").title())

        return jsonify({
            "status": "success",
            "disease": display_name,
            "raw_class": predicted_class,
            "confidence": round(confidence, 2),
            "image": filename,
            "cause": info.get("cause", "Not available"),
            "symptoms": info.get("symptoms", "Not available"),
            "pesticides": info.get("pesticides", "Apply recommended fungicides/insecticides."),
            "organic_nutrients": info.get("organic_nutrients", "Apply neem oil, vermicompost, and bio-fertilizers."),
            "inorganic_nutrients": info.get("inorganic_nutrients", "Apply balanced NPK, micronutrient foliar spray, and soil nutrients."),
            "treatment": info.get("treatment", "Not available"),
            "prevention": info.get("prevention", "Not available")
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


# ================= HISTORY =================
@app.route("/history", methods=["GET"])
def get_history():
    try:
        email = request.args.get("email")

        if not email:
            return jsonify({"history": []})

        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row

        rows = conn.execute(
            "SELECT id, disease, confidence, image, date FROM history WHERE user_email=? ORDER BY id DESC",
            (email,)
        ).fetchall()

        conn.close()

        history = [dict(row) for row in rows]

        return jsonify({"history": history})

    except Exception as e:
        return jsonify({"error": str(e)})


# ================= SAVE HISTORY =================
@app.route("/save-history", methods=["POST"])
def save_history():
    try:
        data = request.json
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required to save history"}), 400

        conn = sqlite3.connect(db_path)

        conn.execute("""
            INSERT INTO history (user_email, disease, confidence, image, date)
            VALUES (?, ?, ?, ?, ?)
        """, (
            email,
            data.get("disease"),
            data.get("confidence"),
            data.get("image"),
            data.get("date")
        ))

        conn.commit()
        conn.close()

        print(" Saved history")

        return jsonify({"message": "Saved"})

    except Exception as e:
        return jsonify({"error": str(e)})

# ================= DELETE HISTORY =================
@app.route("/delete-history/<int:id>", methods=["DELETE"])
def delete_history(id):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM history WHERE id=?", (id,))
        conn.commit()
        conn.close()

        print("[HISTORY] Deleted ID:", id)

        return jsonify({"message": "Deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)})

# ================= AI CHAT =================

#  Handle preflight request (CORS FIX)
@app.route("/ask-ai", methods=["POST"])
def ask_ai():
    try:
        data = request.json
        message = data.get("message", "").lower()

        print("USER MSG:", message)

        best_match = None
        best_score = 0

        for disease in disease_info.keys():
            clean_disease = disease.lower().replace("_", " ")

            # count matching words
            score = sum(1 for word in message.split() if word in clean_disease)

            if score > best_score:
                best_score = score
                best_match = disease

        # require at least 2 matching words (important!)
        if best_match and best_score >= 2:
            info = disease_info.get(best_match, {})
            treatment = info.get("treatment", "No treatment info available")

            reply = f"🌿 Treatment for {best_match.replace('_',' ')}: {treatment}"
        else:
            reply = "🌿 Sorry, I couldn't clearly identify the disease. Try a more specific name."

        return jsonify({"reply": reply})

    except Exception as e:
        print("AI ERROR:", e)
        return jsonify({"error": str(e)})


# ================= GET ALL USERS =================
@app.route("/users", methods=["GET"])
def get_users():
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT id, name, email FROM users ORDER BY id ASC").fetchall()
        conn.close()
        users = [dict(row) for row in rows]
        return jsonify({"status": "success", "users": users})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ================= SERVE IMAGE =================
@app.route('/static/<path:filename>')
def serve_image(filename):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    static_path = os.path.join(base_dir, "static")
    return send_from_directory(static_path, filename)


# ================= RUN =================
# ================= RUN =================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)