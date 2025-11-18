import React, { useEffect, useState } from "react";
import API from "../api/api";
import "./dashboard.css";

export default function TeacherDashboard() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    className: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await API.get("/tasks"); // backend auto-detects teacher
      setTasks(res.data.templates || []);
    } catch (err) {
      console.log("Error loading tasks:", err);
    }
  };

  const saveTask = async () => {
    if (!form.title.trim() || !form.className.trim()) return;

    try {
      if (editId) {
        await API.put(`/tasks/template/${editId}`, form);
        setEditId(null);
      } else {
        await API.post(`/tasks`, form);
      }
      setForm({ title: "", description: "", dueDate: "", className: "" });
      loadTasks();
    } catch (err) {
      console.log("Save task error:", err);
    }
  };

  const editTask = (t) => {
    setEditId(t._id);
    setForm({
      title: t.title,
      description: t.description,
      dueDate: t.dueDate?.substring(0, 10),
      className: t.className,
    });
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/template/${id}`);
      loadTasks();
    } catch (err) {
      console.log("Delete task error:", err);
    }
  };

  // Map progress → percent
  const getPercent = (status) => {
    if (status === "not-started") return "0%";
    if (status === "in-progress") return "50%";
    return "100%";
  };

  return (
    <div className="page-bg">
      <div className="dashboard-blur-box">

        <h2 className="dash-title">Teacher Dashboard</h2>

        {/* ---------------- CREATE/EDIT TASK ---------------- */}
        <div className="add-task-box">
          <input
            type="text"
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <input
            type="text"
            placeholder="Class Name (ex: CSE-A)"
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
          />

          <button onClick={saveTask}>
            {editId ? "Update Task" : "Create Task"}
          </button>
        </div>

        {/* ---------------- ALL TASKS ---------------- */}
        <h3 style={{ marginTop: "20px" }}>Created Tasks</h3>

        {tasks.length === 0 && <p>No tasks created yet.</p>}

        {tasks.map((wrap) => {
          const t = wrap.template;
          const progresses = wrap.progresses;

          return (
            <div key={t._id} className="dashboard-card">
              <div className="task-header">
                <h3>{t.title}</h3>
                <p className="due">Due: {t.dueDate?.substring(0, 10)}</p>
              </div>

              <p>{t.description}</p>
              <p><strong>Class:</strong> {t.className}</p>

              <div className="task-buttons">
                <button onClick={() => editTask(t)}>Edit</button>
                <button className="delete" onClick={() => deleteTask(t._id)}>
                  Delete
                </button>
              </div>

              <h4 style={{ marginTop: "15px" }}>Student Progress</h4>

              {progresses.map((p) => (
                <div key={p._id} className="student-progress-item">

                  <div className="student-info">
                    <strong>{p.studentId.email}</strong>  
                    <span className={`status-tag status-${p.progress}`}>
                      {p.progress}
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: getPercent(p.progress) }}
                      ></div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          );
        })}

      </div>
    </div>
  );
}
