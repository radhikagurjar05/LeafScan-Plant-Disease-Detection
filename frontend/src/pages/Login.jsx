import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { isValidEmail } from "../utils/helpers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email: cleanEmail, password: cleanPassword });

      if (res.status === "success") {
        localStorage.setItem("user", res.user.email);
        localStorage.setItem("name", res.user.name);
        navigate("/");
      } else {
        setErrorMsg(res.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const serverMsg = err.response?.data?.message;
      setErrorMsg(serverMsg || "Login failed. Please check your credentials or server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">🌿 LeafScan</h2>
        <h1>Continue to LeafScan</h1>
        <p>Welcome back! Please enter your details.</p>

        {errorMsg && <div className="auth-error-box">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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