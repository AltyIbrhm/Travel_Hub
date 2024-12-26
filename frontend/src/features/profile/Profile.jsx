import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from './services/profileService';
import ProfileLayout from './ProfileLayout';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setFormData({
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        address: data.address || '',
        profilePicture: data.profilePicture || null
      });
      setPreviewImage(data.profilePicture || '');
    } catch (error) {
      setMessage({ text: 'Failed to load profile', type: 'error' });
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsDeletingPhoto(true);
      await profileService.deleteProfilePicture();
      setPreviewImage('');
      setFormData(prev => ({ ...prev, profilePicture: null }));
      setImageKey(Date.now());
      setMessage({ text: 'Profile picture deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to delete profile picture', type: 'error' });
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedProfile = await profileService.updateProfile(formData);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      setUser(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ProfileLayout
      formData={formData}
      previewImage={previewImage}
      message={message}
      isLoading={isLoading}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      navigate={navigate}
      handleDeletePicture={handleDeletePicture}
      handleSubmit={handleSubmit}
      handleFileChange={handleFileChange}
      handleChange={handleChange}
      fileInputRef={fileInputRef}
      uploadProgress={uploadProgress}
      imageKey={imageKey}
      isDeletingPhoto={isDeletingPhoto}
    />
  );
};

export default Profile; 