import React from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import ThemeToggle from '../../../../components/ThemeToggle';
import './styles.css';

const UserProfileLayout = ({
  formData,
  previewImage,
  message,
  isLoading,
  navigate,
  handleDeletePicture,
  handleSubmit,
  handleFileChange,
  handleChange
}) => {
  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-3"
      >
        ← Go Back
      </Button>
      <div className="float-end mb-3">
        <ThemeToggle />
      </div>

      <div className="profile-card">
        {message.text && (
          <Alert variant={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}

        <div className="text-center mb-4">
          <div className="profile-image-container">
            {(previewImage || formData.profilePicture) ? (
              <img
                src={previewImage || formData.profilePicture}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">Profile</div>
            )}
          </div>
          <div className="profile-image-actions">
            <Button
              variant="outline-primary"
              as="label"
              htmlFor="profilePicture"
              className="profile-image-button"
            >
              Change Picture
            </Button>
            {(formData.profilePicture || previewImage) && (
              <Button
                variant="outline-danger"
                onClick={handleDeletePicture}
                disabled={isLoading}
                className="profile-image-button"
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

export default UserProfileLayout; 