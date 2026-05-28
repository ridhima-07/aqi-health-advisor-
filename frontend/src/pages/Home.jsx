import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home({ userId, onLogout, setUserId }) {
  const location = useLocation();
  const [authMode, setAuthMode] = useState("signup");
  useEffect(() => {
    if (location.state?.scrollToAuth) {
      if (location.state.mode) {
        setAuthMode(location.state.mode);
      }

      setTimeout(() => {
        const authSection = document.getElementById("auth");

        if (authSection) {
          authSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [location]);

  function handleLoginSuccess(userId) {
    localStorage.setItem("userId", userId);
    if (setUserId) {
      setUserId(userId);
    }
  }

  return (
    <div className="theme-dark">
      <Navbar userId={userId} onLogout={onLogout} setAuthMode={setAuthMode} />
      <Hero onLoginSuccess={handleLoginSuccess} authMode={authMode} />
    </div>
  );
}