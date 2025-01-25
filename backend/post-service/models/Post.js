
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // Email of the user posting the content
  },
  file: {
    type: String,  // To store the file URL if a file is attached
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
