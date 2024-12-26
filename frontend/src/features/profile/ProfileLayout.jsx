import React from 'react';
import { Container, Row, Col, Form, Button, Alert, ProgressBar } from 'react-bootstrap';

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
    <Container className="py-4">
      <button 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i>
        Back to Dashboard
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Profile Settings</h2>
          {!isEditing && (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <i className="bi bi-pencil me-2"></i>
              Edit Profile
            </Button>
          )}
        </div>
        
        {message.text && (
          <Alert variant={message.type === 'error' ? 'danger' : 'success'} className="mb-4">
            <i className={`bi ${message.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
            {message.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="text-center">
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
              
              {isEditing && (
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
                    disabled={isLoading}
                    className="me-2"
                  >
                    <i className="bi bi-camera me-2"></i>
                    Change Photo
                  </Button>
                  {previewImage && (
                    <Button
                      variant="outline-danger"
                      onClick={handleDeletePicture}
                      disabled={isLoading || isDeletingPhoto}
                    >
                      <i className="bi bi-trash me-2"></i>
                      {isDeletingPhoto ? 'Deleting...' : 'Delete Photo'}
                    </Button>
                  )}
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <ProgressBar now={uploadProgress} className="mt-2" />
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-title">
              <i className="bi bi-person"></i>
              Personal Information
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
          </div>

          <div className="form-section">
            <div className="section-title">
              <i className="bi bi-envelope"></i>
              Contact Information
            </div>
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
                placeholder={!isEditing ? 'No phone number added' : 'Enter your phone number'}
              />
            </Form.Group>
          </div>

          <div className="form-section">
            <div className="section-title">
              <i className="bi bi-geo-alt"></i>
              Address Information
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                rows={3}
                placeholder={!isEditing ? 'No address added' : 'Enter your address'}
              />
            </Form.Group>
          </div>

          {isEditing && (
            <div className="action-buttons">
              <Button
                variant="outline-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                <i className="bi bi-check-lg me-2"></i>
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </Form>
      </div>
    </Container>
  );
};

export default ProfileLayout; 