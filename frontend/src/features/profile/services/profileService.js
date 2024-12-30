import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const profileService = {
  // Get profile and emergency contact
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { profile: null, message: 'Authentication required' };
      }

      const response = await api.get('/profile');
      
      if (!response.data || (!response.data.profile && !response.data.message)) {
        return { profile: null, message: 'Invalid profile data received' };
      }
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { profile: null, message: 'Profile not found' };
      }
      throw this.handleError(error);
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      console.log('Profile service: sending update request', profileData); // Debug log
      
      const response = await api.put('/profile', profileData);
      console.log('Profile service: received response', response.data); // Debug log
      
      if (!response.data) {
        throw new Error('No response data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Profile service: update error', error.response || error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Please log in again to update your profile');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid profile data');
      } else if (!error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection');
      }
      
      throw this.handleError(error);
    }
  },

  // Update emergency contact
  async updateEmergencyContact(contactData) {
    try {
      const response = await api.put('/profile/emergency-contact', contactData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Upload profile photo
  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Delete profile photo
  async deleteProfilePhoto() {
    try {
      const response = await api.delete('/profile/photo');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response from server',
        status: 503
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'An error occurred',
        status: 500
      };
    }
  }
}; 