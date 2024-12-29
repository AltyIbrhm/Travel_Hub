import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/components/_profile.css';
import Sidebar from '../Sidebar';
import ProfileLayout from './ProfileLayout';
import { SidebarProvider, useSidebar } from '../Sidebar/context/SidebarContext';
import PageLayout from '../../components/Layout/PageLayout';
import { useProfileForm } from './hooks/useProfileForm';

const ProfileContainer = () => {
  const { isCollapsed } = useSidebar();
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    handleDeletePhoto
  } = useProfileForm();

  return (
    <PageLayout>
      <div className={`profile-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <ProfileLayout 
          formData={formData}
          loading={loading}
          error={error}
          onPhotoChange={handlePhotoChange}
          onDeletePhoto={handleDeletePhoto}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </PageLayout>
  );
};

const Profile = () => {
  return (
    <div className="layout-wrapper">
      <SidebarProvider>
        <Sidebar />
        <ProfileContainer />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SidebarProvider>
    </div>
  );
};

export default Profile; 