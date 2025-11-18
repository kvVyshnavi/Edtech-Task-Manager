const mongoose = require("mongoose");

const taskProgressSchema = new mongoose.Schema({
  taskTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "TaskTemplate", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  progress: { type: String, enum: ["not-started", "in-progress", "completed"], default: "not-started" }
}, { timestamps: true });

module.exports = mongoose.model("TaskProgress", taskProgressSchema);
