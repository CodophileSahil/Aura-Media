const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File validation helper
const fileFilter = (req, file, cb) => {
  const allowedExtensions = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    video: ['.mp4', '.mkv', '.avi', '.mov', '.webm'],
    audio: ['.mp3', '.wav', '.m4a', '.ogg'],
    document: ['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx', '.pptx']
  };

  const fileExt = path.extname(file.originalname).toLowerCase();
  
  // Flatten all allowed extensions
  const allAllowed = Object.values(allowedExtensions).flat();

  if (allAllowed.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Supported extensions: ${allAllowed.join(', ')}`), false);
  }
};

// Size limits configuration (50MB maximum for media)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

module.exports = upload;
