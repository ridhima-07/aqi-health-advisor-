import { Box, Typography } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

// ── Navbar Component ──────────────────────────────────────────────────────────
// Layout: [Logo]  ←————————————→  [Explore AQI] [Get Started] [ThemeToggle]
// Sticky at top, slightly lighter bg than the page (#393E46 vs #222831)
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar({userId, onLogout}) {
  const navigate = useNavigate();

  function handleLogout () {
    if ( onLogout ) {
      onLogout();
      navigate("/");
    }
  }

  return (
    <nav className="navbar">
      {/* ── Left side: Logo ──────────────────────────────────────────────── */}
      <Typography
      component = {Link}
      to = "/"
        className="navbar-logo"
        role="button"
        tabIndex={0}
      >
        AQI IQ
      </Typography>

      {/* ── Right side: nav actions ──────────────────────────────────────── */}
      <Box className="navbar-actions">
        { userId ? (
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
            <NavLink to="/aqi-info" className="nav-link">AQI Info</NavLink>
            <NavLink to="/" className="nav-link">Log In</NavLink>
            <NavLink to="/" className="nav-link nav-link--cta">Sign Up</NavLink>
          </>
        )}
      </Box>
    </nav>
  );
}