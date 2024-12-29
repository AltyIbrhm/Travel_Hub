import React from 'react';
import { Form, Button } from 'react-bootstrap';

export const ProfileForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <div className="profile-form-row">
        <Form.Group className="profile-form-group">
          <label className="profile-label">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="profile-input"
          />
        </Form.Group>

        <Form.Group className="profile-form-group">
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

      <div className="profile-form-row">
        <Form.Group className="profile-form-group">
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

        <Form.Group className="profile-form-group">
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

      <div className="profile-form-row">
        <Form.Group className="profile-form-group">
          <label className="profile-label">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="profile-input"
          />
        </Form.Group>

        <Form.Group className="profile-form-group">
          <label className="profile-label">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="profile-input"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </Form.Group>
      </div>

      <Form.Group className="profile-form-group">
        <label className="profile-label">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="profile-input"
          placeholder="Enter your address"
        />
      </Form.Group>

      <Button type="submit" className="profile-save-btn">
        Save Changes
      </Button>
    </Form>
  );
};

export default ProfileForm; 