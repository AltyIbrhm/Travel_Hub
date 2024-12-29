const profileService = require('../services/profileService');
const emergencyContactService = require('../services/emergencyContactService');
const path = require('path');
const fs = require('fs').promises;

class ProfileController {
  // Get profile and emergency contact
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming user ID is set by auth middleware
      const [profile, emergencyContact] = await Promise.all([
        profileService.getProfile(userId),
        emergencyContactService.getEmergencyContact(userId)
      ]);

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json({
        profile,
        emergencyContact
      });
    } catch (error) {
      console.error('Error in getProfile controller:', error);
      res.status(500).json({ message: 'Internal server error' });
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

      res.json(profile);
    } catch (error) {
      console.error('Error in updateProfile controller:', error);
      res.status(500).json({ message: 'Internal server error' });
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

      res.json(contact);
    } catch (error) {
      console.error('Error in updateEmergencyContact controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete profile and emergency contact
  async deleteProfile(req, res) {
    try {
      const userId = req.user.id;
      await Promise.all([
        profileService.deleteProfile(userId),
        emergencyContactService.deleteEmergencyContact(userId)
      ]);

      res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error('Error in deleteProfile controller:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const userId = req.user.id;
      const fileName = `${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = `/uploads/profiles/${fileName}`;

      // Get current profile to delete old photo if exists
      const currentProfile = await profileService.getProfile(userId);
      if (currentProfile?.profilePicture) {
        const oldFilePath = path.join(process.env.UPLOAD_DIR, currentProfile.profilePicture);
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error('Error deleting old profile photo:', error);
        }
      }

      // Update profile with new photo path
      const updatedProfile = await profileService.updateProfile(userId, {
        ...currentProfile,
        profilePicture: filePath
      });

      res.json({
        message: 'Profile photo uploaded successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Error in uploadProfilePhoto:', error);
      res.status(500).json({ message: 'Error uploading profile photo' });
    }
  }

  // Delete profile photo
  async deleteProfilePhoto(req, res) {
    try {
      const userId = req.user.id;
      const profile = await profileService.getProfile(userId);

      if (!profile?.profilePicture) {
        return res.status(404).json({ message: 'No profile photo found' });
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

      res.json({
        message: 'Profile photo deleted successfully',
        profile: updatedProfile
      });
    } catch (error) {
      console.error('Error in deleteProfilePhoto:', error);
      res.status(500).json({ message: 'Error deleting profile photo' });
    }
  }
}

module.exports = new ProfileController(); 