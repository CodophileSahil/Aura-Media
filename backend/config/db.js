const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'voice_media_platform';

// Instantiate Sequelize synchronously at module root to avoid load race conditions
const sequelizeInstance = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    // 1. Create database if it does not exist using raw connection prior to authentication
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
    console.log(`MySQL Database '${database}' verified/created.`);

    // 2. Connect & Authenticate Sequelize
    await sequelizeInstance.authenticate();
    console.log('MySQL Database Connected successfully via Sequelize ORM.');

    // 3. Sync Models & Seed Data
    await syncAndSeed();

  } catch (error) {
    console.error(`Error connecting to MySQL Database: ${error.message}`);
    process.exit(1);
  }
};

const syncAndSeed = async () => {
  const User = require('../models/userModel');
  const Media = require('../models/mediaModel');
  const Notification = require('../models/notificationModel');
  const ActivityLog = require('../models/activityLogModel');
  const VoiceCommand = require('../models/voiceCommandModel');
  const Recommendation = require('../models/recommendationModel');

  // Define Associations/Relations
  User.hasMany(Media, { foreignKey: 'ownerId', as: 'media', onDelete: 'CASCADE' });
  Media.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

  User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs', onDelete: 'SET NULL' });
  ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(VoiceCommand, { foreignKey: 'userId', as: 'voiceCommands', onDelete: 'SET NULL' });
  VoiceCommand.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(Recommendation, { foreignKey: 'userId', as: 'recommendations', onDelete: 'CASCADE' });
  Recommendation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Media.hasMany(Recommendation, { foreignKey: 'mediaId', as: 'recommendations', onDelete: 'CASCADE' });
  Recommendation.belongsTo(Media, { foreignKey: 'mediaId', as: 'media' });

  // Sync Schemas
  await sequelizeInstance.sync({ force: false, alter: true });
  console.log('SQL Schemas synchronized successfully.');

  // Seed Default Credentials
  const userCount = await User.count();
  if (userCount === 0) {
    console.log('Seeding initial default user accounts into MySQL...');
    
    // Admin User
    const admin = await User.create({
      username: 'Admin User',
      email: 'admin@auramedia.com',
      password: 'admin123',
      role: 'admin',
      profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
    });
    
    // Creator User
    const creator = await User.create({
      username: 'Creator User',
      email: 'creator@auramedia.com',
      password: 'creator123',
      role: 'creator',
      profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Creator'
    });

    // Viewer User
    const viewer = await User.create({
      username: 'Viewer User',
      email: 'viewer@auramedia.com',
      password: 'viewer123',
      role: 'viewer',
      profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=Viewer'
    });

    console.log('Demo accounts seeded. Creating initial media entries...');

    // Seed default media assets
    await Media.create({
      title: 'System Architecture Design Doc',
      description: 'Technical document representing the platform specifications, routes mapping, and middleware roles.',
      category: 'Technology',
      tags: ['architecture', 'design', 'specs', 'developer'],
      ownerId: admin.id,
      fileUrl: '/uploads/sample-doc.txt',
      fileType: 'text/plain',
      mediaType: 'document',
      fileSize: 1024,
      status: 'published',
      aiSummary: 'A high-level systems design specifications detailing CORS handling, Helmet protection layers, and MongoDB configurations.',
      aiKeywords: ['specification', 'middleware', 'mern-stack', 'system']
    });

    await Media.create({
      title: 'Voice Synthesizer Welcome Audio',
      description: 'Welcome soundtrack audio describing voice navigation commands.',
      category: 'Education',
      tags: ['voice', 'soundtrack', 'welcome', 'assistant'],
      ownerId: creator.id,
      fileUrl: '/uploads/sample-audio.mp3',
      fileType: 'audio/mpeg',
      mediaType: 'audio',
      fileSize: 2048000,
      status: 'published',
      aiSummary: 'A welcoming recording detailing layout navigation voice options like "Open Library" and "Open Dashboard".',
      aiKeywords: ['speech', 'voice-interaction', 'guide'],
      aiTranscript: 'Welcome to AuraMedia. Try activating voice control using the microphone button.'
    });

    console.log('Initial MySQL seeding completed.');
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelizeInstance;
