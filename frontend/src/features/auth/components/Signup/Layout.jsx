import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SignupLayout = ({
  formData,
  error,
  success,
  isLoading,
  handleChange,
  handleSubmit,
  passwordStrength,
  emailError
}) => {
  // Password requirements check
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*]/.test(formData.password),
  };

  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    return (
      <div className="password-requirements">
        <div className={`requirement ${passwordChecks.length ? 'met' : ''}`}>
          ✓ At least 8 characters
        </div>
        <div className={`requirement ${passwordChecks.uppercase ? 'met' : ''}`}>
          ✓ One uppercase letter
        </div>
        <div className={`requirement ${passwordChecks.lowercase ? 'met' : ''}`}>
          ✓ One lowercase letter
        </div>
        <div className={`requirement ${passwordChecks.number ? 'met' : ''}`}>
          ✓ One number
        </div>
        <div className={`requirement ${passwordChecks.special ? 'met' : ''}`}>
          ✓ One special character (!@#$%^&*)
        </div>
      </div>
    );
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join us today and start your journey</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} className="auth-form">
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    First Name
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Last Name
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group">
              <Form.Label>
                Email Address
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={emailError ? 'is-invalid' : ''}
              />
              {emailError && (
                <div className="invalid-feedback">
                  {emailError}
                </div>
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                Phone Number
              </Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g., (555) 123-4567"
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                Password
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {renderPasswordStrength()}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                Confirm Password
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={isLoading || !Object.values(passwordChecks).every(Boolean)}
              className="auth-button"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <div className="auth-links">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignupLayout; 