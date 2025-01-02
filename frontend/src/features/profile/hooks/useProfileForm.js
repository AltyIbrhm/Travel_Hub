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
      console.log('Updating form data with profile:', profile);
      setFormData(prevData => ({
        ...prevData,
        firstName: profile.name?.first || '',
        lastName: profile.name?.last || '',
        email: profile.contact?.email || '',
        phoneNumber: profile.contact?.phone || '',
        dateOfBirth: profile.dateOfBirth && 
                    profile.dateOfBirth !== '1970-01-01' ? 
                    formatDateForUI(profile.dateOfBirth) : '',
        language: profile.preferences?.language || 'English',
        address: profile.address || '',
        profilePicture: profile.profilePicture || null,
        ...(profile.emergencyContact && {
          emergencyName: profile.emergencyContact.contact?.name || '',
          emergencyPhone: profile.emergencyContact.contact?.phone || '',
          emergencyRelationship: profile.emergencyContact.contact?.relationship || ''
        })
      }));
    }
  }, [profile, loading]);

  // Validate phone number format
  const isValidPhone = (phone) => {
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  };

  // Validate date format
  const isValidDate = (date) => {
    // Allow empty date
    if (!date || date.trim() === '') {
      return true;
    }
    // Accept both MM/DD/YYYY and YYYY-MM-DD formats
    const mmddyyyyRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    const yyyymmddRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return mmddyyyyRegex.test(date) || yyyymmddRegex.test(date);
  };

  // Convert date to backend format (YYYY-MM-DD)
  const formatDateForBackend = (date) => {
    if (!date) return '';
    
    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return `${year}-${month}-${day}`;
    }

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  // Convert date to UI format (DD/MM/YYYY)
  const formatDateForUI = (date) => {
    if (!date || date === '1970-01-01' || date === '0000-00-00') {
      return '';
    }

    // If in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      // Don't format if it's the epoch date
      if (year === '1970' && month === '01' && day === '01') {
        return '';
      }
      return `${day}/${month}/${year}`;
    }

    // If already in DD/MM/YYYY format, return as is
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/');
      // Don't format if it's the epoch date
      if (year === '1970' && month === '01' && day === '01') {
        return '';
      }
      return date;
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // For emergency contact fields, only update when the field loses focus
    if (name.startsWith('emergency')) {
      return; // Don't auto-save emergency contact fields
    }

    // Debounce other field updates
    saveTimeoutRef.current = setTimeout(async () => {
      const updatedData = { ...formData, [name]: value };
      await handleSubmit(updatedData);
      await refreshProfile(); // Refresh profile context after update
    }, 1000);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Only handle emergency contact fields on blur
    if (name.startsWith('emergency')) {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      
      // If less than 30 seconds have passed, show a message
      if (timeSinceLastUpdate < 30000) {
        const remainingTime = Math.ceil((30000 - timeSinceLastUpdate) / 1000);
        toast.info(`Please wait ${remainingTime} seconds before updating emergency contact`);
        return;
      }

      const updatedData = { ...formData };
      handleEmergencyContactUpdate(updatedData);
    }
  };

  // Cleanup timeout on unmount
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
      
      // Upload the new photo directly - the backend will handle old file cleanup
      const response = await profileService.uploadProfilePhoto(file);
      
      if (response.status === 'success' && response.profile) {
        console.log('Photo upload response:', response);
        
        // Update form data with the new profile picture path
        setFormData(prev => ({
          ...prev,
          profilePicture: response.profile.profilePicture
        }));
        
        // Refresh profile context immediately
        await refreshProfile();
        
        // Force a re-render of components using the profile picture
        const event = new CustomEvent('profilePictureUpdated', { 
          detail: { profilePicture: response.profile.profilePicture } 
        });
        window.dispatchEvent(event);
        
        toast.success('Profile photo updated successfully');
      } else {
        console.error('Failed to update profile photo:', response);
        toast.error('Failed to update profile photo');
      }
    } catch (error) {
      console.error('Error in handlePhotoChange:', error);
      toast.error(error.message || 'Failed to upload profile photo');
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setIsSaving(true);
      
      // Only attempt to delete if there is a profile picture
      if (formData.profilePicture) {
        const response = await profileService.deleteProfilePhoto();
        
        if (response.status === 'success') {
          console.log('Photo delete response:', response);
          
          // Immediately clear the profile picture from form data
          setFormData(prev => ({
            ...prev,
            profilePicture: null
          }));
          
          // Force immediate UI update
          const event = new CustomEvent('profilePictureUpdated', { 
            detail: { profilePicture: null } 
          });
          window.dispatchEvent(event);
          
          // Refresh profile context to ensure all components are updated
          await refreshProfile();
          
          // Force a re-render of the profile picture components
          window.dispatchEvent(new Event('profileUpdated'));
          
          toast.success('Profile photo deleted successfully');
        } else {
          console.error('Failed to delete profile photo:', response);
          toast.error('Failed to delete profile photo');
        }
      } else {
        toast.info('No profile photo to delete');
      }
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      toast.error(error.message || 'Failed to delete profile photo');
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Add validation function
  const validateForm = (data) => {
    const errors = {};

    // Required fields
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }

    // Optional fields with format validation
    if (data.phoneNumber && !isValidPhone(data.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number (XXX) XXX-XXXX';
    }

    if (data.dateOfBirth && !isValidDate(data.dateOfBirth)) {
      errors.dateOfBirth = 'Please enter a valid date (DD/MM/YYYY)';
    }

    return errors;
  };

  const handleSubmit = async (data) => {
    // If data is an event, prevent default and use formData
    if (data && data.preventDefault) {
      data.preventDefault();
      data = formData;
    }
    
    setError(null);

    // Validate form
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      // Show first error in the error state
      setError(Object.values(validationErrors)[0]);
      // Show all errors as toasts
      Object.values(validationErrors).forEach(error => {
        toast.error(error);
      });
      return;
    }

    try {
      setIsSaving(true);

      // Update profile
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
        // Update the form data with the formatted date from the response
        setFormData(prev => ({
          ...prev,
          ...profileResponse,
          dateOfBirth: profileResponse.dateOfBirth ? formatDateForUI(profileResponse.dateOfBirth) : ''
        }));
        await refreshProfile(); // Add this to update the context immediately
        toast.success('Profile updated successfully');
      }

      // Update emergency contact if needed
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
      // Check if we're already loading
      if (isSaving) {
        return;
      }

      setIsSaving(true);
      setError(null);

      // Get the values from the form data
      const name = data.emergencyName?.trim() || '';
      const phone = data.emergencyPhone?.trim() || '';
      const relationship = data.emergencyRelationship?.trim() || '';

      // Only proceed if we have at least one non-empty value
      if (!name && !phone && !relationship) {
        return;
      }

      // Structure the data to match backend expectations
      const emergencyContactData = {
        contact: {
          name,
          phone,
          relationship
        }
      };

      const response = await profileService.updateEmergencyContact(emergencyContactData);
      
      if (response && response.contact) {
        // Update last update time
        lastUpdateTimeRef.current = Date.now();
        
        // Update local state with the response data
        setFormData(prev => ({
          ...prev,
          emergencyName: response.contact.name || '',
          emergencyPhone: response.contact.phone || '',
          emergencyRelationship: response.contact.relationship || ''
        }));
        toast.success('Emergency contact updated successfully');
      }
    } catch (error) {
      console.error('Emergency contact update error:', error);
      
      // Handle rate limiting error specifically
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