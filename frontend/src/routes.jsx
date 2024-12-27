import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/components/Login/Layout';
import Register from './features/auth/components/Register/Layout';
import PrivateRoute from './features/auth/components/PrivateRoute';
import Sidebar from './features/Sidebar';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Sidebar />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 