const express = require("express");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Create a notification
router.post("/", auth, async (req, res) => {
  try {
    const { postId } = req.body;
    const newNotification = new Notification({
      user: req.userId,
      post: postId,
    });
    const notification = await newNotification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
}
});

// Get notifications
router.get("/", auth, async (req, res) => {
try {
  const notifications = await Notification.find({ user: req.userId }).populate("post").sort({ createdAt: -1 });
  res.json(notifications);
} catch (err) {
  console.error(err.message);
  res.status(500).send("Server error");
}
});

module.exports = router;

