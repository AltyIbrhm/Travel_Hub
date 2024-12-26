import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './styles.css';

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
  const { t } = useTranslation();

  if (!token) {
    return (
      <Container className="reset-password-wrapper">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow reset-password-card">
              <Card.Body>
                <Alert variant="danger" className="reset-password-invalid-token">
                  {t('auth.resetPassword.invalidToken')}
                </Alert>
                <Link to="/forgot-password" className="btn btn-primary w-100">
                  {t('auth.resetPassword.requestNewLink')}
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={5}>
          <Card className="shadow-sm reset-password-card">
            <Card.Body>
              <div className="text-center mb-4">
                <h2 className="reset-password-title">{t('auth.resetPassword.title')}</h2>
                <p className="reset-password-subtitle">{t('auth.resetPassword.subtitle')}</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  {success}
                  <div className="mt-3">
                    <Link to="/login" className="btn btn-primary w-100">
                      {t('auth.resetPassword.backToLogin')}
                    </Link>
                  </div>
                </Alert>
              )}

              {!success && (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="reset-password-form-group">
                    <Form.Label className="reset-password-form-label">
                      {t('auth.resetPassword.newPassword')}
                      <span className="reset-password-required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="reset-password-form-control"
                    />
                  </Form.Group>

                  <Form.Group className="reset-password-form-group">
                    <Form.Label className="reset-password-form-label">
                      {t('auth.resetPassword.confirmPassword')}
                      <span className="reset-password-required">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      className="reset-password-form-control"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="reset-password-submit-btn"
                  >
                    {isLoading ? t('common.loading') : t('auth.resetPassword.resetPassword')}
                  </Button>

                  <Link to="/login" className="reset-password-back-link">
                    {t('auth.resetPassword.backToLogin')}
                  </Link>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordLayout; 