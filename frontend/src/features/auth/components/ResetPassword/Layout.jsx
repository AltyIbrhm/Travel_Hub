import React, { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon } from 'react-icons/fa';

const ResetPasswordLayout = ({
  token,
  password,
  confirmPassword,
  error,
  success,
  isLoading,
  handlePasswordChange,
  handleConfirmPasswordChange,
  handleSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  if (!token) {
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <Card.Body>
            <div className="text-center mb-4">
              <h2 className="auth-title">Invalid Reset Link</h2>
              <p className="auth-subtitle">This password reset link is invalid or has expired.</p>
            </div>
            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                Request a new reset link
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Enter your new password below</p>
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
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('password')}
                  type="button"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="password-requirements mb-3">
              <p className="requirement-title">Password must contain:</p>
              <ul>
                <li className={passwordRequirements.length ? 'met' : ''}>
                  At least 8 characters
                </li>
                <li className={passwordRequirements.uppercase ? 'met' : ''}>
                  At least one uppercase letter
                </li>
                <li className={passwordRequirements.lowercase ? 'met' : ''}>
                  At least one lowercase letter
                </li>
                <li className={passwordRequirements.number ? 'met' : ''}>
                  At least one number
                </li>
                <li className={passwordRequirements.special ? 'met' : ''}>
                  At least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            <Form.Group className="form-group">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your new password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('confirm')}
                  type="button"
                >
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPasswordLayout; 