import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles.css';

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
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5}>
          <Card className="shadow-sm signup-card">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="signup-title">Create Account</h2>
                <p className="signup-subtitle">Join us today and start your journey</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="signup-name-group">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="signup-form-label">
                        First Name
                        <span className="signup-required">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="signup-form-control"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="signup-form-label">
                        Last Name
                        <span className="signup-required">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="signup-form-control"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="signup-form-group">
                  <Form.Label className="signup-form-label">
                    Email Address
                    <span className="signup-required">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`signup-form-control ${emailError ? 'is-invalid' : ''}`}
                  />
                  {emailError && (
                    <div className="invalid-feedback">
                      {emailError}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="signup-form-group">
                  <Form.Label className="signup-form-label">
                    Phone Number
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g., (555) 123-4567"
                    className="signup-form-control"
                  />
                </Form.Group>

                <Form.Group className="signup-form-group">
                  <Form.Label className="signup-form-label">
                    Password
                    <span className="signup-required">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                  {renderPasswordStrength()}
                </Form.Group>

                <Form.Group className="signup-form-group">
                  <Form.Label className="signup-form-label">
                    Confirm Password
                    <span className="signup-required">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="signup-form-control"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading || !Object.values(passwordChecks).every(Boolean)}
                  className="signup-submit-btn"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </Form>

              <p className="signup-login-text">
                Already have an account?{' '}
                <Link to="/login" className="signup-login-link">
                  Sign In
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupLayout; 