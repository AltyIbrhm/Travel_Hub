import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setFormData({
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        address: data.address || '',
        profilePicture: data.profilePicture || null
      });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      }
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsLoading(true);
      await profileService.deleteProfilePicture();
      setFormData(prev => ({ ...prev, profilePicture: null }));
      setPreviewImage('');
      setMessage({ text: 'Profile picture deleted successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: error.message || 'Failed to delete profile picture', type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await profileService.updateProfile(formDataToSend);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
      loadProfile(); // Reload profile after update
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-3"
      >
        ← Go Back
      </Button>

      <div className="bg-white p-4 rounded shadow">
        {message.text && (
          <Alert variant={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}

        <div className="text-center mb-4">
          <div 
            className="mx-auto mb-3"
            style={{ 
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {(previewImage || formData.profilePicture) ? (
              <img
                src={previewImage || formData.profilePicture}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div className="text-secondary">Profile</div>
            )}
          </div>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outline-primary"
              as="label"
              htmlFor="profilePicture"
              style={{ cursor: 'pointer' }}
            >
              Change Picture
            </Button>
            {(formData.profilePicture || previewImage) && (
              <Button
                variant="outline-danger"
                onClick={handleDeletePicture}
                disabled={isLoading}
              >
                Delete Picture
              </Button>
            )}
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="d-none"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              disabled
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          <Button 
            type="submit" 
            variant="primary"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default UserProfile;
