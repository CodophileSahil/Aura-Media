const VoiceCommand = require('../models/voiceCommandModel');
const User = require('../models/userModel');
const ActivityLog = require('../models/activityLogModel');

// @desc    Log a voice command and detected intent
// @route   POST /api/voice/log
// @access  Private
const logVoiceCommand = async (req, res) => {
  try {
    const { rawTranscript, detectedIntent, recognizedEntities, isSuccess, errorDetail } = req.body;

    const command = await VoiceCommand.create({
      userId: req.user.id,
      rawTranscript,
      detectedIntent: detectedIntent || 'unknown',
      recognizedEntities: recognizedEntities || {},
      isSuccess: isSuccess === undefined ? true : isSuccess,
      errorDetail: errorDetail || '',
    });

    // Log in ActivityLog
    await ActivityLog.create({
      userId: req.user.id,
      action: 'VoiceCommand',
      details: `Spoke voice command: "${rawTranscript}" (Intent: ${detectedIntent})`,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(201).json({ success: true, command: { ...command.toJSON(), _id: command.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get voice command logs
// @route   GET /api/voice/logs
// @access  Private (Admin only)
const getVoiceCommandLogs = async (req, res) => {
  try {
    const logs = await VoiceCommand.findAll({
      include: [{ model: User, as: 'user', attributes: ['username', 'email'] }],
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
  logVoiceCommand,
  getVoiceCommandLogs,
};
