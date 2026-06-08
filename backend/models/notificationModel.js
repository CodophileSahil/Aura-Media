const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define(
  'Notification',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'danger'),
      defaultValue: 'info'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }
);

module.exports = Notification;
