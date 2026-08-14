import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Sync dark mode state with document.body class & localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Get stored values
  const user = localStorage.getItem("user");
  const name = localStorage.getItem("name");

  // Format name
  const displayName = name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : "User";

  const goToSection = (id) => {
    setMenuOpen(false);
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNav("/")}>
        <h2>🌿 LeafScan</h2>
      </div>

      {/* Hamburger Toggle for Mobile */}
      <button
        className="mobile-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <span onClick={() => handleNav("/")}>Home</span>
        <span onClick={() => goToSection("plants")}>Crops</span>
        <span onClick={() => goToSection("how")}>How it Works</span>
        <span onClick={() => goToSection("why")}>Why LeafScan</span>
        <span onClick={() => handleNav("/history")}>History</span>

        {/* Mobile-only User & Theme Controls */}
        <div className="mobile-user-box">
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <span className="user-greeting">Hi, {displayName}</span>
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="login-btn" onClick={() => handleNav("/login")}>Login</button>
          )}
        </div>
      </div>

      {/* Desktop Right Controls (Single Theme Toggle Button) */}
      <div className="nav-right desktop-only">
        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Light/Dark Theme"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <span className="user-greeting">Hi, {displayName}</span>
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="login-btn" onClick={() => handleNav("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
}
