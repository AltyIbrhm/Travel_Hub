import React from 'react';
import { Form, Button } from 'react-bootstrap';

export const EmergencyContactForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <Form>
      <div className="profile-form-row">
        <Form.Group className="profile-form-group">
          <label className="profile-label">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="profile-input"
          />
        </Form.Group>

        <Form.Group className="profile-form-group">
          <label className="profile-label">Emergency Contact Phone</label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            className="profile-input"
          />
        </Form.Group>
      </div>
      <Button type="submit" className="profile-save-btn" onClick={handleSubmit}>
        Save Changes
      </Button>
    </Form>
  );
};

export default EmergencyContactForm; 