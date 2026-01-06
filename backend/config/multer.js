const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow common audio file extensions
  const allowedExtensions = /\.(wav|mp3|ogg|flac|m4a|aac|webm|opus)$/i;
  const extname = allowedExtensions.test(file.originalname);
  
  // Allow audio mime types or if extension matches
  const isAudioMime = file.mimetype && file.mimetype.startsWith('audio/');
  const isApplicationOctet = file.mimetype === 'application/octet-stream';
  
  if (extname || isAudioMime || isApplicationOctet) {
    return cb(null, true);
  } else {
    cb(new Error("Only audio files are allowed!"));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
