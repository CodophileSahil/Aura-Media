const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Media = require('../models/mediaModel');
const ActivityLog = require('../models/activityLogModel');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['createdAt', 'DESC']] });
    
    const formatted = users.map(u => ({
      ...u.toJSON(),
      _id: u.id
    }));

    res.json({ success: true, count: formatted.length, users: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'creator', 'viewer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'Update Role',
      details: `Updated role of ${user.username} to ${role}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, message: `User role updated to ${role}`, user: { ...user.toJSON(), _id: user.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    const username = user.username;
    await user.destroy();

    // Cascades or manually removes related media
    await Media.destroy({ where: { ownerId: req.params.id } });

    await ActivityLog.create({
      userId: req.user.id,
      action: 'Delete User',
      details: `Deleted user: ${username}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, message: `User ${username} deleted successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
