import React from 'react';
import Sidebar from '../Sidebar';
import ProfileLayout from './ProfileLayout';
import { SidebarProvider } from '../Sidebar/context/SidebarContext';
import PageLayout from '../../components/Layout/PageLayout';

const ProfileContainer = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSave = (formData) => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
  };

  return (
    <PageLayout>
      <ProfileLayout user={user} onSave={handleSave} />
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