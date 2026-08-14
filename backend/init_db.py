import sqlite3
import os

# Get absolute path to the directory containing this script
base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "database.db")

# Connect to database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# Create history table
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

# Create login_attempts table
cursor.execute("""
CREATE TABLE IF NOT EXISTS login_attempts (
    email TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    locked_until TEXT
)
""")

# Save changes
conn.commit()
conn.close()

print("Database initialized successfully!")