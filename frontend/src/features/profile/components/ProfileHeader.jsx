import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FaCamera, FaTrash } from 'react-icons/fa';

// Default avatar as base64 string
const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWU1ZWIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxNyIgZmlsbD0iI2IwYjZjMiIvPjxwYXRoIGQ9Ik0yMyw4NiBDMjMsNjggNDAsNTggNTAsNTggQzYwLDU4IDc3LDY4IDc3LDg2IiBmaWxsPSIjYjBiNmMyIi8+PC9zdmc+';

export const ProfileHeader = ({ 
  formData, 
  loading, 
  onPhotoChange, 
  onDeletePhoto 
}) => {
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  return (
    <div className="profile-header bg-white rounded shadow-sm p-4 mb-4">
      <div className="profile-photo-container">
        <div className="profile-photo">
          <img 
            src={formData.profilePicture || defaultAvatar} 
            alt="Profile" 
            className="profile-image"
          />
          
          <div className="photo-overlay">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            
            <Button
              variant="link"
              className="photo-button btn-link p-2"
              onClick={handlePhotoClick}
              disabled={loading}
            >
              <FaCamera size={20} />
            </Button>

            {formData.profilePicture && (
              <Button
                variant="link"
                className="photo-button delete btn-link p-2"
                onClick={onDeletePhoto}
                disabled={loading}
              >
                <FaTrash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="profile-info ms-4">
        <h2 className="mb-1">{`${formData.firstName} ${formData.lastName}`}</h2>
        <p className="text-muted mb-0">{formData.email}</p>
      </div>

      {loading && (
        <div className="photo-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader; 