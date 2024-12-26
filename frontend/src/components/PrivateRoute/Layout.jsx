import React from 'react';
import { Navigate } from 'react-router-dom';
import './styles.css';

const PrivateRouteLayout = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <div className="private-route-container">{children}</div>;
};

export default PrivateRouteLayout; 