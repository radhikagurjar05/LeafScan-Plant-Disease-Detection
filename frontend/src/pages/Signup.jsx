import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { isValidEmail } from "../utils/helpers"


function Signup() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSignup = async () => {

    if (!name || !email || !password) {
      return alert("Please fill all fields")
    }
    
    if (!isValidEmail(email)) {
      alert("Invalid Email")
    }
    try {

      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/signup`, {
        name,
        email,
        password
      })

      alert("Signup Successful ✅")

      navigate("/login")

    } catch (err) {
      console.error(err)
      alert("Signup failed ❌ (Email may already exist)")
    }
  }

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>🌿 LeafScan</h2>
      <h3>Create Account</h3>
      <p>Sign up to get started</p>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "#4CAF50", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  </div>
);
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "60px"
  },

  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "250px"
  },

  button: {
    padding: "10px 20px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },

  link: {
    color: "blue",
    cursor: "pointer",
    textDecoration: "underline"
  }
}

export default Signup