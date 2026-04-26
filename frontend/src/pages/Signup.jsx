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

      const res = await axios.post("http://127.0.0.1:5000/signup", {
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
    <div style={styles.container}>

      <h2>Create Account</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSignup} style={styles.button}>
        Sign Up
      </button>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <span style={styles.link} onClick={() => navigate("/login")}>
          Login
        </span>
      </p>

    </div>
  )
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