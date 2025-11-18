const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, role, className, teacherId } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    // For students, require className and teacherId (per spec)
    if (role === "student" && (!className || !teacherId)) {
      return res.status(400).json({ message: "Student must choose class and teacher" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      role,
      className: role === "student" ? className : null,
      teacherId: role === "student" ? teacherId : null
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role, teacherId: user.teacherId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      role: user.role,
      userId: user._id,
      teacherId: user.teacherId,
      className: user.className
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List teachers (for signup dropdown)
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id email className").lean();
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
