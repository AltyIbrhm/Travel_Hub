import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

const updateLocalUser = (userData) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...currentUser, ...userData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  // Dispatch custom event for navbar update
  window.dispatchEvent(new Event('userDataChanged'));
};

// Get user profile
const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    updateLocalUser(data);
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw new Error('Failed to fetch profile');
  }
};

// Update user profile with image support
const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    updateLocalUser(data);
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteProfilePicture = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${API_URL}/delete-picture`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized');
      throw new Error('Failed to delete profile picture');
    }

    const data = await response.json();
    updateLocalUser({ profilePicture: null });
    return data;
  } catch (error) {
    throw error;
  }
};

const profileService = {
  getProfile,
  updateProfile,
  deleteProfilePicture
};

export default profileService; 