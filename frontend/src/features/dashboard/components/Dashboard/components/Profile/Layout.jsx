import React, { useState } from 'react';
import { Card, Form, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../../../../../shared/hooks/useAuth';
import { toast } from 'react-toastify';
import './styles.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Card className="profile-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Profile Information</h5>
        <Button 
          variant={isEditing ? "secondary" : "primary"} 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="text-center mb-4">
          <Image
            src={user?.profilePicture || 'https://via.placeholder.com/150'}
            roundedCircle
            className="profile-picture"
            alt="Profile"
          />
          {isEditing && (
            <div className="mt-2">
              <Form.Control
                type="text"
                name="profilePicture"
                placeholder="Profile Picture URL"
                value={formData.profilePicture}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          {isEditing && (
            <Button type="submit" variant="success" className="w-100">
              Save Changes
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Profile; 