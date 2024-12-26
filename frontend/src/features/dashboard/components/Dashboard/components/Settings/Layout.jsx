import React, { useState } from 'react';
import { Card, Form, Button, Nav } from 'react-bootstrap';
import { useAuth } from '../../../../../../shared/hooks/useAuth';
import { toast } from 'react-toastify';
import './styles.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('security');
  const [formData, setFormData] = useState({
    // Security fields
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    securityNotifications: true,
    loginAlerts: true,
    // Notification preferences
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    rideUpdates: true,
    promotionalEmails: false,
    weeklyNewsletters: true,
    tripSummaries: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'security') {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        // Add password update logic here
        toast.success('Security settings updated successfully!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else if (activeTab === 'notifications') {
        // Add notification settings update logic here
        toast.success('Notification preferences updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const renderSecurityTab = () => (
    <Form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Password Settings</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Update Password
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Two-Factor Authentication</h6>
        </Card.Header>
        <Card.Body>
          <Form.Check
            type="switch"
            id="two-factor-toggle"
            name="twoFactorEnabled"
            label="Enable Two-Factor Authentication"
            checked={formData.twoFactorEnabled}
            onChange={handleChange}
          />
          <small className="text-muted d-block mt-2">
            Enhance your account security by requiring both your password and a verification code when signing in.
          </small>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h6 className="mb-0">Security Notifications</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="security-notifications"
              name="securityNotifications"
              label="Security Alerts"
              checked={formData.securityNotifications}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Receive notifications about suspicious activity and security updates.
            </small>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              id="login-alerts"
              name="loginAlerts"
              label="Login Alerts"
              checked={formData.loginAlerts}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Get notified when someone logs into your account from a new device or browser.
            </small>
          </Form.Group>
        </Card.Body>
      </Card>
    </Form>
  );

  const renderNotificationsTab = () => (
    <Form onSubmit={handleSubmit}>
      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Communication Channels</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="email-notifications"
              name="emailNotifications"
              label="Email Notifications"
              checked={formData.emailNotifications}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Receive notifications via email
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="sms-notifications"
              name="smsNotifications"
              label="SMS Notifications"
              checked={formData.smsNotifications}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Get important updates via text message
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="push-notifications"
              name="pushNotifications"
              label="Push Notifications"
              checked={formData.pushNotifications}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Receive notifications on your device
            </small>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>
          <h6 className="mb-0">Ride Updates</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="ride-updates"
              name="rideUpdates"
              label="Ride Status Updates"
              checked={formData.rideUpdates}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Get notified about your ride status, driver location, and arrival
            </small>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              id="trip-summaries"
              name="tripSummaries"
              label="Trip Summaries"
              checked={formData.tripSummaries}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Receive a summary after each completed trip
            </small>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h6 className="mb-0">Marketing Communications</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="promotional-emails"
              name="promotionalEmails"
              label="Promotional Emails"
              checked={formData.promotionalEmails}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Receive special offers and promotions
            </small>
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              id="weekly-newsletters"
              name="weeklyNewsletters"
              label="Weekly Newsletters"
              checked={formData.weeklyNewsletters}
              onChange={handleChange}
            />
            <small className="text-muted d-block mt-1">
              Stay updated with weekly news and updates
            </small>
          </Form.Group>
        </Card.Body>
      </Card>

      <Button type="submit" variant="primary" className="w-100 mt-4">
        Save Notification Preferences
      </Button>
    </Form>
  );

  return (
    <Card className="profile-card">
      <Card.Header>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link onClick={() => setActiveTab('security')} active={activeTab === 'security'}>
              Security
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={() => setActiveTab('notifications')} active={activeTab === 'notifications'}>
              Notifications
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        {activeTab === 'security' && (
          <h5 className="mb-4">Security Settings</h5>
        )}
        {activeTab === 'notifications' && (
          <h5 className="mb-4">Notification Preferences</h5>
        )}
        {activeTab === 'security' ? renderSecurityTab() : renderNotificationsTab()}
      </Card.Body>
    </Card>
  );
};

export default Settings; 