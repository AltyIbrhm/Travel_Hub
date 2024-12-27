import React from 'react';
import Sidebar from '../Sidebar';
import ProfileLayout from './ProfileLayout';
import { SidebarProvider } from '../Sidebar/context/SidebarContext';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleSave = (formData) => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
  };

  return (
    <div style={{ display: 'flex' }}>
      <SidebarProvider>
        <Sidebar />
        <ProfileLayout user={user} onSave={handleSave} />
      </SidebarProvider>
    </div>
  );
};

export default Profile; 