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

      if (res.status === "success") {
        localStorage.setItem("user", email);
        alert("Login Successful");
        navigate("/history");
      } else {
        alert("Invalid Credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>🌿 LeafScan</h2>
      <h3>Welcome</h3>
      <p>Enter your details to get started</p>

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

      <button onClick={handleLogin}>Get Started</button>
    </div>
  </div>
);
}