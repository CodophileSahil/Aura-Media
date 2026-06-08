const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Get all notifications for user
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    const formatted = notifications.map(n => ({
      ...n.toJSON(),
      _id: n.id
    }));

    res.json({ success: true, count: formatted.length, notifications: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification: { ...notification.toJSON(), _id: notification.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
