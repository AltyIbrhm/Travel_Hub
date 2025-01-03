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



      // Return the data as-is since the backend now provides the correct structure
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
      const response = await api.put('/profile', profileData);
      
      if (!response.data) {
        throw new Error('No response data received from server');
      }

      if (response.data.status === 'success' && response.data.profile) {
        return {
          name: {
            first: response.data.profile.name?.first || '',
            last: response.data.profile.name?.last || '',
            full: response.data.profile.name?.full || ''
          },
          contact: {
            email: response.data.profile.contact?.email || '',
            phone: response.data.profile.contact?.phone || ''
          },
          preferences: {
            language: response.data.profile.preferences?.language || 'English'
          },
          dateOfBirth: response.data.profile.dateOfBirth || '',
          address: response.data.profile.address || '',
          profilePicture: response.data.profile.profilePicture,
          emergencyName: response.data.profile.emergencyName || '',
          emergencyPhone: response.data.profile.emergencyPhone || '',
          emergencyRelationship: response.data.profile.emergencyRelationship || ''
        };
      }

      return response.data;
    } catch (error) {
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
      // Send data in the format expected by backend validation
      const requestData = {
        emergencyName: contactData.emergencyName?.trim(),
        emergencyPhone: contactData.emergencyPhone?.trim() || '',
        emergencyRelationship: contactData.emergencyRelationship || ''
      };

      const response = await api.put('/profile/emergency-contact', requestData);
      
      if (!response.data) {
        throw new Error('No response data received');
      }

      // Transform the response to match frontend field names
      const transformedResponse = {
        ...response.data,
        contact: {
          emergencyName: response.data.contact.EmergencyName || '',
          emergencyPhone: response.data.contact.EmergencyPhone || '',
          emergencyRelationship: response.data.contact.EmergencyRelationship || ''
        }
      };

      return transformedResponse;
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid emergency contact data';
        throw new Error(errorMessage);
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (!error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection');
      }
      
      throw error;
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
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid file');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (!error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection');
      }
      throw error;
    }
  },

  // Delete profile photo
  async deleteProfilePhoto() {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete('/profile/photo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('No profile photo found');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (!error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection');
      }
      throw error;
    }
  },

  // Reset profile photo
  async resetProfilePhoto() {
    try {
      const response = await api.post('/profile/reset-photo');
      return response.data;
    } catch (error) {
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (!error.response) {
        throw new Error('Cannot connect to server. Please check your internet connection');
      }
      throw error;
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