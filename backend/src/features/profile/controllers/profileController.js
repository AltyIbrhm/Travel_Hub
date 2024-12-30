const profileService = require('../services/profileService');
const emergencyContactService = require('../services/emergencyContactService');
const cacheService = require('../services/cacheService');
const {
  transformProfileResponse,
  transformEmergencyContactResponse,
  transformProfileWithEmergencyContact
} = require('../transformers/profileTransformer');
const path = require('path');
const fs = require('fs').promises;

class ProfileController {
  // Get profile and emergency contact
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      console.log('Getting profile for user:', userId);

      // Try to get from cache first
      console.log('Checking cache...');
      const cachedProfile = await cacheService.getProfile(userId);
      const cachedEmergencyContact = await cacheService.getEmergencyContact(userId);

      if (cachedProfile && cachedEmergencyContact) {
        console.log('Cache hit - returning cached data');
        return res.json(transformProfileWithEmergencyContact(cachedProfile, cachedEmergencyContact));
      }

      console.log('Cache miss - fetching from database');
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
        console.log('No profile found - creating default profile');
        try {
          // Create profile directly in the database to bypass validation
          const result = await profileService.createProfileRaw({
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
          profile = result;
          console.log('Default profile created:', profile);

          // Create empty emergency contact directly in the database
          const contactResult = await emergencyContactService.createEmergencyContactRaw({
            userId,
            emergencyName: '',
            emergencyPhone: '',
            emergencyRelationship: ''
          });
          emergencyContact = contactResult;
          console.log('Default emergency contact created:', emergencyContact);
        } catch (createError) {
          console.error('Error creating default profile:', createError);
          if (createError.code) {
            console.error('SQL Error Code:', createError.code);
          }
          if (createError.number) {
            console.error('SQL Error Number:', createError.number);
          }
          return res.status(500).json({
            status: 'error',
            message: 'Failed to create default profile',
            details: createError.message
          });
        }
      }

      // Cache the results
      console.log('Caching results...');
      await Promise.all([
        cacheService.setProfile(userId, profile),
        cacheService.setEmergencyContact(userId, emergencyContact)
      ]);

      console.log('Sending response...');
      const response = transformProfileWithEmergencyContact(profile, emergencyContact);
      console.log('Transformed response:', response);
      res.json(response);
    } catch (error) {
      console.error('Error in getProfile controller:', error);
      if (error.code) {
        console.error('SQL Error Code:', error.code);
      }
      if (error.number) {
        console.error('SQL Error Number:', error.number);
      }
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
      const filePath = `/uploads/profiles/${fileName}`;

      console.log('File upload details:', {
        originalName: req.file.originalname,
        fileName: fileName,
        filePath: filePath,
        fullPath: req.file.path
      });

      // Get current profile to delete old photo if exists
      const currentProfile = await profileService.getProfile(userId);
      if (currentProfile?.profilePicture) {
        const oldPath = path.join(__dirname, '../../../', currentProfile.profilePicture);
        try {
          await fs.promises.unlink(oldPath);
          console.log('Deleted old profile photo:', oldPath);
        } catch (error) {
          console.error('Error deleting old profile photo:', error);
        }
      }

      // Update profile with new photo path
      const updatedProfile = await profileService.updateProfile(userId, {
        profilePicture: filePath
      });

      console.log('Profile updated with new photo path:', filePath);

      res.json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        profile: {
          avatar: filePath
        }
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
      const profile = await profileService.getProfile(userId);

      if (!profile?.profilePicture) {
        return res.status(404).json({
          status: 'error',
          message: 'No profile photo found'
        });
      }

      // Delete the file
      const filePath = path.join(process.env.UPLOAD_DIR, profile.profilePicture);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting profile photo file:', error);
      }

      // Update profile to remove photo reference
      const updatedProfile = await profileService.updateProfile(userId, {
        ...profile,
        profilePicture: null
      });

      // Invalidate cache
      await cacheService.invalidateProfile(userId);

      res.json({
        status: 'success',
        message: 'Profile photo deleted successfully',
        profile: transformProfileResponse(updatedProfile)
      });
    } catch (error) {
      console.error('Error in deleteProfilePhoto:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error deleting profile photo'
      });
    }
  }
}

module.exports = new ProfileController(); 