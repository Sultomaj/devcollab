import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
  background: "transparent",  // <--- CHANGED from #24292e
  padding: "1.5rem 2rem", 
  display: "flex", 
  alignItems: "center", 
  justifyContent: "space-between",
  color: "white"
}}>
      {/* Logo */}
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
        👨‍💻 DevCollab
      </Link>
      
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/" style={{ color: "#ddd", textDecoration: "none" }}>Browse Projects</Link>
        
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: "#ddd", textDecoration: "none" }}>My Dashboard</Link>
            
            {}
            <Link to="/create" style={{ 
              background: "#28a745", 
              color: "white", 
              padding: "8px 15px", 
              borderRadius: "20px", 
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              + Post Idea
            </Link>

            <button onClick={logout} style={{ background: "none", border: "1px solid #666", color: "white", padding: "5px 10px", cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: "#4caf50", fontWeight: "bold", textDecoration: "none" }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
