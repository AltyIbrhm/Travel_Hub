import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import './styles.css';

const ForgotPasswordLayout = ({ email, error, success, isLoading, handleEmailChange, handleSubmit }) => {
  return (
    <div className="forgot-password-container">
      <Card className="forgot-password-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="forgot-password-title">Forgot Password?</h2>
            <p className="forgot-password-subtitle">Enter your email to reset your password</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="forgot-password-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Link...' : 'Reset Password'}
            </Button>

            <div className="forgot-password-login-text">
              Remember your password?{' '}
              <Link to="/login" className="forgot-password-login-link">
                Back to Login
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPasswordLayout; 