import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileService from '../../services/profileService';
import UserProfileLayout from './Layout';

const UserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      }
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsLoading(true);
      await profileService.deleteProfilePicture();
      setFormData(prev => ({ ...prev, profilePicture: null }));
      setPreviewImage('');
      setMessage({ text: 'Profile picture deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message || 'Failed to delete profile picture', type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await profileService.updateProfile(formDataToSend);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      loadProfile();
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <UserProfileLayout
      formData={formData}
      previewImage={previewImage}
      message={message}
      isLoading={isLoading}
      navigate={navigate}
      handleDeletePicture={handleDeletePicture}
      handleSubmit={handleSubmit}
      handleFileChange={handleFileChange}
      handleChange={handleChange}
    />
  );
};

export default UserProfile; 