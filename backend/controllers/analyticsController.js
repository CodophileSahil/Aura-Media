const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('../models/userModel');
const Media = require('../models/mediaModel');
const ActivityLog = require('../models/activityLogModel');
const Recommendation = require('../models/recommendationModel');
const VoiceCommand = require('../models/voiceCommandModel');

// @desc    Get dashboard analytics tailored to the user role
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'admin') {
      // Admin Metrics
      const totalUsers = await User.count();
      const totalUploads = await Media.count();
      const totalImages = await Media.count({ where: { mediaType: 'image' } });
      const totalVideos = await Media.count({ where: { mediaType: 'video' } });
      const totalAudios = await Media.count({ where: { mediaType: 'audio' } });
      const totalDocs = await Media.count({ where: { mediaType: 'document' } });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Active users: count distinct userId in ActivityLogs
      const activeUsersCount = await ActivityLog.count({
        distinct: true,
        col: 'userId',
        where: {
          createdAt: { [Op.gte]: thirtyDaysAgo }
        }
      });

      // Aggregated Activity counts by Action Type
      const activityBreakdown = await ActivityLog.findAll({
        attributes: [
          'action',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['action']
      });

      // Timeline uploads by day (last 7 days)
      const uploadsTimeline = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const nextD = new Date(d);
        nextD.setDate(nextD.getDate() + 1);

        const count = await Media.count({
          where: {
            createdAt: {
              [Op.gte]: d,
              [Op.lt]: nextD
            }
          }
        });
        
        uploadsTimeline.push({
          date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          uploads: count
        });
      }

      // Recent Activity Logs (limit 10)
      const recentActivities = await ActivityLog.findAll({
        include: [{ model: User, as: 'user', attributes: ['username', 'email'] }],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      const totalVoiceCommands = await VoiceCommand.count();

      const formattedActivities = recentActivities.map(log => {
        const json = log.toJSON();
        if (json.user) {
          json.user._id = json.user.id;
        }
        return { ...json, _id: json.id };
      });

      return res.json({
        success: true,
        role,
        metrics: {
          totalUsers,
          totalUploads,
          activeUsers: activeUsersCount,
          totalVoiceCommands,
          mediaTypeCounts: {
            images: totalImages,
            videos: totalVideos,
            audios: totalAudios,
            documents: totalDocs
          }
        },
        uploadsTimeline,
        activityBreakdown: activityBreakdown.map(item => ({
          name: item.action,
          value: parseInt(item.getDataValue('count'))
        })),
        recentActivities: formattedActivities
      });

    } else if (role === 'creator') {
      // Creator Metrics
      const myUploadsCount = await Media.count({ where: { ownerId: req.user.id } });
      const totalViews = await Media.sum('viewsCount', { where: { ownerId: req.user.id } }) || 0;
      const totalDownloads = await Media.sum('downloadsCount', { where: { ownerId: req.user.id } }) || 0;

      // Popular content (owner's top 5 media files)
      const popularContent = await Media.findAll({
        where: { ownerId: req.user.id },
        include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'email', 'profileImage'] }],
        order: [['viewsCount', 'DESC']],
        limit: 5
      });

      // AI Insights
      let insight = "Your media distribution is balanced. Try uploading video contents to boost engagement.";
      if (myUploadsCount > 0) {
        if (totalViews / myUploadsCount > 10) {
          insight = "Excellent engagement! Your uploaded content averages over 10 views per item. Consider sharing links on external pages.";
        } else if (totalDownloads > totalViews * 0.5) {
          insight = "High conversion rate! Users are downloading your files frequently. Consider publishing more detailed PDF document resources.";
        }
      }

      // Upload distribution by media type
      const myMediaStats = await Media.findAll({
        where: { ownerId: req.user.id },
        attributes: [
          'mediaType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['mediaType']
      });

      const formattedPopular = popularContent.map(item => {
        const json = item.toJSON();
        if (json.owner) {
          json.owner._id = json.owner.id;
        }
        return { ...json, _id: json.id };
      });

      return res.json({
        success: true,
        role,
        metrics: {
          myUploads: myUploadsCount,
          views: totalViews,
          downloads: totalDownloads,
          aiInsight: insight
        },
        popularContent: formattedPopular,
        mediaDistribution: myMediaStats.map(item => ({
          name: item.mediaType,
          value: parseInt(item.getDataValue('count'))
        }))
      });

    } else {
      // Viewer Metrics
      // Recommended Content
      const recommendations = await Recommendation.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Media,
          as: 'media',
          include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }]
        }],
        order: [['score', 'DESC']],
        limit: 6
      });

      // Recently Viewed (Download logs)
      const recentViewsLogs = await ActivityLog.findAll({
        where: { userId: req.user.id, action: 'Download' },
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      // Saved content simulation (popular published content)
      const savedContent = await Media.findAll({
        where: { status: 'published' },
        include: [{ model: User, as: 'owner', attributes: ['id', 'username'] }],
        order: [['viewsCount', 'DESC']],
        limit: 4
      });

      const formattedRecs = recommendations.map(r => {
        const json = r.toJSON();
        if (json.media) {
          json.media._id = json.media.id;
          if (json.media.owner) {
            json.media.owner._id = json.media.owner.id;
          }
        }
        return {
          _id: r.id,
          score: Math.round(r.score * 100),
          reason: r.reason,
          media: json.media
        };
      });

      const formattedSaved = savedContent.map(item => {
        const json = item.toJSON();
        if (json.owner) {
          json.owner._id = json.owner.id;
        }
        return { ...json, _id: json.id };
      });

      const formattedViews = recentViewsLogs.map(log => ({
        ...log.toJSON(),
        _id: log.id
      }));

      return res.json({
        success: true,
        role,
        recommendations: formattedRecs,
        recentViews: formattedViews,
        savedContent: formattedSaved
      });
    }

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system logs
// @route   GET /api/analytics/logs
// @access  Private (Admin only)
const getSystemLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, as: 'user', attributes: ['username', 'email', 'role'] }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    const formattedLogs = logs.map(log => {
      const json = log.toJSON();
      if (json.user) {
        json.user._id = json.user.id;
      }
      return { ...json, _id: json.id };
    });

    res.json({ success: true, count: formattedLogs.length, logs: formattedLogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  getSystemLogs,
};
