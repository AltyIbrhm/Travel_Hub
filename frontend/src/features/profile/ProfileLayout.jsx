import React from 'react';
import { Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileForm } from './components/ProfileForm';
import { EmergencyContactForm } from './components/EmergencyContactForm';
import { ProfileStats } from './components/ProfileStats';
import { RecentActivity } from './components/RecentActivity';

export const ProfileLayout = ({ 
  formData,
  loading,
  error,
  onPhotoChange,
  onDeletePhoto,
  onChange,
  onSubmit
}) => {
  if (!formData) {
    return (
      <div className="profile-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="profile-content">
      <ProfileHeader 
        formData={formData}
        loading={loading}
        onPhotoChange={onPhotoChange}
        onDeletePhoto={onDeletePhoto}
      />

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="profile-body">
        <Tabs defaultActiveKey="personal" className="profile-tabs">
          <Tab eventKey="personal" title="Personal Information">
            <div className="profile-section">
              <ProfileForm 
                formData={formData}
                loading={loading}
                onChange={onChange}
                onSubmit={onSubmit}
              />
            </div>
          </Tab>
          <Tab eventKey="emergency" title="Emergency Contact">
            <div className="profile-section">
              <EmergencyContactForm 
                formData={formData}
                loading={loading}
                onChange={onChange}
                onSubmit={onSubmit}
              />
            </div>
          </Tab>
          <Tab eventKey="activity" title="Recent Activity">
            <div className="profile-section">
              <div className="profile-stats-container">
                <ProfileStats formData={formData} />
              </div>
              <div className="recent-activity-container">
                <RecentActivity />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileLayout; 