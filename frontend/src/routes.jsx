import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/components/Login/Layout';
import Register from './features/auth/components/Register/Layout';
import Dashboard from './features/dashboard/components/Dashboard/Layout';
import PrivateRoute from './features/auth/components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 