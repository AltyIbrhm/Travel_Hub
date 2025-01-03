const profileService = require('../services/profileService');
const emergencyContactService = require('../services/emergencyContactService');
const cacheService = require('../services/cacheService');
const {
  transformProfileResponse,
  transformEmergencyContactResponse,
  transformProfileWithEmergencyContact
} = require('../transformers/profileTransformer');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

class ProfileController {
  // Get profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const profile = await profileService.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found'
        });
      }

      // Transform profile data consistently
      const transformedProfile = {
        id: profile.ProfileID,
        userId: profile.UserID,
        name: {
          first: profile.FirstName,
          last: profile.LastName,
          full: `${profile.FirstName} ${profile.LastName}`
        },
        contact: {
          email: profile.Email,
          phone: profile.PhoneNumber
        },
        preferences: {
          language: profile.Language
        },
        dateOfBirth: profile.DateOfBirth,
        address: profile.Address,
        profilePicture: profile.ProfilePicture,
        timestamps: {
          created: profile.CreatedAt,
          updated: profile.UpdatedAt
        }
      };

   

      res.json({
        status: 'success',
        profile: transformedProfile
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error getting profile'
      });
    }
  }

  // Create or update profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = {
        userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        language: req.body.language,
        address: req.body.address,
        profilePicture: req.body.profilePicture
      };

      let profile = await profileService.getProfile(userId);
      
      if (profile) {
        profile = await profileService.updateProfile(userId, profileData);
      } else {
        profile = await profileService.createProfile(profileData);
      }

      // Invalidate cache
      await cacheService.invalidateProfile(userId);

      res.json(transformProfileResponse(profile));
    } catch (error) {
      console.error('Error in updateProfile controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  // Update emergency contact
  async updateEmergencyContact(req, res) {
    try {
      const userId = req.user.id;
      const contactData = {
        userId,
        emergencyName: req.body.emergencyName,
        emergencyPhone: req.body.emergencyPhone,
        emergencyRelationship: req.body.emergencyRelationship
      };

      let contact = await emergencyContactService.getEmergencyContact(userId);
      
      if (contact) {
        contact = await emergencyContactService.updateEmergencyContact(userId, contactData);
      } else {
        contact = await emergencyContactService.createEmergencyContact(contactData);
      }

      // Invalidate cache
      await cacheService.invalidateEmergencyContact(userId);

      res.json(transformEmergencyContactResponse(contact));
    } catch (error) {
      console.error('Error in updateEmergencyContact controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  // Delete profile and emergency contact
  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Delete profile photo if exists
      const profile = await profileService.getProfile(userId);
      if (profile?.profilePicture) {
        const filePath = path.join(process.env.UPLOAD_DIR, profile.profilePicture);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Error deleting profile photo:', error);
        }
      }

      // Delete profile and emergency contact
      await Promise.all([
        profileService.deleteProfile(userId),
        emergencyContactService.deleteEmergencyContact(userId)
      ]);

      // Invalidate all cache
      await cacheService.invalidateAllUserData(userId);

      res.json({
        status: 'success',
        message: 'Profile deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteProfile controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        });
      }

      const userId = req.user.id;
      const fileName = req.file.filename;
      const filePath = `/uploads/profiles/${fileName}`;
      const uploadDir = path.join(__dirname, '../../../uploads/profiles');

      console.log('Upload process details:', {
        userId,
        fileName,
        filePath,
        fullPath: req.file.path,
        uploadDir,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      });

      // Delete all previous files for this user
      try {
        console.log(`Cleaning up old files for user ${userId} in directory:`, uploadDir);
        const files = await fs.promises.readdir(uploadDir);
        console.log('All files in directory:', files);
        
        let deletedFiles = 0;
        for (const file of files) {
          if (file.startsWith(`${userId}-`) && file !== fileName) {
            const oldFilePath = path.join(uploadDir, file);
            try {
              const fileExists = await fs.promises.access(oldFilePath)
                .then(() => true)
                .catch(() => false);
                
              if (fileExists) {
                await fs.promises.unlink(oldFilePath);
                console.log(`Successfully deleted old file: ${oldFilePath}`);
                deletedFiles++;
              }
            } catch (deleteError) {
              console.error(`Error deleting file ${oldFilePath}:`, deleteError);
            }
          }
        }
        console.log(`Cleanup complete. Deleted ${deletedFiles} files.`);
      } catch (error) {
        console.error('Error during file cleanup:', error);
      }

      // Update profile with new photo path
      const updatedProfile = await profileService.updateProfile(userId, {
        profilePicture: filePath
      });

      console.log('Profile update result:', {
        filePath,
        updatedProfilePicture: updatedProfile.ProfilePicture
      });

      // Transform profile data
      const transformedProfile = {
        id: updatedProfile.ProfileID,
        userId: updatedProfile.UserID,
        name: {
          first: updatedProfile.FirstName,
          last: updatedProfile.LastName,
          full: `${updatedProfile.FirstName} ${updatedProfile.LastName}`
        },
        contact: {
          email: updatedProfile.Email,
          phone: updatedProfile.PhoneNumber
        },
        preferences: {
          language: updatedProfile.Language
        },
        dateOfBirth: updatedProfile.DateOfBirth,
        address: updatedProfile.Address,
        profilePicture: updatedProfile.ProfilePicture,
        timestamps: {
          created: updatedProfile.CreatedAt,
          updated: updatedProfile.UpdatedAt
        }
      };

      console.log('Response profile:', {
        originalPath: filePath,
        transformedPath: transformedProfile.profilePicture,
        fullProfile: transformedProfile
      });

      res.json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        profile: transformedProfile
      });
    } catch (error) {
      console.error('Error in uploadProfilePhoto:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error uploading profile photo',
        details: error.message
      });
    }
  }

  // Delete profile photo
  async deleteProfilePhoto(req, res) {
    try {
      const userId = req.user.id;
      const uploadDir = path.join(__dirname, '../../../uploads/profiles');

      // Read all files in the directory
      const files = await fs.promises.readdir(uploadDir);
      
      // Filter files for this user and sort by timestamp (newest first)
      const userFiles = files
        .filter(file => file.startsWith(`${userId}-`))
        .sort((a, b) => {
          const timestampA = parseInt(a.split('-')[1].split('.')[0]);
          const timestampB = parseInt(b.split('-')[1].split('.')[0]);
          return timestampB - timestampA;
        });

      console.log('Found user files:', userFiles);

      if (userFiles.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'No profile photo found'
        });
      }

      // Delete all files for this user
      let deletedFiles = 0;
      for (const file of userFiles) {
        const filePath = path.join(uploadDir, file);
        try {
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            console.log('Successfully deleted file:', filePath);
            deletedFiles++;
          }
        } catch (deleteError) {
          console.error(`Error deleting file ${filePath}:`, deleteError);
        }
      }

      console.log(`Deleted ${deletedFiles} files`);

      // Update profile to remove photo reference
      const updatedProfile = await profileService.updateProfile(userId, {
        profilePicture: null
      });

      // Transform the response
      const transformedProfile = {
        id: updatedProfile.ProfileID,
        userId: updatedProfile.UserID,
        name: {
          first: updatedProfile.FirstName,
          last: updatedProfile.LastName,
          full: `${updatedProfile.FirstName} ${updatedProfile.LastName}`
        },
        contact: {
          email: updatedProfile.Email,
          phone: updatedProfile.PhoneNumber
        },
        preferences: {
          language: updatedProfile.Language
        },
        dateOfBirth: updatedProfile.DateOfBirth,
        address: updatedProfile.Address,
        profilePicture: null,
        timestamps: {
          created: updatedProfile.CreatedAt,
          updated: updatedProfile.UpdatedAt
        }
      };

      // Invalidate any cached profile data
      await cacheService.invalidateProfile(userId);

      res.json({
        status: 'success',
        message: 'Profile photo deleted successfully',
        profile: transformedProfile
      });
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting profile photo'
      });
    }
  }

  // Reset profile photo
  async resetProfilePhoto(req, res) {
    try {
      const userId = req.user.id;
      
      // Update profile to remove photo reference
      const updatedProfile = await profileService.updateProfile(userId, {
        profilePicture: null
      });

      // Invalidate cache
      await cacheService.invalidateProfile(userId);
      await cacheService.invalidateAllUserData(userId);

      res.json({
        status: 'success',
        message: 'Profile photo reset successfully',
        profile: transformProfileResponse(updatedProfile)
      });
    } catch (error) {
      console.error('Error resetting profile photo:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error resetting profile photo'
      });
    }
  }
}

module.exports = new ProfileController(); 