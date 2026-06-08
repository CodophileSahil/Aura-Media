let ioObject = null;
const userSockets = new Map(); // Map to store userId -> socketId mapping

const initSocket = (io) => {
  ioObject = io;

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Register user ID with socket ID on join
    socket.on('register_user', (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      // Find and remove socket mapping
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} socket disconnected`);
          break;
        }
      }
    });
  });
};

/**
 * Send notification to a specific user
 */
const sendNotificationToUser = (userId, notification) => {
  if (!ioObject) return;

  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    ioObject.to(socketId).emit('notification', notification);
    console.log(`Real-time notification sent to user ${userId}`);
  } else {
    console.log(`User ${userId} offline. Notification saved to DB only.`);
  }
};

/**
 * Broadcast notification to all connected clients
 */
const broadcastNotification = (notification) => {
  if (!ioObject) return;
  ioObject.emit('notification', notification);
  console.log(`Broadcasted real-time notification to all users`);
};

module.exports = {
  initSocket,
  sendNotificationToUser,
  broadcastNotification
};
