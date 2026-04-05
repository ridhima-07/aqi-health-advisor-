import { Box, Typography, Button, IconButton } from "@mui/material";
import "../styles/Navbar.css";

// ── Navbar Component ──────────────────────────────────────────────────────────
// Layout: [Logo]  ←————————————→  [Explore AQI] [Get Started] [ThemeToggle]
// Sticky at top, slightly lighter bg than the page (#393E46 vs #222831)
// ─────────────────────────────────────────────────────────────────────────────

export default function Navbar() {


  // ── Smooth scroll helpers ─────────────────────────────────────────────────
  // scrollToTop  → clicking the logo brings user back to the very top
  // scrollToId   → scrolls to any section by its HTML id
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="navbar">
      {/* ── Left side: Logo ──────────────────────────────────────────────── */}
      <Typography
        className="navbar-logo"
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToTop()}
      >
        AQI IQ
      </Typography>

      {/* ── Right side: nav actions ──────────────────────────────────────── */}
      <Box className="navbar-actions">

        {/* 1. Explore AQI — scrolls to the AQI Info section */}
        <button
          className="nav-link"
          onClick={() => scrollToId("aqi-info")}
        >
          Explore AQI
        </button>

        {/* 2. Get Started — scrolls to the Setup / Onboarding section */}
        <button
          className="nav-link nav-link--cta"
          onClick={() => scrollToId("setup")}
        >
          Get Started
        </button>
      </Box>
    </nav>
  );
}