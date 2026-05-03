import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // get stored values
  const user = localStorage.getItem("user");
  const name = localStorage.getItem("name");

  // format name
  const displayName = name
    ? name.charAt(0).toUpperCase() + name.slice(1)
    : "User";

  const goToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <h2 style={{ color: "white", fontWeight: "bold" }}>
          🌿 LeafScan
        </h2>
      </div>

      <div className="nav-links">
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => goToSection("how")}>How it Works</span>
        <span onClick={() => goToSection("why")}>Why LeafScan</span>
        <span onClick={() => navigate("/history")}>History</span>
      </div>

      <div className="nav-right">
        <span>Hi, {displayName}</span>

        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </div>
  );
}
