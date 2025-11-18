const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  // className is required for students (frontend will send it)
  className: { type: String, default: null },
  // teacherId required for students (frontend sends selected teacher _id)
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
