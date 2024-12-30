import { useState, useEffect, useRef } from 'react';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';

export const useProfileForm = () => {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const saveTimeoutRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      
      // Get user data from localStorage
      const userEmail = localStorage.getItem('userEmail');
      const userFirstName = localStorage.getItem('firstName');
      const userLastName = localStorage.getItem('lastName');
      
      if (!data.profile) {
        try {
          const response = await profileService.updateProfile({
            firstName: userFirstName || '',
            lastName: userLastName || '',
            email: userEmail || '',
            phoneNumber: '',
            dateOfBirth: null,
            language: 'English',
            address: ''
          });
          
          if (response.profile) {
            setFormData(prevData => ({
              ...prevData,
              firstName: response.profile.name.first || userFirstName || '',
              lastName: response.profile.name.last || userLastName || '',
              email: response.profile.contact.email || userEmail || '',
              phoneNumber: response.profile.contact.phone || '',
              dateOfBirth: response.profile.dateOfBirth && 
                          response.profile.dateOfBirth !== '1970-01-01' ? 
                          formatDateForUI(response.profile.dateOfBirth) : '',
              language: response.profile.preferences.language || 'English',
              address: response.profile.address || '',
              profilePicture: response.profile.avatar || null
            }));
          }
        } catch (createError) {
          console.error('Failed to create profile:', createError);
          setError('Failed to create profile');
        }
      } else {
        // If profile exists but has empty values, use localStorage data
        setFormData(prevData => ({
          ...prevData,
          firstName: data.profile.name.first || userFirstName || '',
          lastName: data.profile.name.last || userLastName || '',
          email: data.profile.contact.email || userEmail || '',
          phoneNumber: data.profile.contact.phone || '',
          dateOfBirth: data.profile.dateOfBirth && 
                      data.profile.dateOfBirth !== '1970-01-01' ? 
                      formatDateForUI(data.profile.dateOfBirth) : '',
          language: data.profile.preferences.language || 'English',
          address: data.profile.address || '',
          profilePicture: data.profile.avatar || null,
          ...(data.emergencyContact && {
            emergencyName: data.emergencyContact.contact.name || '',
            emergencyPhone: data.emergencyContact.contact.phone || '',
            emergencyRelationship: data.emergencyContact.contact.relationship || ''
          })
        }));

        // If profile has empty values, update it with user data
        if (!data.profile.name.first && userFirstName) {
          await profileService.updateProfile({
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            phoneNumber: data.profile.contact.phone || '',
            dateOfBirth: data.profile.dateOfBirth || '',
            language: data.profile.preferences.language || 'English',
            address: data.profile.address || ''
          });
        }
      }
    } catch (error) {
      console.error('Profile load error:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

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
    saveTimeoutRef.current = setTimeout(() => {
      const updatedData = { ...formData, [name]: value };
      handleSubmit(updatedData);
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

  const handlePhotoChange = (file) => {
    setPhotoFile(file);
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    try {
      setLoading(true);
      const response = await profileService.uploadProfilePhoto(photoFile);
      setFormData(prev => ({
        ...prev,
        profilePicture: response.profile.avatar
      }));
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to upload profile photo');
      setError(error.message);
    } finally {
      setLoading(false);
      setPhotoFile(null);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setLoading(true);
      await profileService.deleteProfilePhoto();
      setFormData(prev => ({
        ...prev,
        profilePicture: null
      }));
      toast.success('Profile photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete profile photo');
      setError(error.message);
    } finally {
      setLoading(false);
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
      setLoading(true);

      // Upload photo if selected
      if (photoFile) {
        await handlePhotoUpload();
      }

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
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyContactUpdate = async (data) => {
    try {
      // Check if we're already loading
      if (loading) {
        return;
      }

      setLoading(true);
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
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
    handlePhotoChange,
    handleDeletePhoto,
    handlePhotoUpload
  };
};

export default useProfileForm; 