import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignupLayout from './Layout';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);

  // Password validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Check email availability
  const checkEmailAvailability = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/check-email', { email });
      if (response.data.exists) {
        setEmailError('This email is already registered');
        return false;
      } else {
        setEmailError('');
        return true;
      }
    } catch (err) {
      console.error('Email check failed:', err);
      return true; // Allow form submission if check fails
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear general error when user types
    setError('');

    // Handle email availability check with debounce
    if (name === 'email') {
      // Clear previous timeout
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }

      // Only check if email is valid
      if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        const newTimeout = setTimeout(() => {
          checkEmailAvailability(value.trim().toLowerCase());
        }, 500); // Wait 500ms after user stops typing
        setEmailCheckTimeout(newTimeout);
      } else {
        setEmailError('');
      }
    }
  };

  const validateForm = async () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (emailError) {
      setError(emailError);
      return false;
    }
    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Final email check before submission
    const isEmailAvailable = await checkEmailAvailability(formData.email.trim().toLowerCase());
    if (!isEmailAvailable) {
      setError('This email is already registered');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim()
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });

      // Redirect after a short delay
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.details) {
        setError(Object.values(err.response.data.details).join(', '));
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, [emailCheckTimeout]);

  return (
    <SignupLayout
      formData={formData}
      error={error}
      emailError={emailError}
      success={success}
      isLoading={isLoading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      passwordChecks={passwordChecks}
    />
  );
};

export default Signup; 