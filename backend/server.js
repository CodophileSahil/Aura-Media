require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const socketService = require('./services/socketService');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: '*', // Allow connections from frontend Vite dev server (or configure dynamic)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});
socketService.initSocket(io);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // crucial to allow loading media previews on frontend
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting (Prevent abuse / DOS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Direct request logging for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root route for API checks
app.get('/', (req, res) => {
  res.json({ message: 'AuraMedia Smart Voice Activated API is running successfully' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
