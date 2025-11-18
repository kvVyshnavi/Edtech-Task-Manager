import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const CLASSES = ["Class A", "Class B", "Class C"];

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [className, setClassName] = useState(CLASSES[0]);
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const { data } = await API.get("/auth/teachers");
        setTeachers(data.teachers || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password, role };

      if (role === "student") {
        body.className = className;
        body.teacherId = teacherId;
      }

      await API.post("/auth/signup", body);

      alert("Signup successful — please login");

      // Clear old session data
      localStorage.clear();

      // Redirect to login page (FIXED)
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
  <div className="page-bg">
    <div className="blur-box">
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>
        
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

        <select
          className="input-box"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {role === "student" && (
          <>
            <select
              className="input-box"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="input-box"
              required
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="">Select a teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.email}
                </option>
              ))}
            </select>
          </>
        )}

        <button className="signup-btn" type="submit">
          Signup
        </button>

      </form>
    </div>
  </div>
);

}
