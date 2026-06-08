const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Media = sequelize.define(
  'Media',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'General'
    },
    tags: {
      type: DataTypes.JSON, // Maps to MySQL JSON column for array of tags
      defaultValue: []
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'audio', 'document'),
      allowNull: false
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'published'
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    aiSummary: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    aiKeywords: {
      type: DataTypes.JSON, // Maps to MySQL JSON column for array of keywords
      defaultValue: []
    },
    aiTranscript: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    downloadsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    sharedLinks: {
      type: DataTypes.JSON, // Maps to MySQL JSON column for list of link objects
      defaultValue: []
    }
  }
);

module.exports = Media;
