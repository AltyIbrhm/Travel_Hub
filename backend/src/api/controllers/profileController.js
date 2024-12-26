const UserModel = require('../models/userModel');
const fs = require('fs').promises;
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../../uploads/profile-pictures');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profile_picture
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address
    };

    // Handle profile picture upload
    if (req.file) {
      console.log('File uploaded:', req.file);
      // Save the URL path that will be accessible from the frontend
      updateData.profilePicture = `http://localhost:5000/uploads/profile-pictures/${req.file.filename}`;
      console.log('Profile picture path:', updateData.profilePicture);
    }

    console.log('Updating user with data:', updateData);
    const updatedUser = await UserModel.updateUser(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Updated user:', updatedUser);
    res.json({
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profile_picture
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profile_picture) {
      // Extract filename from the URL
      const filename = user.profile_picture.split('/').pop();
      const filePath = path.join(__dirname, '../../../uploads/profile-pictures', filename);

      try {
        // Delete the file
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    // Update user profile to remove picture reference
    const updatedUser = await UserModel.updateUser(userId, { profilePicture: null });

    res.json({
      email: updatedUser.email,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: null
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ message: 'Error deleting profile picture' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfilePicture
};
