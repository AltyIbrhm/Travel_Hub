import React from 'react';
import { Container, Row, Col, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import ThemeToggle from '../../components/ThemeToggle';
import './profile.css';

const ProfileLayout = ({
  formData,
  previewImage,
  message,
  isLoading,
  isEditing,
  setIsEditing,
  navigate,
  handleDeletePicture,
  handleSubmit,
  handleFileChange,
  handleChange,
  fileInputRef,
  uploadProgress,
  imageKey,
  isDeletingPhoto
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
        <h2 className="text-center mb-4">Profile Settings</h2>
        
        {message.text && (
          <Alert variant={message.type === 'error' ? 'danger' : 'success'} className="mb-4">
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <div className="profile-picture-container">
              {previewImage ? (
                <img
                  src={`${previewImage}?key=${imageKey}`}
                  alt="Profile"
                  className="profile-picture mb-3"
                />
              ) : (
                <div className="profile-picture-placeholder mb-3">
                  {formData.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              <div className="profile-picture-actions">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-primary"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading || !isEditing}
                  className="me-2"
                >
                  Change Photo
                </Button>
                {previewImage && (
                  <Button
                    variant="outline-danger"
                    onClick={handleDeletePicture}
                    disabled={isLoading || isDeletingPhoto || !isEditing}
                  >
                    {isDeletingPhoto ? 'Deleting...' : 'Delete Photo'}
                  </Button>
                )}
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar now={uploadProgress} className="mt-2" />
              )}
            </div>
          </div>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  required
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
                  disabled={!isEditing || isLoading}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing || isLoading}
              rows={3}
            />
          </Form.Group>

          <div className="d-flex justify-content-center gap-3">
            {!isEditing ? (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default ProfileLayout; 