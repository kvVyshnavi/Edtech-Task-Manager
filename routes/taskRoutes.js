const express = require("express");
const TaskTemplate = require("../models/TaskTemplate");
const TaskProgress = require("../models/TaskProgress");
const PersonalTask = require("../models/PersonalTask");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

/* ----------------------------
   TEACHER CREATES CLASS TASK
-----------------------------*/
router.post("/", auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "teacher")
      return res.status(403).json({ message: "Only teachers can create tasks" });

    const { title, description, dueDate, className } = req.body;
    if (!title || !className)
      return res
        .status(400)
        .json({ message: "Title and className required" });

    const template = await TaskTemplate.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      className,
      teacherId: id,
      isPersonal: false
    });

    // Find students in class
    const students = await User.find({ role: "student", className })
      .select("_id")
      .lean();

    // Create progress entries for each student
    const progresses = students.map((s) => ({
      taskTemplateId: template._id,
      studentId: s._id,
      progress: "not-started"
    }));

    if (progresses.length) await TaskProgress.insertMany(progresses);

    res.json({
      message: "Task created",
      templateId: template._id,
      assignedTo: students.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   STUDENT CREATES PERSONAL TASK
-----------------------------*/
router.post("/personal", auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "student")
      return res
        .status(403)
        .json({ message: "Only students can create personal tasks" });

    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const pt = await PersonalTask.create({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      studentId: id,
      progress: "not-started"
    });

    res.json({ message: "Personal task created", personalTask: pt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   GET TASKS (Student + Teacher)
-----------------------------*/
router.get("/", auth, async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === "student") {
      const personal = await PersonalTask.find({ studentId: id }).lean();
      const classProgress = await TaskProgress.find({ studentId: id })
        .populate("taskTemplateId")
        .lean();
      return res.json({ personalTasks: personal, classProgress });
    }

    if (role === "teacher") {
      const templates = await TaskTemplate.find({ teacherId: id }).lean();

      const result = await Promise.all(
        templates.map(async (t) => {
          const progresses = await TaskProgress.find({
            taskTemplateId: t._id
          })
            .populate("studentId", "email className")
            .lean();

          return { template: t, progresses };
        })
      );

      return res.json({ templates: result });
    }

    res.status(403).json({ message: "Invalid role" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   STUDENT UPDATES PERSONAL TASK
-----------------------------*/
router.put("/personal/:id", auth, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    if (role !== "student")
      return res
        .status(403)
        .json({ message: "Only students can update personal tasks" });

    const { progress, title, description, dueDate } = req.body;
    const pt = await PersonalTask.findById(req.params.id);
    if (!pt)
      return res.status(404).json({ message: "Personal task not found" });

    if (pt.studentId.toString() !== userId)
      return res.status(403).json({ message: "Not your task" });

    if (progress) pt.progress = progress;
    if (title) pt.title = title;
    if (description) pt.description = description;
    if (dueDate) pt.dueDate = new Date(dueDate);

    await pt.save();
    res.json({ message: "Personal task updated", pt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   STUDENT UPDATES CLASS PROGRESS
-----------------------------*/
router.put("/progress/:id", auth, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    if (role !== "student")
      return res
        .status(403)
        .json({ message: "Only students can update progress" });

    const { progress } = req.body;
    const tp = await TaskProgress.findById(req.params.id);

    if (!tp) return res.status(404).json({ message: "Progress not found" });
    if (tp.studentId.toString() !== userId)
      return res.status(403).json({ message: "Not your task" });

    tp.progress = progress;
    await tp.save();

    res.json({ message: "Progress updated", tp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   TEACHER EDITS CLASS TASK
-----------------------------*/
router.put("/template/:id", auth, async (req, res) => {
  try {
    const { id: teacherId, role } = req.user;
    if (role !== "teacher")
      return res
        .status(403)
        .json({ message: "Only teachers can edit class tasks" });

    const template = await TaskTemplate.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Task not found" });

    if (template.teacherId.toString() !== teacherId)
      return res.status(403).json({ message: "Not your task" });

    const { title, description, dueDate } = req.body;

    if (title) template.title = title;
    if (description) template.description = description;
    if (dueDate) template.dueDate = new Date(dueDate);

    await template.save();
    res.json({ message: "Task updated", template });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   TEACHER DELETES CLASS TASK
-----------------------------*/
router.delete("/template/:id", auth, async (req, res) => {
  try {
    const { id: teacherId, role } = req.user;

    if (role !== "teacher")
      return res.status(403).json({ message: "Only teachers can delete tasks" });

    const template = await TaskTemplate.findById(req.params.id);
    if (!template)
      return res.status(404).json({ message: "Task not found" });

    if (template.teacherId.toString() !== teacherId)
      return res.status(403).json({ message: "Not your task" });

    // delete progress entries + template
    await TaskProgress.deleteMany({ taskTemplateId: template._id });
    await template.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ----------------------------
   STUDENT DELETES PERSONAL TASK
-----------------------------*/
router.delete("/personal/:id", auth, async (req, res) => {
  try {
    const { id: studentId, role } = req.user;

    if (role !== "student")
      return res.status(403).json({ message: "Only students delete tasks" });

    const task = await PersonalTask.findById(req.params.id);
    if (!task)
      return res.status(404).json({ message: "Personal task not found" });

    if (task.studentId.toString() !== studentId)
      return res.status(403).json({ message: "Not your task" });

    await task.deleteOne();

    res.json({ message: "Personal task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
