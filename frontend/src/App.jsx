import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './features/dashboard';
import Profile from './features/profile';
import BookRide from './features/book-ride';
import Login from './features/auth/components/Login';
import Signup from './features/auth/components/Signup';
import ForgotPassword from './features/auth/components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import './styles/main.css';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/book-ride"
        element={
          <PrivateRoute>
            <BookRide />
          </PrivateRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
