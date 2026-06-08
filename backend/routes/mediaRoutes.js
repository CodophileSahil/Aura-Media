const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  downloadMedia,
  shareMedia,
  accessSharedMedia,
  releaseScheduledMedia,
} = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public shared link access
router.get('/shared/:token', accessSharedMedia);

// Protected routes
router.use(protect);

router.post('/upload', authorize('admin', 'creator'), upload.single('file'), uploadMedia);
router.get('/', getAllMedia);
router.get('/:id', getMediaById);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMedia);
router.get('/:id/download', downloadMedia);
router.post('/:id/share', shareMedia);
router.post('/release-scheduled', authorize('admin'), releaseScheduledMedia);

module.exports = router;
