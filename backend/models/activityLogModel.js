const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    ipAddress: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    userAgent: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  },
  {
    updatedAt: false // Logs are create-only operations
  }
);

module.exports = ActivityLog;
