import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './shared/contexts/AuthContext';
import { ThemeProvider } from './shared/contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './features/dashboard/components/Sidebar/Layout';
import Dashboard from './features/dashboard/components/Dashboard/Layout';
import Profile from './features/dashboard/components/Dashboard/components/Profile/Layout';
import Settings from './features/dashboard/components/Dashboard/components/Settings/Layout';
import Notifications from './features/notifications/components/Notifications/Layout';
import Rides from './features/rides/components/Rides/Layout';
import Payments from './features/payments/components/Payments/Layout';
import Reservations from './features/reservations/components/Reservations/Layout';
import Login from './features/auth/components/Login/Layout';
import Signup from './features/auth/components/Signup/Layout';
import ForgotPassword from './features/auth/components/ForgotPassword/Layout';
import ResetPassword from './features/auth/components/ResetPassword/Layout';
import PrivateRoute from './features/auth/components/PrivateRoute';

import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <>
                    <Sidebar />
                    <main className="main-content">
                      <div className="dashboard-content">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/notifications" element={<Notifications />} />
                          <Route path="/rides" element={<Rides />} />
                          <Route path="/payments" element={<Payments />} />
                          <Route path="/reservations" element={<Reservations />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                    </main>
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
