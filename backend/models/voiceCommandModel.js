const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VoiceCommand = sequelize.define(
  'VoiceCommand',
  {
    rawTranscript: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    detectedIntent: {
      type: DataTypes.STRING,
      defaultValue: 'unknown'
    },
    recognizedEntities: {
      type: DataTypes.JSON, // Maps to MySQL JSON column
      defaultValue: {}
    },
    isSuccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    errorDetail: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
  }
);

module.exports = VoiceCommand;
