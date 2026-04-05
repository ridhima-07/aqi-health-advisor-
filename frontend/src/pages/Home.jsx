import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="theme-dark">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
}