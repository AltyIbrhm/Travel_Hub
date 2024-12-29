import React, { useEffect, useState, useRef } from 'react';
import { Form, Toast } from 'react-bootstrap';
import { FaUser, FaPhone, FaUserFriends, FaCheck } from 'react-icons/fa';

export const EmergencyContactForm = ({ formData, onChange, onSubmit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const initialFormData = useRef(formData);
  const [hasChanges, setHasChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const lastSaveAttemptRef = useRef(0);

  // Check for actual changes in form data
  useEffect(() => {
    const hasFormChanged = Object.keys(formData).some(
      key => formData[key] !== initialFormData.current[key]
    );
    setHasChanges(hasFormChanged);
  }, [formData]);

  // Auto-save when form data changes
  useEffect(() => {
    if (!hasChanges || isSaving) return;

    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Check if we should save based on rate limiting
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveAttemptRef.current;
    const MIN_SAVE_INTERVAL = 5000; // 5 seconds between saves

    if (timeSinceLastSave < MIN_SAVE_INTERVAL) {
      saveTimeoutRef.current = setTimeout(() => {
        setHasChanges(true); // Trigger another save attempt
      }, MIN_SAVE_INTERVAL - timeSinceLastSave);
      return;
    }

    setIsSaving(true);
    lastSaveAttemptRef.current = now;

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
      } catch (error) {
        if (error.message?.includes('Too many emergency contact updates')) {
          // Don't show error toast for rate limiting
          console.warn('Rate limited, will retry later');
        }
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasChanges, formData, onSubmit, isSaving]);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length === 0) {
      value = '';
    } else if (value.length <= 3) {
      value = `(${value}`;
    } else if (value.length <= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value,
          name: 'emergencyPhone'
        }
      });
    }
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

      <Form className="emergency-contact-form">
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
                onChange={onChange}
                className="profile-input"
                placeholder="Enter emergency contact name"
                required
              />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaPhone className="field-icon" />
                Contact Phone
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
              <small className="field-help">Format: (555) 123-4567</small>
            </Form.Group>
          </div>

          <Form.Group className="profile-form-group">
            <label className="profile-label">
              <FaUserFriends className="field-icon" />
              Relationship
            </label>
            <select
              name="emergencyRelationship"
              value={formData.emergencyRelationship}
              onChange={onChange}
              className="profile-input"
              required
            >
              <option value="">Select relationship</option>
              <option value="Parent">Parent</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Child">Child</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </Form.Group>
        </div>
      </Form>
    </>
  );
};

export default EmergencyContactForm; 