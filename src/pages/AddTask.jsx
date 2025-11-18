import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const CLASSES = ["Class A","Class B","Class C"];

export default function AddTask(){
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [dueDate,setDueDate] = useState("");
  const [className,setClassName] = useState(CLASSES[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title, description, dueDate, className });
      alert("Task created and assigned to class");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container">
      <h2>Create Task for Class</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <select value={className} onChange={e=>setClassName(e.target.value)}>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}
