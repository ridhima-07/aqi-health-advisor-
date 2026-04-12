import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home({ onComplete }) {
  return (
    <div className="theme-dark">
      <Navbar />
      <main>
        <Hero onComplete={onComplete}/>
      </main>
    </div>
  );
}