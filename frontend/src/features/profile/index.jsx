import React from 'react';
import Sidebar from '../Sidebar';
import ProfileLayout from './ProfileLayout';
import { SidebarProvider, useSidebar } from '../Sidebar/context/SidebarContext';
import PageLayout from '../../components/Layout/PageLayout';

const ProfileContainer = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { isCollapsed } = useSidebar();

  const handleSave = (formData) => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
  };

  return (
    <PageLayout>
      <div className={`profile-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <ProfileLayout user={user} onSave={handleSave} />
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
      </SidebarProvider>
    </div>
  );
};

export default Profile; 