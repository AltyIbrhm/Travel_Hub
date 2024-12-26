import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaKey, FaBell, FaDatabase } from 'react-icons/fa';
import './styles.css';

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Security Settings</h5>
            </Card.Header>
            <Card.Body>
              <p>Account security settings will go here.</p>
            </Card.Body>
          </Card>
        );
      case 'notifications':
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Notification Preferences</h5>
            </Card.Header>
            <Card.Body>
              <p>Notification settings will go here.</p>
            </Card.Body>
          </Card>
        );
      case 'data':
        return (
          <Card>
            <Card.Header>
              <h5 className="mb-0">Data Management</h5>
            </Card.Header>
            <Card.Body>
              <p>Data management options will go here.</p>
            </Card.Body>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <Row>
        <Col md={3}>
          <Card className="settings-nav">
            <Card.Body>
              <div className="settings-nav-items">
                <button
                  type="button"
                  className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <FaKey className="settings-nav-icon" size={16} />
                  Security
                </button>
                <button
                  type="button"
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <FaBell className="settings-nav-icon" size={16} />
                  Notifications
                </button>
                <button
                  type="button"
                  className={`settings-nav-item ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  <FaDatabase className="settings-nav-icon" size={16} />
                  Data
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          {renderContent()}
        </Col>
      </Row>
    </div>
  );
};

export default SettingsLayout; 