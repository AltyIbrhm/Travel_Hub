import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import './styles.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Upcoming Ride Reminder',
      message: 'Your ride to Shopping Mall is scheduled for tomorrow at 2:00 PM',
      type: 'reminder',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 2,
      title: 'Driver Assigned',
      message: 'Sarah Johnson has been assigned as your driver for tomorrow\'s ride',
      type: 'info',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'Rate Your Trip',
      message: 'Please rate your recent trip with Mike Wilson',
      type: 'action',
      time: '2 days ago',
      unread: false
    },
    {
      id: 4,
      title: 'Special Offer',
      message: 'Get 20% off on your next airport transfer!',
      type: 'promotion',
      time: '3 days ago',
      unread: false
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    const icons = {
      reminder: 'bi-clock',
      info: 'bi-info-circle',
      action: 'bi-exclamation-circle',
      promotion: 'bi-gift',
      payment: 'bi-credit-card'
    };
    return icons[type] || 'bi-bell';
  };

  const getNotificationColor = (type) => {
    const colors = {
      reminder: 'warning',
      info: 'info',
      action: 'primary',
      promotion: 'success',
      payment: 'danger'
    };
    return colors[type] || 'secondary';
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.type === filter;
  });

  return (
    <Container fluid className="notifications-container">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1 className="page-title">Notifications</h1>
          <Button 
            variant="outline-primary"
            onClick={markAllAsRead}
            disabled={!notifications.some(n => n.unread)}
          >
            Mark all as read
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="notification-filter"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="reminder">Reminders</option>
            <option value="info">Information</option>
            <option value="action">Actions Required</option>
            <option value="promotion">Promotions</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredNotifications.map(notification => (
            <Card 
              key={notification.id} 
              className={`notification-card mb-3 ${notification.unread ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <Card.Body className="d-flex align-items-start">
                <div className={`notification-icon bg-${getNotificationColor(notification.type)}`}>
                  <i className={`bi ${getNotificationIcon(notification.type)}`}></i>
                </div>
                <div className="notification-content">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="notification-title mb-1">{notification.title}</h6>
                      <p className="notification-message mb-1">{notification.message}</p>
                      <small className="notification-time">{notification.time}</small>
                    </div>
                    {notification.unread && (
                      <Badge bg="primary" className="unread-badge">New</Badge>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-bell-slash display-4 text-muted"></i>
              <p className="mt-3 text-muted">No notifications found</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications; 