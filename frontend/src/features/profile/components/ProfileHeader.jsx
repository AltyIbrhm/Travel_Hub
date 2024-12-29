import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';

export const ProfileHeader = ({ user, formData }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar-wrapper">
        <img
          src={user?.profilePicture || 'https://via.placeholder.com/120'}
          alt="Profile"
          className="profile-avatar"
        />
        <button className="profile-avatar-upload">
          <FaCamera />
        </button>
      </div>
      <div className="profile-info">
        <h1 className="profile-name">{`${formData.firstName} ${formData.lastName}`}</h1>
        <div className="profile-role">
          <span className="profile-status"></span>
          {formData.role}
        </div>
        <div className="profile-badges">
          <Badge bg="success">Verified User</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 