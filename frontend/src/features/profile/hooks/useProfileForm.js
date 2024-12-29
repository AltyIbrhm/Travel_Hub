import { useState } from 'react';

export const useProfileForm = (user, onSave) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'Passenger',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    emergencyContact: user?.emergencyContact || '',
    emergencyPhone: user?.emergencyPhone || '',
    language: user?.language || 'English'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};

export default useProfileForm; 