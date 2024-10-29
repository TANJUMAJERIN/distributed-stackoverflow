// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default to current date
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;

