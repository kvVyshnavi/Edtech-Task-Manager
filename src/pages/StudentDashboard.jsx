import React, { useEffect, useState } from "react";
import API from "../api/api";
import "./dashboard.css";

export default function StudentDashboard() {
  const [personal, setPersonal] = useState([]);
  const [classProgress, setClassProgress] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await API.get("/tasks"); // backend auto-detects student
      setPersonal(res.data.personalTasks || []);
      setClassProgress(res.data.classProgress || []);
    } catch (err) {
      console.log("Error loading tasks:", err);
    }
  };

  // --------------------------
  // UPDATE CLASS PROGRESS
  // --------------------------
  const updateProgress = async (progressId, status) => {
    try {
      await API.put(`/tasks/progress/${progressId}`, {
        progress: status,
      });
      loadTasks();
    } catch (err) {
      console.log("Progress update error:", err);
    }
  };

  // --------------------------
  // PERSONAL TASK UPDATE
  // --------------------------
  const updatePersonal = async (id, status) => {
    try {
      await API.put(`/tasks/personal/${id}`, { progress: status });
      loadTasks();
    } catch (err) {
      console.log("Personal task update error:", err);
    }
  };

  const saveTask = async () => {
    if (!form.title.trim()) return;

    try {
      if (editId) {
        await API.put(`/tasks/personal/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/tasks/personal", form);
      }

      setForm({ title: "", description: "", dueDate: "" });
      loadTasks();
    } catch (err) {
      console.log("Task save error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/personal/${id}`);
      loadTasks();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.substring(0, 10),
    });
  };

  // PROGRESS % LOGIC
  const getProgressPercent = (status) => {
    if (status === "not-started") return "0%";
    if (status === "in-progress") return "50%";
    return "100%";
  };

  return (
    <div className="page-bg">
      <div className="dashboard-blur-box">

        <h2 className="dash-title">Student Dashboard</h2>

        {/* ------------------ CLASS TASKS ------------------ */}
        <h3>Class Tasks</h3>

        {classProgress.length === 0 && <p>No class tasks yet.</p>}

        {classProgress.map((task) => (
          <div key={task._id} className="dashboard-card">
            
            <div className="task-header">
              <h3>{task.taskTemplateId?.title}</h3>
              <p className="due">
                Due: {task.taskTemplateId?.dueDate?.substring(0, 10)}
              </p>
            </div>

            <p>{task.taskTemplateId?.description}</p>

            {/* STATUS TAG */}
            <p className={`status-tag status-${task.progress}`}>
              {task.progress}
            </p>

            {/* PROGRESS BAR */}
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: getProgressPercent(task.progress) }}
                ></div>
              </div>
            </div>

            {/* PROGRESS BUTTONS */}
            <div className="progress-btns">
              <button
                className="progress-btn"
                onClick={() => updateProgress(task._id, "not-started")}
              >
                Not Started
              </button>

              <button
                className="progress-btn"
                onClick={() => updateProgress(task._id, "in-progress")}
              >
                In Progress
              </button>

              <button
                className="progress-btn"
                onClick={() => updateProgress(task._id, "completed")}
              >
                Completed
              </button>
            </div>
          </div>
        ))}

        {/* ------------------ PERSONAL TASKS ------------------ */}
        <h3 style={{ marginTop: "20px" }}>Your Personal Tasks</h3>

        {/* ADD/EDIT FORM */}
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

          <button onClick={saveTask}>
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* PERSONAL TASK LIST */}
        {personal.map((p) => (
          <div key={p._id} className="dashboard-card">

            <div className="task-header">
              <h3>{p.title}</h3>
              <p className="due">Due: {p.dueDate?.substring(0, 10)}</p>
            </div>

            <p>{p.description}</p>

            {/* STATUS TAG */}
            <p className={`status-tag status-${p.progress}`}>
              {p.progress}
            </p>

            {/* PROGRESS BAR */}
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: getProgressPercent(p.progress) }}
                ></div>
              </div>
            </div>

            {/* PERSONAL PROGRESS BUTTONS */}
            <div className="progress-btns">
              <button
                className="progress-btn"
                onClick={() => updatePersonal(p._id, "not-started")}
              >
                Not Started
              </button>

              <button
                className="progress-btn"
                onClick={() => updatePersonal(p._id, "in-progress")}
              >
                In Progress
              </button>

              <button
                className="progress-btn"
                onClick={() => updatePersonal(p._id, "completed")}
              >
                Completed
              </button>
            </div>

            <div className="task-buttons">
              <button onClick={() => startEdit(p)}>Edit</button>
              <button className="delete" onClick={() => deleteTask(p._id)}>
                Delete
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
