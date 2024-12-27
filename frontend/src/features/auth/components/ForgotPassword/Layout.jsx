import React from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ForgotPasswordLayout = ({ email, error, success, isLoading, handleEmailChange, handleSubmit }) => {
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="auth-title">Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email to reset your password</p>
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

          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="form-group">
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
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Reset Link...' : 'Reset Password'}
            </Button>

            <div className="auth-links">
              Remember your password?{' '}
              <Link to="/login" className="auth-link">
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