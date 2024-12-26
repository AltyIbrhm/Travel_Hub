import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileLayout from './Layout';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        'http://localhost:5000/api/auth/profile/update',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || '',
          address: formData.address || ''
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...currentUser,
        ...response.data.user,
        profilePicture: currentUser.profilePicture
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('storage'));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.response?.status === 401) {
        setError('Please login again to update your profile');
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      setIsDeletingPhoto(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:5000/api/auth/profile/delete-photo',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser({ ...updatedUser, _timestamp: Date.now() });
      setImageKey(Date.now());
      window.dispatchEvent(new Event('storage'));
      setSuccess('Profile picture deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile picture');
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      setUploadProgress(0);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile/upload-photo',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser({ ...updatedUser, _timestamp: Date.now() });
      setImageKey(Date.now());
      window.dispatchEvent(new Event('storage'));
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <ProfileLayout
      user={user}
      formData={formData}
      isEditing={isEditing}
      error={error}
      success={success}
      isLoading={isLoading}
      fileInputRef={fileInputRef}
      uploadProgress={uploadProgress}
      imageKey={imageKey}
      isDeletingPhoto={isDeletingPhoto}
      navigate={navigate}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleFileChange={handleFileChange}
      handleDeleteProfilePicture={handleDeleteProfilePicture}
      setIsEditing={setIsEditing}
    />
  );
};

export default Profile; 