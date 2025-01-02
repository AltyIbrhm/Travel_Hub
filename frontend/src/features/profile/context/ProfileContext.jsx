import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

// Default avatar as base64 string
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWU1ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxNyIgZmlsbD0iI2IwYjZjMiIvPjxwYXRoIGQ9Ik0yMyw4NiBDMjMsNjggNDAsNTggNTAsNTggQzYwLDU4IDc3LDY4IDc3LDg2IiBmaWxsPSIjYjBiNmMyIi8+PC9zdmc+';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfilePictureUrl = (path) => {
    if (!path) return defaultAvatar;
    if (path.startsWith('http')) return path;
    
    // The backend returns paths like /api/uploads/profiles/filename.jpg
    // We just need to append it to the API_URL
    return `${API_URL}${path}`;
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      if (response.profile) {
        setProfile(response.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      loading, 
      refreshProfile,
      getProfilePictureUrl 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}; 