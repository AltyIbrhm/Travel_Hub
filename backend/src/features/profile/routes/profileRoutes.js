const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../../../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadDir = path.join(process.env.UPLOAD_DIR, 'profiles');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const userId = req.user.id;
    const uniqueSuffix = Date.now();
    cb(null, `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// All routes are protected with authentication
router.use(authenticateToken);

// Profile routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.delete('/', profileController.deleteProfile);

// Emergency contact routes
router.put('/emergency-contact', profileController.updateEmergencyContact);

// Profile photo routes
router.post('/photo', upload.single('photo'), profileController.uploadProfilePhoto);
router.delete('/photo', profileController.deleteProfilePhoto);

// Error handling for file uploads
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      message: 'Error uploading file'
    });
  }
  if (error.message === 'Invalid file type. Only JPEG, PNG and GIF are allowed.') {
    return res.status(400).json({
      message: error.message
    });
  }
  next(error);
});

module.exports = router; 