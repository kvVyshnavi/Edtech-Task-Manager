import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="home-container">
        <div className="home-left">
          <h1 className="home-title">
            Empowering Teachers & Students With Smarter Task Management
          </h1>

          <p className="home-desc">
            Stay organized, stay focused. A simple way for teachers to assign
            tasks and for students to keep track of their work.
          </p>

          <div className="home-buttons">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Get Started
            </button>

            <button className="btn-outline" onClick={() => navigate("/login")}>
              I'm a Teacher
            </button>
          </div>
        </div>
      </div>

      {/* -------------- FEATURES SECTION -------------- */}
      <div className="features-wrapper">

        <div className="feature-section">
          <div className="icon-circle blue">🎓</div>
          <h3>For Students</h3>
          <p>
            Manage tasks, track progress, and stay on top of your learning journey.
          </p>
        </div>

        <div className="feature-section">
          <div className="icon-circle green">📘</div>
          <h3>For Teachers</h3>
          <p>
            Assign tasks, monitor student performance, and guide them effectively.
          </p>
        </div>

        <div className="feature-section">
          <div className="icon-circle orange">📝</div>
          <h3>Task Tracking</h3>
          <p>
            Real-time task updates, deadlines, and easy progress monitoring.
          </p>
        </div>

      </div>

      <footer className="footer">© 2025 EdTech Learning Campus</footer>
    </>
  );
}
