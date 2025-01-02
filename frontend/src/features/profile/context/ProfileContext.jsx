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
    console.log('getProfilePictureUrl input path:', path);
    
    if (!path) {
      console.log('No path provided, using default avatar');
      return defaultAvatar;
    }
    
    if (path.startsWith('http')) {
      console.log('Using full URL:', path);
      return path;
    }
    
    // Remove any leading /api prefix
    const cleanPath = path.replace(/^\/api/, '');
    const url = `${API_URL}${cleanPath}`;
    
    console.log('getProfilePictureUrl constructed URL:', url);
    return url;
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      
      if (response.profile) {
        // Transform the profile data to ensure consistent structure
        const profileData = {
          ...response.profile,
          name: {
            first: response.profile.name?.first || '',
            last: response.profile.name?.last || '',
            full: `${response.profile.name?.first || ''} ${response.profile.name?.last || ''}`.trim()
          },
          contact: {
            email: response.profile.contact?.email || '',
            phone: response.profile.contact?.phone || ''
          },
          preferences: {
            language: response.profile.preferences?.language || 'English'
          },
          profilePicture: response.profile.profilePicture || null,
          dateOfBirth: response.profile.dateOfBirth || '',
          address: response.profile.address || ''
        };
        
        console.log('Setting profile data:', profileData);
        setProfile(profileData);
        
        // Dispatch an event to notify other components
        const event = new CustomEvent('profileUpdated', { 
          detail: { profile: profileData } 
        });
        window.dispatchEvent(event);
      } else {
        console.log('No profile data received');
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
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