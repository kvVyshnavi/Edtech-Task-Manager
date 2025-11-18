const mongoose = require("mongoose");

const personalTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  progress: { type: String, enum: ["not-started","in-progress","completed"], default: "not-started" }
}, { timestamps: true });

module.exports = mongoose.model("PersonalTask", personalTaskSchema);
