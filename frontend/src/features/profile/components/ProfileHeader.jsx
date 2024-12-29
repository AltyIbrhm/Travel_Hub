import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { FaCamera, FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export const ProfileHeader = ({ user, formData }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="profile-header">
      <div className={`profile-avatar-wrapper ${imageLoading ? 'loading' : ''}`}>
        {imageLoading && <div className="profile-avatar-skeleton" />}
        <img
          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&size=130`}
          alt={`${formData.firstName} ${formData.lastName}'s profile`}
          className="profile-avatar"
          onLoad={handleImageLoad}
          style={{ opacity: imageLoading ? 0 : 1 }}
        />
        <button className="profile-avatar-upload" title="Change profile picture">
          <FaCamera />
        </button>
      </div>
      <div className="profile-info">
        <h1 className="profile-name">
          {`${formData.firstName} ${formData.lastName}`}
          <FaCheckCircle className="verify-icon" title="Verified Account" />
        </h1>
        <div className="profile-role">
          <span className="profile-status" title="Online"></span>
          {formData.role}
        </div>
        <div className="profile-meta">
          <div className="profile-location" title="Location">
            <FaMapMarkerAlt />
            <span>{formData.address || 'Location not set'}</span>
          </div>
          <div className="profile-join-date" title="Member since">
            <FaCalendarAlt />
            <span>Joined {joinDate}</span>
          </div>
        </div>
        <div className="profile-badges">
          <Badge bg="success" title="Verified User Account">
            <FaCheckCircle className="badge-icon" /> Verified User
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 