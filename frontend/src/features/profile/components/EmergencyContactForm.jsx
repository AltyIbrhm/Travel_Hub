import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FaUser, FaPhone, FaUserFriends } from 'react-icons/fa';
import { profileService } from '../services/profileService';
import { toast } from 'react-toastify';

export const EmergencyContactForm = ({ formData, onChange }) => {
  const [localFormData, setLocalFormData] = useState({
    emergencyName: formData.emergencyName || '',
    emergencyPhone: formData.emergencyPhone || '',
    emergencyRelationship: formData.emergencyRelationship || ''
  });

  const [loading, setLoading] = useState(false);

  // Update local form data when props change
  useEffect(() => {
    setLocalFormData({
      emergencyName: formData.emergencyName || '',
      emergencyPhone: formData.emergencyPhone || '',
      emergencyRelationship: formData.emergencyRelationship || ''
    });
  }, [formData]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...localFormData,
      [name]: value
    };
    
    setLocalFormData(updatedData);

    if (onChange) {
      onChange({
        target: {
          name,
          value
        }
      });
    }
  };

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

    handleLocalChange({
      target: {
        name: 'emergencyPhone',
        value
      }
    });
  };

  const handleSubmit = async () => {
    if (loading) return;

    // Validate required fields
    if (!localFormData.emergencyName?.trim()) {
      toast.error('Emergency contact name is required');
      return;
    }

    if (!localFormData.emergencyPhone?.trim()) {
      toast.error('Emergency contact phone is required');
      return;
    }

    if (!localFormData.emergencyRelationship) {
      toast.error('Please select a relationship');
      return;
    }

    try {
      setLoading(true);
      
      // Format phone number to remove formatting characters
      const formattedPhone = localFormData.emergencyPhone.replace(/[^0-9]/g, '');
      
      const contactData = {
        emergencyName: localFormData.emergencyName.trim(),
        emergencyPhone: formattedPhone,
        emergencyRelationship: localFormData.emergencyRelationship
      };

      const response = await profileService.updateEmergencyContact(contactData);
      
      if (response) {
        toast.success('Emergency contact updated successfully');
        // Update parent form data if needed
        if (onChange) {
          Object.entries(contactData).forEach(([key, value]) => {
            // If it's the phone number, use the formatted display version
            const displayValue = key === 'emergencyPhone' ? localFormData.emergencyPhone : value;
            onChange({
              target: { name: key, value: displayValue }
            });
          });
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update emergency contact');
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
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
              value={localFormData.emergencyName}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              className="profile-input"
              placeholder="Enter emergency contact name"
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
              value={localFormData.emergencyPhone}
              onChange={handlePhoneChange}
              onBlur={handleBlur}
              className="profile-input"
              placeholder="(555) 123-4567"
              maxLength="14"
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
            value={localFormData.emergencyRelationship}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            className="profile-input"
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
  );
};

export default EmergencyContactForm; 