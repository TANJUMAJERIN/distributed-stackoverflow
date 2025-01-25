const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


router.post('/create', async (req, res) => {
  const { emails, postId} = req.body;

  if (!emails || !postId) {
      return res.status(400).json({ message: 'Emails, postId are required.' });
  }

  try {
      // Prepare notifications for each email
      const notifications = emails.map(user => ({
        email: user.email,
        postId, 
          //content,
          //isSeen: false,
      }));

     
      await Notification.insertMany(notifications);

      res.status(201).json({ message: 'Notifications created successfully!' });
  } catch (error) {
      console.error('Error creating notifications:', error);
      res.status(500).json({ message: 'Failed to create notifications.' });
  }
});


router.get('/notification', async (req, res) => {
  const { email } = req.query;

  try {
    const notifications = await Notification.find({ email });
    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});


 
router.delete('/notification', async (req, res) => {
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
