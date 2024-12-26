const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get absolute path to uploads directory
const uploadDir = path.resolve(__dirname, '../../../uploads/profile-pictures');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Log the upload attempt
    console.log('Upload attempted:', {
      file: file.originalname,
      directory: uploadDir
    });

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log('Creating upload directory');
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Verify directory is writable
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Directory is writable');
    } catch (error) {
      console.error('Directory not writable:', error);
      return cb(new Error('Upload directory is not writable'));
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'profile-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname);
    
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    
    cb(null, true);
  }
}).single('profilePicture');

// Wrapper middleware with error handling
const uploadMiddleware = (req, res, next) => {
  console.log('Upload middleware started');
  
  upload(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        message: 'File upload failed', 
        error: err.message 
      });
    }

    if (!req.file) {
      console.log('No file uploaded');
    } else {
      console.log('File uploaded successfully:', req.file);
      
      // Verify file exists
      const filePath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        console.log('File verified at:', filePath);
      } else {
        console.error('File not found after upload:', filePath);
      }
    }

    next();
  });
};

module.exports = uploadMiddleware; 