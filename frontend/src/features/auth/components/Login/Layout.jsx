import React, { useState } from 'react';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye as EyeIcon, FaEyeSlash as EyeSlashIcon } from 'react-icons/fa';

const LoginLayout = ({
  email,
  password,
  error,
  isLoading,
  handleEmailChange,
  handlePasswordChange,
  handleSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">Please sign in to continue</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="auth-form">
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                  type="button"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </Button>
              </InputGroup>
              <div className="d-flex justify-content-end mt-2">
                <Link to="/forgot-password" className="auth-link">
                  Forgot Password?
                </Link>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="auth-links">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginLayout; 