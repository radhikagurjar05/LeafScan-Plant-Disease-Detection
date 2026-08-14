import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { isValidEmail } from "../utils/helpers";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMsg("Password should be at least 4 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await signup({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
      });

      if (res.status === "success") {
        alert("Signup Successful! ✅ Please login with your email.");
        navigate("/login");
      } else {
        setErrorMsg(res.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message;
      setErrorMsg(serverMsg || "This email is already registered! Please login instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">🌿 LeafScan</h2>
        <h1>Create Account</h1>
        <p>Sign up to get started. Please enter your details.</p>

        {errorMsg && <div className="auth-error-box">{errorMsg}</div>}

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}