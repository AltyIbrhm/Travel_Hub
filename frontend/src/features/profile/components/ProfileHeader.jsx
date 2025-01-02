import React, { useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useProfile } from '../context/ProfileContext';

// Default avatar as base64 string
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWU1ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxNyIgZmlsbD0iI2IwYjZjMiIvPjxwYXRoIGQ9Ik0yMyw4NiBDMjMsNjggNDAsNTggNTAsNTggQzYwLDU4IDc3LDY4IDc3LDg2IiBmaWxsPSIjYjBiNmMyIi8+PC9zdmc+';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const ProfileHeader = ({ 
  formData, 
  loading, 
  onPhotoChange, 
  onDeletePhoto 
}) => {
  const fileInputRef = useRef(null);
  const { refreshProfile } = useProfile();

  // Add useEffect for profile picture updates
  useEffect(() => {
    const handleProfilePictureUpdate = async (event) => {
      console.log('Profile picture update event received:', event.detail);
      // Instead of directly updating formData, refresh the profile
      await refreshProfile();
    };

    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    };
  }, [refreshProfile]);

  const getProfilePictureUrl = (path) => {
    console.log('Raw profile picture path:', path);
    
    if (!path) {
      console.log('No path provided, using default avatar');
      return defaultAvatar;
    }
    
    if (path.startsWith('http')) {
      console.log('Using full URL:', path);
      return path;
    }
    
    // Clean up the path and ensure it starts with a forward slash
    const cleanPath = path.replace(/^\/+/, '').replace(/\/+/g, '/');
    const url = `${API_URL}/${cleanPath}`;
    
    console.log('API_URL:', API_URL);
    console.log('Clean path:', cleanPath);
    console.log('Final URL:', url);
    
    return url;
  };

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
    e.target.onerror = null; // Prevent infinite loop if defaultAvatar also fails
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      onPhotoChange(file);
      // Clear the input value to allow uploading the same file again
      e.target.value = '';
    } catch (error) {
      toast.error('Failed to process the selected file');
    }
  };

  return (
    <div className="profile-header bg-white rounded shadow-sm p-4 mb-4">
      <div className="profile-photo-container">
        <div className="profile-photo">
          <img 
            src={getProfilePictureUrl(formData.profilePicture)} 
            alt="Profile" 
            className="profile-image"
            onError={handleImageError}
          />
          
          <div className="photo-overlay">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif"
              style={{ display: 'none' }}
            />
            
            <Button
              variant="link"
              className="photo-button btn-link p-2"
              onClick={handlePhotoClick}
              disabled={loading}
            >
              <FaCamera size={20} />
            </Button>

            {formData.profilePicture && (
              <Button
                variant="link"
                className="photo-button delete btn-link p-2"
                onClick={onDeletePhoto}
                disabled={loading}
              >
                <FaTrash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-info ms-4">
        <h2 className="mb-1">{`${formData.firstName} ${formData.lastName}`}</h2>
        <p className="text-muted mb-0">{formData.email}</p>
      </div>

      {loading && (
        <div className="photo-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader; 