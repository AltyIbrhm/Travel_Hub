import React, { useState } from 'react';
import axios from 'axios';
import ForgotPasswordLayout from './Layout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccess('Please check your email for password reset instructions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordLayout
      email={email}
      error={error}
      success={success}
      isLoading={isLoading}
      handleEmailChange={handleEmailChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default ForgotPassword; 