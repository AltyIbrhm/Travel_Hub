import React from 'react';
import { ProfileForm } from '../components/ProfileForm';
import { useProfileForm } from '../hooks/useProfileForm';

const ProfileContainer = () => {
  const {
    formData,
    loading,
    isSaving,
    error,
    handleChange,
    handleSubmit,
    handleBlur
  } = useProfileForm();

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ProfileForm
        formData={formData}
        loading={loading}
        isSaving={isSaving}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default ProfileContainer; 