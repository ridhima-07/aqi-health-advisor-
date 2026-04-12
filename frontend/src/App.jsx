import { useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Home onComplete={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;