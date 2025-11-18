const mongoose = require("mongoose");

const taskTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },
  className: { type: String, required: true }, // Class A / B / C
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPersonal: { type: Boolean, default: false } // teacher class tasks = false
}, { timestamps: true });

module.exports = mongoose.model("TaskTemplate", taskTemplateSchema);
