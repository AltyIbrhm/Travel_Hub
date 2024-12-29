import React, { useEffect, useState, useRef } from 'react';
import { Form, Toast } from 'react-bootstrap';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBirthdayCake, 
  FaLanguage, 
  FaMapMarkerAlt, 
  FaCheck, 
  FaIdCard
} from 'react-icons/fa';

export const ProfileForm = ({ formData, onChange, onSubmit }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const initialFormData = useRef(formData);
  const [hasChanges, setHasChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  const lastSaveAttemptRef = useRef(0);

  const languages = [
    { value: 'English', label: 'English (US)' },
    { value: 'Spanish', label: 'Español' },
    { value: 'French', label: 'Français' },
    { value: 'German', label: 'Deutsch' },
    { value: 'Italian', label: 'Italiano' },
    { value: 'Portuguese', label: 'Português' },
    { value: 'Russian', label: 'Русский' },
    { value: 'Chinese', label: '中文' },
    { value: 'Japanese', label: '日本語' },
    { value: 'Korean', label: '한국어' }
  ];

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
          name: 'phoneNumber'
        }
      });
    }
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    
    // Handle backspace and deletion
    if (value.length < formData.dateOfBirth.length) {
      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            value,
            name: 'dateOfBirth'
          }
        });
      }
      return;
    }

    // Only process if adding new characters
    value = value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 8) value = value.slice(0, 8);
    
    // Add slashes
    if (value.length >= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value,
          name: 'dateOfBirth'
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

      <Form className="profile-form">
        {/* Personal Information Section */}
        <div className="profile-section">
          <h3 className="section-title">
            <FaIdCard className="section-icon" />
            Personal Information
          </h3>
          <div className="profile-form-row">
            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaUser className="field-icon" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                className="profile-input"
                placeholder="Enter your first name"
                required
              />
            </Form.Group>

            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaUser className="field-icon" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                className="profile-input"
                placeholder="Enter your last name"
                required
              />
            </Form.Group>
          </div>

          <div className="profile-form-row">
            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaEnvelope className="field-icon" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                className="profile-input"
                disabled
                title="Email cannot be changed"
              />
              <small className="field-help">Email address cannot be changed</small>
            </Form.Group>

            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaPhone className="field-icon" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className="profile-input"
                placeholder="(555) 123-4567"
                maxLength="14"
                required
              />
              <small className="field-help">Format: (555) 123-4567</small>
            </Form.Group>
          </div>

          <div className="profile-form-row">
            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaBirthdayCake className="field-icon" />
                Date of Birth
              </label>
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                className="profile-input"
                placeholder="DD/MM/YYYY"
                maxLength="10"
                required
              />
              <small className="field-help">Format: DD/MM/YYYY</small>
            </Form.Group>

            <Form.Group className="profile-form-group">
              <label className="profile-label">
                <FaLanguage className="field-icon" />
                Preferred Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={onChange}
                className="profile-input"
                required
              >
                <option value="">Select a language</option>
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </div>

          <Form.Group className="profile-form-group">
            <label className="profile-label">
              <FaMapMarkerAlt className="field-icon" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
              className="profile-input"
              placeholder="Enter your full address"
            />
            <small className="field-help">Enter your complete address including city and postal code</small>
          </Form.Group>
        </div>
      </Form>

      {isSaving && (
        <div className="autosave-indicator">
          <span className="saving-spinner"></span>
          Saving changes...
        </div>
      )}
    </>
  );
};

export default ProfileForm; 