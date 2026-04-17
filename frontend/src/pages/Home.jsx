import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home({ userId, onComplete, onLoginSuccess }) {
  return (
    <div className="theme-dark">
      <Navbar userId={userId}/>
      <main>
        <Hero onComplete={onComplete} onLoginSuccess={onLoginSuccess} cigaretteEquivalent={currentData.cigaretteEquivalent}/>
      </main>
    </div>
  );
}