const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Media = require('../models/mediaModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const ActivityLog = require('../models/activityLogModel');
const Recommendation = require('../models/recommendationModel');
const socketService = require('../services/socketService');
const aiService = require('../services/aiService');

// Helper to determine media type from MIME type
const getMediaType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

// @desc    Upload media & trigger background AI processing
// @route   POST /api/media/upload
// @access  Private (Admin & Content Creator)
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, category, tags, isScheduled, scheduledDate } = req.body;
    const fileType = req.file.mimetype;
    const mediaType = getMediaType(fileType);
    const fileSize = req.file.size;
    const fileUrl = `/uploads/${req.file.filename}`;

    const parsedTags = tags ? tags.split(',').map(t => t.trim()) : [];

    const media = await Media.create({
      title: title || req.file.originalname,
      description: description || '',
      category: category || 'General',
      tags: parsedTags,
      ownerId: req.user.id,
      fileUrl,
      fileType,
      mediaType,
      fileSize,
      status: isScheduled === 'true' ? 'draft' : 'published',
      isScheduled: isScheduled === 'true',
      scheduledDate: isScheduled === 'true' ? new Date(scheduledDate) : null,
    });

    // Create "Upload Completed" Notification
    const uploadNotification = await Notification.create({
      userId: req.user.id,
      title: 'Upload Completed',
      message: `"${media.title}" uploaded successfully. AI analysis has started.`,
      type: 'info',
    });
    
    // Map _id property to make frontend alerts parser compatible
    const notifJSON = { ...uploadNotification.toJSON(), _id: uploadNotification.id };
    socketService.sendNotificationToUser(req.user.id, notifJSON);

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Upload',
      details: `Uploaded ${mediaType} file: ${media.title}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    // Run AI analysis in the background
    const runBackgroundAIAnalysis = async () => {
      try {
        const filePath = req.file.path;
        let aiResult = {};

        if (mediaType === 'image') {
          aiResult = await aiService.analyzeImage(req.file.filename, fileUrl);
          media.description = media.description || aiResult.description;
          media.category = media.category === 'General' ? aiResult.category : media.category;
          media.aiSummary = aiResult.description;
          media.aiKeywords = aiResult.tags;
          
          const combinedTags = new Set([...media.tags, ...aiResult.tags]);
          media.tags = Array.from(combinedTags);
        } else if (mediaType === 'audio') {
          aiResult = await aiService.analyzeAudio(req.file.filename, filePath);
          media.aiTranscript = aiResult.transcript;
          media.aiSummary = aiResult.summary;
          media.aiKeywords = aiResult.keywords;
        } else if (mediaType === 'video') {
          aiResult = await aiService.analyzeVideo(req.file.filename, filePath);
          media.aiTranscript = aiResult.transcript;
          media.aiSummary = aiResult.summary;
          media.aiKeywords = aiResult.tags;
          
          const combinedTags = new Set([...media.tags, ...aiResult.tags]);
          media.tags = Array.from(combinedTags);
        } else if (mediaType === 'document') {
          aiResult = await aiService.analyzeDocument(req.file.filename, filePath);
          media.aiSummary = aiResult.summary;
          media.aiKeywords = aiResult.keywords;
          media.category = media.category === 'General' ? aiResult.category : media.category;
        }

        await media.save();

        // Trigger automatic recommendations generation for users based on this content category
        const viewers = await User.findAll({ where: { role: { [Op.in]: ['viewer', 'creator'] } } });
        for (const viewer of viewers) {
          if (viewer.id !== req.user.id) {
            await Recommendation.create({
              userId: viewer.id,
              mediaId: media.id,
              score: Math.random() * 0.4 + 0.6,
              reason: `New content added in your favorite category: ${media.category}`
            });
          }
        }

        // Create "AI Processing Completed" Notification
        const aiNotification = await Notification.create({
          userId: req.user.id,
          title: 'AI Processing Completed',
          message: `AI analysis for "${media.title}" completed. Summary and keywords are now available.`,
          type: 'success',
        });
        
        const aiNotifJSON = { ...aiNotification.toJSON(), _id: aiNotification.id };
        socketService.sendNotificationToUser(req.user.id, aiNotifJSON);
      } catch (aiError) {
        console.error('Error in background AI analysis:', aiError.message);
      }
    };

    runBackgroundAIAnalysis();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully. AI processing in progress.',
      media: { ...media.toJSON(), _id: media.id } // Map _id for frontend list updates compatibility
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all media assets
// @route   GET /api/media
// @access  Private
const getAllMedia = async (req, res) => {
  try {
    let whereClause = {};

    // RBAC check
    if (req.user.role === 'viewer') {
      whereClause = { status: 'published' };
    } else if (req.user.role === 'creator') {
      whereClause = {
        [Op.or]: [
          { ownerId: req.user.id },
          { status: 'published' }
        ]
      };
    }

    if (req.query.category) whereClause.category = req.query.category;
    if (req.query.mediaType) whereClause.mediaType = req.query.mediaType;

    const mediaList = await Media.findAll({
      where: whereClause,
      include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email', 'profileImage'] }],
      order: [['createdAt', 'DESC']]
    });

    // Remap id fields to _id for frontend React compatibility
    const formattedMedia = mediaList.map(item => {
      const json = item.toJSON();
      if (json.owner) {
        json.owner._id = json.owner.id;
      }
      return { ...json, _id: json.id };
    });

    res.json({ success: true, count: formattedMedia.length, media: formattedMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single media by ID (increments views)
// @route   GET /api/media/:id
// @access  Private
const getMediaById = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email', 'profileImage'] }]
    });

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Role-based visibility check
    if (req.user.role === 'viewer' && media.status !== 'published') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    media.viewsCount += 1;
    await media.save();

    const mediaJSON = media.toJSON();
    if (mediaJSON.owner) {
      mediaJSON.owner._id = mediaJSON.owner.id;
    }

    res.json({ success: true, media: { ...mediaJSON, _id: media.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update media tags & descriptions
// @route   PUT /api/media/:id
// @access  Private
const updateMedia = async (req, res) => {
  try {
    let media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Access control
    if (req.user.role !== 'admin' && media.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this media' });
    }

    const { title, description, category, tags, status } = req.body;

    media.title = title || media.title;
    media.description = description || media.description;
    media.category = category || media.category;
    if (tags) {
      media.tags = tags.split(',').map(t => t.trim());
    }
    media.status = status || media.status;

    await media.save();

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Edit',
      details: `Updated metadata for media: ${media.title}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, message: 'Media updated successfully', media: { ...media.toJSON(), _id: media.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete media asset
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Access control
    if (req.user.role !== 'admin' && media.ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this media' });
    }

    // Try deleting physical file
    const absolutePath = path.join(__dirname, '..', media.fileUrl);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
      } catch (err) {
        console.warn('Physical file deletion warning:', err.message);
      }
    }

    const title = media.title;
    await media.destroy();

    // Clean up recommendations
    await Recommendation.destroy({ where: { mediaId: req.params.id } });

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Delete',
      details: `Deleted media file: ${title}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, message: 'Media asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download media asset (increments downloads)
// @route   GET /api/media/:id/download
// @access  Private
const downloadMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    media.downloadsCount += 1;
    await media.save();

    const filePath = path.join(__dirname, '..', media.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Physical file not found on disk' });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Download',
      details: `Downloaded media: ${media.title}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.download(filePath, media.title + path.extname(media.fileUrl));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate a shareable link token
// @route   POST /api/media/:id/share
// @access  Private
const shareMedia = async (req, res) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    const { hours } = req.body;
    const validityHours = hours ? parseInt(hours) : 24;

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + validityHours);

    // Save token within sharedLinks array in JSON column
    const currentLinks = Array.isArray(media.sharedLinks) ? media.sharedLinks : [];
    media.sharedLinks = [...currentLinks, { token, expiresAt, clicks: 0 }];
    await media.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Share',
      details: `Generated share link for media: ${media.title}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    const shareUrl = `/api/media/shared/${token}`;

    res.json({
      success: true,
      shareUrl,
      expiresAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Access shareable media content (Public Route)
// @route   GET /api/media/shared/:token
// @access  Public
const accessSharedMedia = async (req, res) => {
  try {
    const { token } = req.params;

    // Find media matching token in JSON array column
    // For SQL, we can fetch candidates or query using JSON_CONTAINS.
    // Given memory efficiency on typical local database runs, we can search using Sequelize Op.like or standard fetch & filter.
    // Op.like search matches the token string inside the JSON text block reliably
    const media = await Media.findOne({
      where: {
        sharedLinks: {
          [Op.like]: `%${token}%`
        }
      }
    });

    if (!media) {
      return res.status(404).send('<h1>Link is invalid or expired</h1>');
    }

    // Check expiration
    const links = Array.isArray(media.sharedLinks) ? media.sharedLinks : [];
    const activeLink = links.find(link => link.token === token);
    if (!activeLink || new Date() > new Date(activeLink.expiresAt)) {
      return res.status(410).send('<h1>Shareable link has expired</h1>');
    }

    // Increment clicks
    activeLink.clicks += 1;
    media.sharedLinks = links; // reassign to trigger Sequelize change detection
    media.changed('sharedLinks', true);
    
    media.viewsCount += 1;
    await media.save();

    const filePath = path.join(__dirname, '..', media.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('<h1>Physical content file missing</h1>');
    }

    // Log Activity
    await ActivityLog.create({
      action: 'Shared Access',
      details: `Accessed shared content for media: ${media.title} via token: ${token}`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).send('<h1>Internal Server Error</h1>');
  }
};

// @desc    Schedule releasing publications
// @route   POST /api/media/release-scheduled
// @access  Private (Admin only)
const releaseScheduledMedia = async (req, res) => {
  try {
    const now = new Date();
    const [affectedCount] = await Media.update(
      { status: 'published', isScheduled: false, scheduledDate: null },
      {
        where: {
          isScheduled: true,
          scheduledDate: { [Op.lte]: now },
          status: 'draft'
        }
      }
    );

    res.json({
      success: true,
      message: `Released scheduled assets. Modified count: ${affectedCount}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  downloadMedia,
  shareMedia,
  accessSharedMedia,
  releaseScheduledMedia,
};
