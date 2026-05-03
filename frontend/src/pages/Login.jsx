import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter email and password");
    }

    try {
      const res = await login({ email, password });

      console.log("LOGIN RESPONSE:", res); // debug

      // ✅ FIXED (no res.data)
      if (res.status === "success") {
        // store email
        localStorage.setItem("user", email);

        // store name
        const extractedName = email.split("@")[0];
        localStorage.setItem("name", extractedName);

        console.log("Saved name:", extractedName);

        navigate("/"); // go to home
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">🌿 LeafScan</h2>
        <h1>Continue to LeafScan</h1>
        <p>Welcome back! Please enter your details.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          New user?{" "}
          <span onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}