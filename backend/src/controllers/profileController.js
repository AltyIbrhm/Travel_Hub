const path = require('path');
const fs = require('fs');
const { profileService } = require('../services/profileService');

const uploadProfilePhoto = async (req, res) => {
  try {
    console.log('Controller: Starting photo upload process');
    console.log('Request file:', req.file);
    console.log('Request user:', req.user);
    
    if (!req.file) {
      console.log('Controller: No file found in request');
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    if (!req.user || !req.user.id) {
      console.error('Controller: No user ID found in request');
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      });
    }

    const userId = req.user.id;
    console.log('Controller: User ID:', userId);
    
    const fileName = req.file.filename;
    const uploadDir = path.join(__dirname, '../../uploads/profiles');
    const filePath = path.join(uploadDir, fileName);
    
    console.log('Controller: File details:', {
      fileName,
      uploadDir,
      filePath,
      originalFile: req.file
    });

    // Ensure upload directory exists
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
      console.log('Controller: Upload directory verified');
    } catch (error) {
      console.error('Controller: Error creating upload directory:', error);
      throw new Error(`Failed to create upload directory: ${error.message}`);
    }

    // Get current profile to delete old photo if exists
    try {
      const currentProfile = await profileService.getProfile(userId);
      if (currentProfile?.profilePicture) {
        const oldPath = path.join(__dirname, '../..', currentProfile.profilePicture);
        try {
          await fs.promises.unlink(oldPath);
          console.log('Controller: Old profile photo deleted:', oldPath);
        } catch (error) {
          console.error('Controller: Error deleting old profile photo:', error);
          // Don't throw here, just log the error
        }
      }

      // Save the relative path to the database
      const dbFilePath = `/uploads/profiles/${fileName}`;
      console.log('Controller: Saving file path to database:', dbFilePath);
      
      // Only update the profilePicture field
      const updatedProfile = await profileService.updateProfile(userId, {
        profilePicture: dbFilePath
      });

      console.log('Controller: Profile updated successfully');

      res.json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        profile: {
          avatar: dbFilePath
        }
      });
    } catch (error) {
      console.error('Controller: Error accessing profile service:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  } catch (error) {
    console.error('Controller: Error in uploadProfilePhoto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error uploading profile photo',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 