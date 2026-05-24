import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AqiInfo from "./pages/AqiInfo";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);

  function handleLogout() {
    localStorage.clear();
    setUserId(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userId={userId}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/login"
          element={<Login setUserId={setUserId} />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            userId ? (
              <Dashboard userId={userId} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/aqi-info" element={<AqiInfo />} />

        <Route
          path="/recommendations"
          element={
            userId ? (
              <Recommendations userId={userId} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;