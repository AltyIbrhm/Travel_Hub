import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Dropdown, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/hooks/useAuth';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { toast } from 'react-toastify';
import Profile from './components/Profile/Layout';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Upcoming Ride',
      message: 'Your ride to Shopping Mall is scheduled for tomorrow',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 2,
      title: 'Ride Completed',
      message: 'Your ride to Downtown Hotel has been completed',
      time: '2 days ago',
      unread: false
    }
  ]);

  // Initialize map
  useEffect(() => {
    // Import Leaflet dynamically
    const initMap = async () => {
      if (!mapRef.current) return;
      
      try {
        // Clean up existing map instance
        if (mapInstance) {
          mapInstance.remove();
          setMapInstance(null);
        }

        // Import Leaflet dynamically
        const L = await import('leaflet');
        
        // Create map instance
        const map = L.map(mapRef.current, {
          center: [51.505, -0.09],
          zoom: 13,
          zoomControl: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add markers for example
        const marker = L.marker([51.505, -0.09]).addTo(map);
        marker.bindPopup("<b>Hello!</b><br>I am a popup.").openPopup();

        setMapInstance(map);

        // Force a map resize after a short delay
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, unread: false }
        : notification
    ));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="dashboard-container">
      <Container fluid>
        {/* Header with Profile and Notifications */}
        <Row className="header-row mb-4">
          <Col className="d-flex justify-content-between align-items-center">
            <h1 className="dashboard-title">Welcome back, {user?.firstName || 'User'}!</h1>
            <div className="d-flex align-items-center">
              <Dropdown className="me-3">
                <Dropdown.Toggle variant="light" id="notification-dropdown" className="notification-toggle">
                  <i className="bi bi-bell"></i>
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="notification-badge">{notifications.filter(n => n.unread).length}</span>
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="notification-menu">
                  <div className="notification-header">
                    <h6 className="mb-0">Notifications</h6>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <small>{notifications.filter(n => n.unread).length} unread</small>
                    )}
                  </div>
                  {notifications.map(notification => (
                    <Dropdown.Item 
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="notification-content">
                        <h6 className="notification-title">{notification.title}</h6>
                        <p className="notification-message">{notification.message}</p>
                        <small className="notification-time">{notification.time}</small>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button 
                variant="outline-primary"
                className="profile-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <Image
                  src={user?.profilePicture || 'https://via.placeholder.com/40'}
                  roundedCircle
                  className="profile-button-image"
                  alt="Profile"
                />
                <span className="ms-2">{user?.firstName || 'User'}</span>
              </Button>
            </div>
          </Col>
        </Row>

        {/* Profile Modal */}
        {showProfile && (
          <Row className="mb-4">
            <Col>
              <Profile onClose={() => setShowProfile(false)} />
            </Col>
          </Row>
        )}

        {/* Stats Row */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="icon-wrapper bg-primary">
                  <i className="bi bi-car-front"></i>
                </div>
                <h6 className="stats-title">Total Rides</h6>
                <h3 className="stats-value">24</h3>
                <div className="stats-change positive">
                  <i className="bi bi-arrow-up"></i>
                  <span>12% from last month</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="icon-wrapper bg-success">
                  <i className="bi bi-cash"></i>
                </div>
                <h6 className="stats-title">Total Spent</h6>
                <h3 className="stats-value">$1,248</h3>
                <div className="stats-change positive">
                  <i className="bi bi-arrow-up"></i>
                  <span>8% from last month</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="icon-wrapper bg-info">
                  <i className="bi bi-star"></i>
                </div>
                <h6 className="stats-title">Average Rating</h6>
                <h3 className="stats-value">4.8</h3>
                <div className="stats-change positive">
                  <i className="bi bi-arrow-up"></i>
                  <span>0.2 from last month</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card">
              <Card.Body>
                <div className="icon-wrapper bg-warning">
                  <i className="bi bi-clock-history"></i>
                </div>
                <h6 className="stats-title">Upcoming Rides</h6>
                <h3 className="stats-value">3</h3>
                <div className="stats-change negative">
                  <i className="bi bi-arrow-down"></i>
                  <span>2 less than last month</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Booking Section */}
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Book Your Ride</h5>
              </Card.Header>
              <Card.Body>
                <div className="map-container">
                  <div className="map-helper-text">
                    <i className="bi bi-info-circle"></i>
                    Click on map to set pickup and destination locations
                  </div>
                  <div ref={mapRef} id="map" style={{ height: '400px', width: '100%' }}></div>
                </div>
                <Form className="mt-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-geo-alt"></i>
                          Pickup Location
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter pickup location"
                          name="pickupLocation"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-geo-alt-fill"></i>
                          Destination
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter destination"
                          name="destination"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-car-front"></i>
                          Vehicle Type
                        </Form.Label>
                        <Form.Select name="vehicleType">
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="van">Van</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <i className="bi bi-briefcase"></i>
                          Number of Luggage
                        </Form.Label>
                        <Form.Select name="luggage">
                          <option value="0">No luggage</option>
                          <option value="1">1 piece</option>
                          <option value="2">2 pieces</option>
                          <option value="3">3 pieces</option>
                          <option value="4">4+ pieces</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" className="w-100">
                    Book Now
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="cost-breakdown-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Cost Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div className="cost-breakdown-item">
                  <span>Base Fare</span>
                  <span>$25.00</span>
                </div>
                <div className="cost-breakdown-item">
                  <span>Distance (2.5 miles)</span>
                  <span>$6.25</span>
                </div>
                <div className="cost-breakdown-item">
                  <span>Airport Fee</span>
                  <span>$15.00</span>
                </div>
                <div className="cost-breakdown-item">
                  <span>Luggage (2 pieces)</span>
                  <span>$20.00</span>
                </div>
                <hr />
                <div className="cost-breakdown-item">
                  <strong>Total</strong>
                  <strong>$66.25</strong>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Bookings</h5>
              </Card.Header>
              <Card.Body>
                <div className="recent-booking-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-success">Completed</span>
                    <small className="text-muted">2 days ago</small>
                  </div>
                  <p className="mb-1">Airport → Downtown Hotel</p>
                  <small className="text-muted">$45.00 • Sedan • 2 luggage</small>
                </div>
                <hr />
                <div className="recent-booking-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-warning">Upcoming</span>
                    <small className="text-muted">Tomorrow</small>
                  </div>
                  <p className="mb-1">Hotel → Shopping Mall</p>
                  <small className="text-muted">$35.00 • SUV • No luggage</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard; 