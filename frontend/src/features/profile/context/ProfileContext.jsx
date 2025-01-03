import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { profileService } from '../services/profileService';

// Default avatar as base64 string
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWU1ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxNyIgZmlsbD0iI2IwYjZjMiIvPjxwYXRoIGQ9Ik0yMyw4NiBDMjMsNjggNDAsNTggNTAsNTggQzYwLDU4IDc3LDY4IDc3LDg2IiBmaWxsPSIjYjBiNmMyIi8+PC9zdmc+';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const transformProfileData = (data) => {
    if (!data) return null;

    // Log the raw data structure


    // Get the profile data (handle both nested and flat structures)
    const profileData = data.profile || data;


    const transformedData = {
      id: profileData.id,
      userId: profileData.userId,
      name: {
        first: profileData.name?.first || '',
        last: profileData.name?.last || '',
      },
      contact: {
        email: profileData.contact?.email || '',
        phone: profileData.contact?.phone || ''
      },
      preferences: {
        language: profileData.preferences?.language || 'English'
      },
      profilePicture: profileData.profilePicture,
      dateOfBirth: profileData.dateOfBirth || '',
      address: profileData.address || '',
      emergencyContact: profileData.emergencyContact || null
    };


    return transformedData;
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();

      
      if (response) {
        const transformedData = transformProfileData(response);
        setProfile(transformedData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = useCallback((path) => {
    if (!path) {
      return defaultAvatar;
    }
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }
    
    // Clean the path and ensure proper structure
    const cleanPath = path.replace(/^\/+/, '');
    const fullUrl = `${API_URL}/${cleanPath}`;
    

    
    return fullUrl;
  }, []);

  // Load profile data when component mounts
  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refreshProfile,
        getProfilePictureUrl
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}; 