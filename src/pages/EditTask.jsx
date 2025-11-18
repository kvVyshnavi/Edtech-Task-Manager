import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTask() {
  const { id } = useParams();
  const [task, setTask] = useState({});
  const [progress, setProgress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await API.get("/tasks");
      const found = data.tasks.find((t) => t._id === id);
      setTask(found);
      setProgress(found.progress);
    };
    fetchTasks();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${id}`, { progress });
      alert("Task updated");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (!task.title) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Task</h2>

      <form onSubmit={handleUpdate}>
        <p><b>{task.title}</b></p>

        <select value={progress} onChange={(e) => setProgress(e.target.value)}>
          <option value="not-started">Not started</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <button>Update</button>
      </form>
    </div>
  );
}
