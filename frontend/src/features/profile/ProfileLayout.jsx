import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';

const ProfileLayout = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'Passenger'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const stats = [
    { label: 'Total Rides', value: '28' },
    { label: 'Completed', value: '25' },
    { label: 'Cancelled', value: '3' },
    { label: 'Rating', value: '4.8' }
  ];

  return (
    <div className="profile-container">
      {/* Profile Header */}
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
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Details */}
        <div className="profile-section">
          <h2 className="profile-section-title">Personal Information</h2>
          <Form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <Form.Group>
                <label className="profile-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="profile-input"
                />
              </Form.Group>
            </div>

            <div className="profile-form-group">
              <Form.Group>
                <label className="profile-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="profile-input"
                />
              </Form.Group>
            </div>

            <div className="profile-form-group">
              <Form.Group>
                <label className="profile-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  disabled
                />
              </Form.Group>
            </div>

            <div className="profile-form-group">
              <Form.Group>
                <label className="profile-label">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="e.g., (555) 123-4567"
                />
              </Form.Group>
            </div>

            <Button type="submit" className="profile-save-btn">
              Save Changes
            </Button>
          </Form>
        </div>

        {/* Profile Stats */}
        <div className="profile-section">
          <h2 className="profile-section-title">Statistics</h2>
          <div className="profile-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout; 