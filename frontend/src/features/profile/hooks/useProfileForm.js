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
            dateOfBirth: '',
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
              dateOfBirth: response.profile.dateOfBirth || '',
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
          dateOfBirth: data.profile.dateOfBirth || '',
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
    return /^\d{4}-\d{2}-\d{2}$/.test(date) || /^\d{2}\/\d{2}\/\d{4}$/.test(date);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // For phone and date fields, only save if they're complete and valid
    if (name === 'phoneNumber' && !isValidPhone(value)) {
      return; // Don't save incomplete phone numbers
    }

    if (name === 'dateOfBirth' && !isValidDate(value)) {
      return; // Don't save incomplete dates
    }

    // Debounce the save for 1 second after typing stops
    saveTimeoutRef.current = setTimeout(() => {
      handleSubmit({ ...formData, [name]: value });
    }, 1000);
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

  const handleSubmit = async (data) => {
    // If data is an event, prevent default and use formData
    if (data && data.preventDefault) {
      data.preventDefault();
      data = formData;
    }
    
    setError(null);

    // Validate required fields
    if (data.phoneNumber && !isValidPhone(data.phoneNumber)) {
      setError('Please enter a complete phone number');
      return;
    }

    if (data.dateOfBirth && !isValidDate(data.dateOfBirth)) {
      setError('Please enter a valid date');
      return;
    }

    try {
      setLoading(true);
      toast.info('Saving changes...'); // Show saving notification

      // Upload photo if selected
      if (photoFile) {
        await handlePhotoUpload();
      }

      // Update profile
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        language: data.language,
        address: data.address
      };
      
      console.log('Sending profile update:', profileData);
      const profileResponse = await profileService.updateProfile(profileData);
      console.log('Profile update response:', profileResponse);

      if (profileResponse) {
        toast.success('Profile updated successfully');
      }

      // Update emergency contact if needed
      if (data.emergencyName || data.emergencyPhone || data.emergencyRelationship) {
        const emergencyData = {
          emergencyName: data.emergencyName,
          emergencyPhone: data.emergencyPhone,
          emergencyRelationship: data.emergencyRelationship
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

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    handleDeletePhoto,
    handlePhotoUpload
  };
};

export default useProfileForm; 