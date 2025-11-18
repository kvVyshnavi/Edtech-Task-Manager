import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      // MUST be lowercase for routing
      localStorage.setItem("role", res.data.role.toLowerCase());

      navigate("/dashboard");
      window.location.reload(); // IMPORTANT FIX
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="page-bg">
      <div className="blur-box">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="input-box"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="input-box"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}
