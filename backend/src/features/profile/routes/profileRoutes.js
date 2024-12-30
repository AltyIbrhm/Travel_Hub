const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../../../middleware/auth');
const { validateProfile, validateEmergencyContact } = require('../validators/profileValidator');
const { profileLimiter, photoUploadLimiter, emergencyContactLimiter } = require('../middleware/rateLimiter');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/profiles');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const fileName = `${userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All routes are protected with authentication
router.use(authenticateToken);

// Profile routes with rate limiting and validation
router.get('/', profileLimiter, profileController.getProfile);
router.put('/', profileLimiter, validateProfile, profileController.updateProfile);
router.delete('/', profileLimiter, profileController.deleteProfile);

// Emergency contact routes with rate limiting and validation
router.put(
  '/emergency-contact',
  emergencyContactLimiter,
  validateEmergencyContact,
  profileController.updateEmergencyContact
);

// Profile photo routes with rate limiting
router.post(
  '/photo',
  photoUploadLimiter,
  upload.single('photo'),
  profileController.uploadProfilePhoto
);

router.delete('/photo', photoUploadLimiter, profileController.deleteProfilePhoto);
router.post('/reset-photo', profileController.resetProfilePhoto);

// Error handling for file uploads
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: `Error uploading file: ${error.message}`
    });
  }
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  res.status(500).json({
    status: 'error',
    message: 'Unexpected error during file upload'
  });
});

module.exports = router; 