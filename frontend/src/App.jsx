import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AqiInfo from "./pages/AqiInfo";
import Recommendations from "./pages/Recommendations";

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);

  function handleLogout() {
    setUserId(null);
  }

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userId={userId}
              onComplete={(id) => setUserId(id)}
              onLoginSuccess={(id) => setUserId(id)}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            userId ? (
              <Dashboard userId={userId} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/aqi-info"
          element={<AqiInfo userId={userId} onLogout={handleLogout}/>}
        />

        <Route
          path="/recommendations"
          element={
            userId ? (
              <Recommendations userId={userId} onLogout={handleLogout}/>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;