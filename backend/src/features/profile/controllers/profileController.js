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
  // Get profile and emergency contact
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      // Try to get from cache first
      const cachedProfile = await cacheService.getProfile(userId);
      const cachedEmergencyContact = await cacheService.getEmergencyContact(userId);

      if (cachedProfile && cachedEmergencyContact) {
        return res.json(transformProfileWithEmergencyContact(cachedProfile, cachedEmergencyContact));
      }

      // If not in cache, get from database
      let [profile, emergencyContact] = await Promise.all([
        profileService.getProfile(userId),
        emergencyContactService.getEmergencyContact(userId)
      ]).catch(error => {
        console.error('Database fetch error:', error);
        throw error;
      });

      // If no profile exists, create a default one
      if (!profile) {
        try {
          // Create profile directly in the database to bypass validation
          profile = await profileService.createProfileRaw({
            userId,
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: new Date('2000-01-01'), // Default date
            language: 'English',
            address: '',
            profilePicture: null
          });

          // Create empty emergency contact directly in the database
          emergencyContact = await emergencyContactService.createEmergencyContactRaw({
            userId,
            emergencyName: '',
            emergencyPhone: '',
            emergencyRelationship: ''
          });
        } catch (createError) {
          console.error('Error creating default profile:', createError);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to create default profile',
            details: createError.message
          });
        }
      }

      // Cache the results
      await Promise.all([
        cacheService.setProfile(userId, profile),
        cacheService.setEmergencyContact(userId, emergencyContact)
      ]);

      const response = transformProfileWithEmergencyContact(profile, emergencyContact);
      res.json(response);
    } catch (error) {
      console.error('Error in getProfile controller:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: error.message
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
      const filePath = `/api/uploads/profiles/${fileName}`;
      const uploadDir = path.join(__dirname, '../../../uploads/profiles');

      console.log('Starting upload process for user:', userId);
      console.log('File upload details:', {
        originalName: req.file.originalname,
        fileName: fileName,
        filePath: filePath,
        fullPath: req.file.path,
        uploadDir: uploadDir
      });

      // Delete all previous files for this user
      try {
        console.log(`Cleaning up old files for user ${userId} in directory:`, uploadDir);
        const files = await fs.promises.readdir(uploadDir);
        console.log('All files in directory:', files);
        
        let deletedFiles = 0;
        for (const file of files) {
          console.log(`Checking file: ${file}`);
          console.log(`Current file starts with ${userId}-:`, file.startsWith(`${userId}-`));
          console.log(`Current file !== ${fileName}:`, file !== fileName);
          
          // Check if the file belongs to this user (starts with userId-)
          if (file.startsWith(`${userId}-`) && file !== fileName) {
            const oldFilePath = path.join(uploadDir, file);
            console.log(`Attempting to delete file: ${oldFilePath}`);
            
            try {
              const fileExists = await fs.promises.access(oldFilePath)
                .then(() => true)
                .catch(() => false);
                
              if (fileExists) {
                await fs.promises.unlink(oldFilePath);
                console.log(`Successfully deleted file: ${oldFilePath}`);
                deletedFiles++;
              } else {
                console.log(`File does not exist: ${oldFilePath}`);
              }
            } catch (deleteError) {
              console.error(`Error deleting file ${oldFilePath}:`, deleteError);
            }
          } else {
            console.log(`Skipping file ${file} as it doesn't match criteria`);
          }
        }
        console.log(`Cleanup complete. Deleted ${deletedFiles} files.`);
      } catch (error) {
        console.error('Error during file cleanup:', error);
      }

      // Update profile with new photo path
      const updatedProfile = await profileService.updateProfile(userId, {
        ProfilePicture: filePath
      });

      console.log('Profile updated with new photo path:', filePath);

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
        avatar: updatedProfile.ProfilePicture,
        timestamps: {
          created: updatedProfile.CreatedAt,
          updated: updatedProfile.UpdatedAt
        }
      };

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

      // Get the latest file
      const latestFile = userFiles[0];
      const filePath = path.join(uploadDir, latestFile);

      console.log('Attempting to delete latest file:', {
        fileName: latestFile,
        filePath: filePath
      });

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log('Successfully deleted file:', filePath);
      } else {
        console.log('File not found:', filePath);
      }

      // Update profile to remove photo reference
      const updatedProfile = await profileService.updateProfile(userId, {
        ProfilePicture: null
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
        avatar: null,
        timestamps: {
          created: updatedProfile.CreatedAt,
          updated: updatedProfile.UpdatedAt
        }
      };

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