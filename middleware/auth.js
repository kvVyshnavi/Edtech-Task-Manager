const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    let header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // FIX: remove "Bearer " prefix if present
    if (header.startsWith("Bearer ")) {
      header = header.split(" ")[1];
    }

    const decoded = jwt.verify(header, process.env.JWT_SECRET);

    console.log("🔥 DECODED JWT:", decoded); // Debug logging

    req.user = {
      id: decoded.id,
      role: decoded.role,
      teacherId: decoded.teacherId,
    };

    req.fullUser = await User.findById(decoded.id)
      .select("-passwordHash")
      .lean();

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
