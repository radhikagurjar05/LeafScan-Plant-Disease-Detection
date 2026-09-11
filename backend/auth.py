from flask import Blueprint, request, jsonify
import sqlite3
import os
from werkzeug.security import check_password_hash

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "database.db")

auth = Blueprint("auth", __name__)

def get_db():
    return sqlite3.connect(db_path)

def verify_password(stored_password, provided_password):
    if not stored_password or not provided_password:
        return False
    if stored_password.startswith(("scrypt:", "pbkdf2:", "$2b$", "$2a$")):
        try:
            return check_password_hash(stored_password, provided_password)
        except Exception:
            pass
    return stored_password == provided_password

@auth.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"status": "failed", "message": "Please enter both email and password."}), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT id, name, email, password FROM users WHERE LOWER(email)=?", (email,))
    user = cursor.fetchone()
    db.close()

    if user:
        user_id, user_name, user_email, stored_password = user
        if verify_password(stored_password, password):
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "user": {"name": user_name, "email": user_email}
            })
        else:
            return jsonify({"status": "failed", "message": "Invalid credentials"}), 401
    else:
        return jsonify({"status": "failed", "message": "User not found"}), 404