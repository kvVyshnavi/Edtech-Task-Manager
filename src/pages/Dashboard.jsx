import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error loading tasks");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard ({role})</h2>

      {tasks.length === 0 && <p>No tasks available</p>}

      {tasks.map((t) => (
        <div className="task" key={t._id}>
          <h3>{t.title}</h3>
          <p>{t.description}</p>

          <p><b>Progress:</b> {t.progress}</p>
          <p><b>Due:</b> {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "None"}</p>

          {/* Only show edit/delete if logged-in user owns the task */}
          {String(t.userId) === String(userId) && (
            <>
              <Link to={`/edit/${t._id}`}>Edit</Link>
              <button onClick={() => handleDelete(t._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
