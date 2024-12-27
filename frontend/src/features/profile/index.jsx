import React from 'react';
import Sidebar from '../Sidebar';
import ProfileLayout from './ProfileLayout';
import { SidebarProvider, useSidebar } from '../Sidebar/context/SidebarContext';

const ProfileContainer = () => {
  const { isCollapsed } = useSidebar();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSave = (formData) => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
  };

  return (
    <div className={`profile-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <ProfileLayout user={user} onSave={handleSave} />
    </div>
  );
};

const Profile = () => {
  return (
    <div className="layout-wrapper">
      <SidebarProvider>
        <Sidebar />
        <ProfileContainer />
      </SidebarProvider>
    </div>
  );
};

export default Profile; 