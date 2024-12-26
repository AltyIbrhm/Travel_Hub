import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import NavbarLayout from './Layout';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [imageKey] = useState(Date.now());

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <NavbarLayout
      user={user}
      onLogout={handleLogout}
      imageKey={imageKey}
    />
  );
};

export default NavigationBar; 