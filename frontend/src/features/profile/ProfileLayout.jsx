import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileForm } from './components/ProfileForm';
import { EmergencyContactForm } from './components/EmergencyContactForm';
import { ProfileStats } from './components/ProfileStats';
import { RecentActivity } from './components/RecentActivity';
import { useProfileForm } from './hooks/useProfileForm';

export const ProfileLayout = ({ user, onSave }) => {
  const { formData, handleChange, handleSubmit } = useProfileForm(user, onSave);

  return (
    <div className="profile-content">
      <ProfileHeader user={user} formData={formData} />

      <div className="profile-body">
        <Tabs defaultActiveKey="personal" className="profile-tabs">
          <Tab eventKey="personal" title="Personal Information">
            <div className="profile-section">
              <ProfileForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
          </Tab>

          <Tab eventKey="emergency" title="Emergency Contact">
            <div className="profile-section">
              <EmergencyContactForm 
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            </div>
          </Tab>
        </Tabs>

        <ProfileStats />
        <RecentActivity />
      </div>
    </div>
  );
};

export default ProfileLayout; 