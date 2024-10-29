const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


router.get('/', async (req, res) => {
  const { email } = req.query;

  try {
    const notifications = await Notification.find({ email });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});


router.patch('seen/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(id, { isSeen: true }, { new: true });
      if (!updatedNotification) {
        return res.status(404).json({ message: 'Notification not found.' });
      }
      res.status(200).json({ message: 'Notification marked as seen.' });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ message: 'Failed to update notification.' });
    }
  });
  
 
router.delete('/', async (req, res) => {
  const { postId, email } = req.query;

  try {
    const deletedNotification = await Notification.findOneAndDelete({ postId, email });
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found for this user.' });
    }
    res.status(200).json({ message: 'Notification removed for this user.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
});

module.exports = router;
