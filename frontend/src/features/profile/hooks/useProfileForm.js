import { useState, useEffect, useRef } from 'react';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';
import { useProfile } from '../context/ProfileContext';

export const useProfileForm = () => {
  const { profile, loading, refreshProfile } = useProfile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    language: 'English',
    address: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    profilePicture: null
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const saveTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  
  // Load profile data
  useEffect(() => {
    if (!loading && profile) {
      // Create the form data with all fields
      const newFormData = {
        firstName: profile.name?.first || '',
        lastName: profile.name?.last || '',
        email: profile.contact?.email || '',
        phoneNumber: profile.contact?.phone || '',
        dateOfBirth: formatDateForUI(profile.dateOfBirth),
        language: profile.preferences?.language || 'English',
        address: profile.address || '',
        profilePicture: profile.profilePicture || null,
        // Set emergency contact fields
        emergencyName: profile.emergencyName || '',
        emergencyPhone: profile.emergencyPhone || '',
        emergencyRelationship: profile.emergencyRelationship || ''
      };

      setFormData(newFormData);
    }
  }, [profile, loading]);

  const isValidPhone = (phone) => {
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  };

  const isValidDate = (date) => {
    if (!date || date.trim() === '') {
      return true;
    }
    const mmddyyyyRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    const yyyymmddRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return mmddyyyyRegex.test(date) || yyyymmddRegex.test(date);
  };

  const formatDateForBackend = (date) => {
    if (!date) return null;
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatDateForUI = (date) => {
    if (!date) return '';
    
    try {
      // Handle ISO date string
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      
      // Check if it's the default date
      if (d.getFullYear() === 1970 && d.getMonth() === 0 && d.getDate() === 1) {
        return '';
      }
      
      const day = String(d.getUTCDate()).padStart(2, '0');
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const year = d.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Update local form state immediately
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Don't auto-save for emergency contact fields
    if (name.startsWith('emergency')) {
      return;
    }

    // Debounce the save operation
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const currentFormData = { ...formData, [name]: value };
        
        const profileData = {
          firstName: currentFormData.firstName,
          lastName: currentFormData.lastName,
          email: currentFormData.email,
          phoneNumber: currentFormData.phoneNumber || '',
          dateOfBirth: formatDateForBackend(currentFormData.dateOfBirth),
          language: currentFormData.language || 'English',
          address: currentFormData.address || ''
        };

        const profileResponse = await profileService.updateProfile(profileData);
        
        if (profileResponse) {
          await refreshProfile();
          toast.success('Profile updated successfully');
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        toast.error(error.message || 'Failed to update profile');
      }
    }, 1000);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    if (name.startsWith('emergency')) {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      
      if (timeSinceLastUpdate < 30000) {
        const remainingTime = Math.ceil((30000 - timeSinceLastUpdate) / 1000);
        toast.info(`Please wait ${remainingTime} seconds before updating emergency contact`);
        return;
      }

      const updatedData = { ...formData };
      handleEmergencyContactUpdate(updatedData);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handlePhotoChange = async (file) => {
    try {
      setIsSaving(true);
      const response = await profileService.uploadProfilePhoto(file);
      
      if (response.status === 'success' && response.profile) {
        setFormData(prev => ({
          ...prev,
          profilePicture: response.profile.profilePicture
        }));
        
        await refreshProfile();
        
        const event = new CustomEvent('profilePictureUpdated', { 
          detail: { profilePicture: response.profile.profilePicture } 
        });
        window.dispatchEvent(event);
        
        toast.success('Profile photo updated successfully');
      } else {
        toast.error('Failed to update profile photo');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to upload profile photo');
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setIsSaving(true);
      
      if (formData.profilePicture) {
        const response = await profileService.deleteProfilePhoto();
        
        if (response.status === 'success') {
          setFormData(prev => ({
            ...prev,
            profilePicture: null
          }));
          
          await refreshProfile();
          
          const event = new CustomEvent('profilePictureUpdated', { 
            detail: { profilePicture: null } 
          });
          window.dispatchEvent(event);
          
          toast.success('Profile photo deleted successfully');
        } else {
          toast.error('Failed to delete profile photo');
        }
      } else {
        toast.info('No profile photo to delete');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete profile photo');
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (data.phoneNumber && !isValidPhone(data.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number (XXX) XXX-XXXX';
    }

    if (data.dateOfBirth && !isValidDate(data.dateOfBirth)) {
      errors.dateOfBirth = 'Please enter a valid date (DD/MM/YYYY)';
    }

    return errors;
  };

  const handleSubmit = async (data) => {
    if (data && data.preventDefault) {
      data.preventDefault();
      data = formData;
    }
    
    setError(null);

    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      Object.values(validationErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    try {
      setIsSaving(true);

      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber || '',
        dateOfBirth: data.dateOfBirth ? formatDateForBackend(data.dateOfBirth) : null,
        language: data.language || 'English',
        address: data.address || ''
      };
      
      const profileResponse = await profileService.updateProfile(profileData);
      
      if (profileResponse) {
        setFormData(prev => ({
          ...prev,
          ...profileResponse,
          dateOfBirth: profileResponse.dateOfBirth ? formatDateForUI(profileResponse.dateOfBirth) : ''
        }));
        await refreshProfile();
        toast.success('Profile updated successfully');
      }

      if (data.emergencyName || data.emergencyPhone || data.emergencyRelationship) {
        const emergencyData = {
          emergencyName: data.emergencyName || '',
          emergencyPhone: data.emergencyPhone || '',
          emergencyRelationship: data.emergencyRelationship || ''
        };
        await profileService.updateEmergencyContact(emergencyData);
      }

    } catch (error) {
      setError(error.message || 'Failed to update profile');
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmergencyContactUpdate = async (data) => {
    try {
      if (isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      const name = data.emergencyName?.trim() || '';
      const phone = data.emergencyPhone?.trim() || '';
      const relationship = data.emergencyRelationship?.trim() || '';

      if (!name && !phone && !relationship) {
        return;
      }

      const emergencyContactData = {
        emergencyName: name,
        emergencyPhone: phone,
        emergencyRelationship: relationship
      };

      const response = await profileService.updateEmergencyContact(emergencyContactData);
      
      if (response) {
        lastUpdateTimeRef.current = Date.now();
        
        // Update form data with the response
        setFormData(prev => ({
          ...prev,
          emergencyName: name,
          emergencyPhone: phone,
          emergencyRelationship: relationship
        }));

        // Refresh profile to ensure we have the latest data
        await refreshProfile();
        
        toast.success('Emergency contact updated successfully');
      }
    } catch (error) {
      if (error.response?.status === 429) {
        const message = 'Too many updates. Please wait 30 minutes before trying again.';
        setError(message);
        toast.error(message);
      } else {
        setError(error.message || 'Failed to update emergency contact');
        toast.error(error.message || 'Failed to update emergency contact');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    loading,
    isSaving,
    error,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    handleDeletePhoto,
    handleBlur
  };
};

export default useProfileForm; 