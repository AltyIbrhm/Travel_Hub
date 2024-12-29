import React, { useEffect, useState } from 'react';
import { Form, Toast } from 'react-bootstrap';
import { FaUser, FaPhone, FaUserFriends, FaCheck } from 'react-icons/fa';

export const EmergencyContactForm = ({ formData, handleChange, handleSubmit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Auto-save when form data changes
  useEffect(() => {
    setIsSaving(true);
    const saveTimeout = setTimeout(() => {
      const mockEvent = {
        preventDefault: () => {},
        target: { value: formData }
      };
      handleSubmit(mockEvent);
      setIsSaving(false);
      setShowSaveToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => setShowSaveToast(false), 3000);
    }, 1000);

    return () => {
      clearTimeout(saveTimeout);
      setIsSaving(false);
    };
  }, [formData, handleSubmit]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Handle backspace and deletion
    if (value.length < formData.emergencyPhone?.length) {
      handleChange({
        ...e,
        target: {
          ...e.target,
          value,
          name: 'emergencyPhone'
        }
      });
      return;
    }

    // Remove all non-digits
    value = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) value = value.slice(0, 10);
    
    // Format the number
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }

    handleChange({
      ...e,
      target: {
        ...e.target,
        value,
        name: 'emergencyPhone'
      }
    });
  };

  return (
    <>
      <div className="autosave-toast-container">
        <Toast 
          show={showSaveToast} 
          onClose={() => setShowSaveToast(false)}
          className="autosave-toast"
        >
          <Toast.Body>
            <FaCheck className="toast-icon" /> Changes saved successfully
          </Toast.Body>
        </Toast>
      </div>

      <Form className="profile-form" onSubmit={handleFormSubmit}>
        <div className="profile-section">
          <h3 className="section-title">
            <FaUserFriends className="section-icon" />
            Emergency Contact Information
          </h3>
          
          <div className="profile-form-row">
            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaUser className="field-icon" />
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                className="profile-input"
                placeholder="Enter emergency contact name"
                required
              />
              <small className="field-help">Full name of your emergency contact</small>
            </Form.Group>

            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaPhone className="field-icon" />
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handlePhoneChange}
                className="profile-input"
                placeholder="(555) 123-4567"
                maxLength="14"
                required
              />
              <small className="field-help">Phone number where they can be reached</small>
            </Form.Group>
          </div>

          <div className="profile-form-row">
            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaUserFriends className="field-icon" />
                Relationship
              </label>
              <select
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={handleChange}
                className="profile-input"
                required
              >
                <option value="">Select relationship</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
              <small className="field-help">Your relationship with the emergency contact</small>
            </Form.Group>
          </div>
        </div>
        {isSaving && (
          <div className="autosave-indicator">
            <span className="saving-spinner"></span>
            Saving changes...
          </div>
        )}
      </Form>
    </>
  );
};

export default EmergencyContactForm; 