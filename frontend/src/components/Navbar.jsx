import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ userId, onLogout, setAuthMode }) {
  const navigate = useNavigate();

  const storedUserId = localStorage.getItem("userId");
  const isLoggedIn = Boolean(userId || storedUserId);

  const handleLogout = () => {
    localStorage.clear();

    if (onLogout) {
      onLogout();
    }

    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        AQI IQ
      </Link>

      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/aqi-info" className="nav-link">AQI Info</NavLink>
            <NavLink to="/recommendations" className="nav-link">Recommendations</NavLink>
            <button className="nav-link nav-link--cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/aqi-info" className="nav-link">
              AQI Info
            </NavLink>

            <button
              className="nav-link nav-btn-reset"
              onClick={() => {
                setAuthMode?.("login");

                navigate("/", {
                  state: { scrollToAuth: true, mode: "login" },
                });
              }}
            >
              Log In
            </button>

            <button
              className="nav-link nav-link--cta nav-btn-reset"
              onClick={() => {
                setAuthMode?.("signup");

                navigate("/", {
                  state: { scrollToAuth: true, mode: "signup" },
                });
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}