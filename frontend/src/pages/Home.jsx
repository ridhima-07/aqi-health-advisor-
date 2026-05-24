import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home({ userId, onLogout }) {
  return (
    <div className="theme-dark">
      <Navbar userId={userId} onLogout={onLogout} />
      <Hero />
    </div>
  );
}