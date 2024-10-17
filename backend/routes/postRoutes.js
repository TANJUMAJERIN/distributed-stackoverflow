const express = require("express");
const Post = require("../models/Post");
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

// Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { content, codeSnippet } = req.body;
    const newPost = new Post({
      user: req.userId,
      content,
      codeSnippet,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get latest posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: { $ne: req.userId } }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;



// const express = require("express");
// const cors = require("cors");

// const postRouter = express.Router();

// postRouter.use(cors());
// postRouter.use(express.json());

// postRouter.get("/", (req, res) => {
//   res.send({ message: "Get request at Post router." });
// });

// postRouter.post("/", (req, res) => {
//   res.send({ message: "Get request at Post router." });
// });

// module.exports = postRouter;
