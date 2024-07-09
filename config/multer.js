const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = './uploads/';

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    // File name will be unique timestamp + original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 } // File size limit in bytes (1MB)
}).single('profileImage'); // 'profileImage' is the field name for the uploaded file

module.exports = upload;
