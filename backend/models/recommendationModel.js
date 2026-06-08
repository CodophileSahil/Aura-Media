const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Recommendation = sequelize.define(
  'Recommendation',
  {
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 0.5
    },
    reason: {
      type: DataTypes.STRING,
      defaultValue: 'Based on your interest categories'
    }
  }
);

module.exports = Recommendation;
