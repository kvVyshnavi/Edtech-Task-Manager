import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AddTask from "./pages/AddTask";
import Navbar from "./components/Navbar";
import "./styles.css";

function App() {
  // ⬇️ Cursor glow effect
  useEffect(() => {
    const glow = document.getElementById("cursor-light");

    const handleMove = (e) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMove);

    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      {/* Soft glow that follows cursor */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/add"
          element={
            token && role === "teacher" ? (
              <AddTask />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            token ? (
              role === "teacher" ? (
                <TeacherDashboard />
              ) : (
                <StudentDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <div id="cursor-light" className="cursor-light"></div>
    </BrowserRouter>
  );
}

export default App;
