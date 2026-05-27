import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home({ userId, onLogout, setUserId }) {
  const [authMode, setAuthMode] = useState("signup");

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