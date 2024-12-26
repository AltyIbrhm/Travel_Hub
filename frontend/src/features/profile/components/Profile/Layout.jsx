import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './styles.css';

const ProfileLayout = ({
  user,
  formData,
  isEditing,
  error,
  success,
  isLoading,
  fileInputRef,
  uploadProgress,
  imageKey,
  isDeletingPhoto,
  navigate,
  handleChange,
  handleSubmit,
  handleFileChange,
  handleDeleteProfilePicture,
  setIsEditing
}) => {
  return (
    <div className="page-container">
      <div className="main-content">
        <Container>
          <div className="mb-4">
            <Button variant="outline-primary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Profile</h4>
                  <Button 
                    variant={isEditing ? "outline-secondary" : "primary"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLoading}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <div className="text-center mb-4">
                    <div 
                      className="position-relative d-inline-block"
                      style={{ cursor: 'pointer' }}
                      onClick={() => !isDeletingPhoto && fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      
                      {user?.profilePicture ? (
                        <div className="profile-picture-container">
                          <img
                            src={`http://localhost:5000${user.profilePicture}?${imageKey}`}
                            alt="Profile"
                            className="profile-picture"
                          />
                          <div className="profile-picture-overlay">
                            <i className="bi bi-camera-fill"></i>
                            <span>Change Photo</span>
                          </div>
                          <button
                            type="button"
                            className="delete-photo-button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isDeletingPhoto) {
                                handleDeleteProfilePicture();
                              }
                            }}
                            disabled={isDeletingPhoto}
                            title="Delete photo"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="profile-picture-placeholder">
                          <i className="bi bi-person-fill"></i>
                          <div className="mt-2">Add Photo</div>
                        </div>
                      )}

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="upload-progress">
                          {uploadProgress}%
                        </div>
                      )}
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
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

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </Form.Group>

                    {isEditing && (
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ProfileLayout; 