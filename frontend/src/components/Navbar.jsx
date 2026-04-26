
/**import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  return (
    <div className="navbar">

      <div className="logo" onClick={() => navigate("/")}>
        🌿 LeafScan
      </div>

      <div className="nav-links">

       
        <Link href="#scan">Scan</Link>
        <Link href="#how">How It Works</Link>
        <Link href="#features">Features</Link>

        
        <Link to="/history">
          History
        </Link>

      </div>

      <div className="user">
        Hi, Priyanshi
        <button className="logout">Logout</button>
      </div>

    </div>
  );
}**/


import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

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
  localStorage.removeItem("user");   // remove user
  window.location.href = "/";        // redirect to home
};
<button onClick={handleLogout}>
  Logout
</button>
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        🌿 LeafScan
      </div>

      <div className="nav-links">
        <span onClick={() => navigate("/")}>Home</span>
        <span onClick={() => goToSection("how")}>How it Works</span>
        <span onClick={() => goToSection("why")}>Why LeafScan</span>
        <span onClick={() => navigate("/history")}>History</span>
      </div>
<div className="nav-right">
  <span>Hi, {user}</span>

  {user ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <button onClick={() => navigate("/login")}>Login</button>
  )}
</div>
      
    </div>
  );
}