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
  handleSubmit
}) => {
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
                  disabled={isLoading}
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