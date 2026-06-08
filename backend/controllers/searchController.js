const { Op } = require('sequelize');
const Media = require('../models/mediaModel');
const User = require('../models/userModel');
const ActivityLog = require('../models/activityLogModel');
const aiService = require('../services/aiService');

// @desc    Search media files using text or semantic search
// @route   GET /api/search
// @access  Private
const searchMedia = async (req, res) => {
  try {
    const { query, type, category, mediaType } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    // Role-based visibility logic
    let visibilityQuery = {};
    if (req.user.role === 'viewer') {
      whereClause = { status: 'published' };
      visibilityQuery.status = 'published';
    } else if (req.user.role === 'creator') {
      visibilityQuery[Op.or] = [
        { ownerId: req.user.id },
        { status: 'published' }
      ];
    }

    // Combine filters
    if (category) visibilityQuery.category = category;
    if (mediaType) visibilityQuery.mediaType = mediaType;

    // Log search activity
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Search',
      details: `Searched for: "${query}" (Type: ${type || 'text'})`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    let results = [];

    if (type === 'semantic') {
      // 1. Semantic Search
      const candidates = await Media.findAll({
        where: visibilityQuery,
        include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }]
      });

      const queryEmbedding = await aiService.getEmbeddings(query);

      results = await Promise.all(
        candidates.map(async (media) => {
          const docText = `${media.title} ${Array.isArray(media.tags) ? media.tags.join(' ') : ''} ${media.aiSummary || media.description}`;
          const docEmbedding = await aiService.getEmbeddings(docText);

          const score = aiService.cosineSimilarity(queryEmbedding, docEmbedding);
          
          const mediaJSON = media.toJSON();
          if (mediaJSON.owner) {
            mediaJSON.owner._id = mediaJSON.owner.id;
          }

          return {
            media: { ...mediaJSON, _id: media.id },
            score: Math.round(score * 100)
          };
        })
      );

      // Filter threshold & sort
      results = results
        .filter(r => r.score > 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    } else {
      // 2. Standard Text Search
      const textSearchQuery = {
        ...visibilityQuery,
        [Op.and]: [
          visibilityQuery,
          {
            [Op.or]: [
              { title: { [Op.like]: `%${query}%` } },
              { description: { [Op.like]: `%${query}%` } },
              { category: { [Op.like]: `%${query}%` } },
              { tags: { [Op.like]: `%${query}%` } },
              { aiTranscript: { [Op.like]: `%${query}%` } },
              { aiSummary: { [Op.like]: `%${query}%` } }
            ]
          }
        ]
      };

      const mediaItems = await Media.findAll({
        where: textSearchQuery,
        include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }]
      });

      results = mediaItems.map(media => {
        const mediaJSON = media.toJSON();
        if (mediaJSON.owner) {
          mediaJSON.owner._id = mediaJSON.owner.id;
        }

        return {
          media: { ...mediaJSON, _id: media.id },
          score: 100
        };
      });
    }

    res.json({
      success: true,
      query,
      searchType: type || 'text',
      count: results.length,
      results
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchMedia,
};
