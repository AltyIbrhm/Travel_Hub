import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../Sidebar/Sidebar';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import L from 'leaflet';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './dashboard.styles.css';
import authService from '../../../../features/auth/services/authService';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DashboardContent = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [user, setUser] = useState(null);
  const { isCollapsed } = useSidebar();
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    destination: '',
    vehicleType: 'sedan',
    luggage: '0'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        authService.logout();
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    let map = null;
    
    const initMap = () => {
      if (!mapRef.current || map) return;

      try {
        map = L.map(mapRef.current, {
          center: [51.505, -0.09],
          zoom: 13,
          zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker([51.505, -0.09]).addTo(map);
        marker.bindPopup("<b>Available Vehicle</b><br>Sedan - 5 mins away").openPopup();

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          
          if (!bookingData.pickupLocation) {
            setBookingData(prev => ({
              ...prev,
              pickupLocation: locationString
            }));
            L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'pickup-marker',
                html: '<i class="bi bi-geo-alt text-primary"></i>',
                iconSize: [25, 25]
              })
            }).addTo(map).bindPopup('Pickup Location');
          } else if (!bookingData.destination) {
            setBookingData(prev => ({
              ...prev,
              destination: locationString
            }));
            L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'destination-marker',
                html: '<i class="bi bi-geo-alt-fill text-danger"></i>',
                iconSize: [25, 25]
              })
            }).addTo(map).bindPopup('Destination');
          }
        });

        setMapInstance(map);

        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Failed to load map');
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  // Effect to handle map resize when sidebar state changes
  useEffect(() => {
    if (mapInstance) {
      const timer = setTimeout(() => {
        mapInstance.invalidateSize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCollapsed, mapInstance]);

  // If no user data, don't render the dashboard
  if (!user) {
    return null;
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    toast.success('Booking request submitted!');
  };

  const stats = [
    {
      title: 'Total Rides',
      value: '24',
      icon: 'bi-car-front',
      change: '+12%',
      positive: true
    },
    {
      title: 'Distance',
      value: '436 km',
      icon: 'bi-map',
      change: '+8%',
      positive: true
    },
    {
      title: 'Saved',
      value: '$128',
      icon: 'bi-piggy-bank',
      change: '+15%',
      positive: true
    },
    {
      title: 'CO₂ Reduced',
      value: '86 kg',
      icon: 'bi-tree',
      change: '+18%',
      positive: true
    }
  ];

  const recentBookings = [
    {
      id: 1,
      destination: 'Airport',
      date: '2024-01-20',
      status: 'Upcoming',
      amount: '$45'
    },
    {
      id: 2,
      destination: 'Shopping Mall',
      date: '2024-01-18',
      status: 'Completed',
      amount: '$25'
    }
  ];

  return (
    <div className={`dashboard-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <main className={`dashboard-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Container fluid>
          {/* Header Section */}
          <Row className="align-items-center mb-3">
            <Col>
              <h1 className="dashboard-title h4 mb-0">Welcome back, {user?.firstName}!</h1>
            </Col>
          </Row>

          {/* Stats Section */}
          <Row className="g-2 mb-3">
            {stats.map((stat, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card className="stats-card border-0 shadow-sm">
                  <Card.Body className="p-2">
                    <div className="d-flex align-items-center">
                      <div className="icon-wrapper d-flex align-items-center justify-content-center me-2">
                        <i className={`bi ${stat.icon}`}></i>
                      </div>
                      <div>
                        <h6 className="text-muted text-uppercase small mb-1">{stat.title}</h6>
                        <h3 className="fw-bold mb-1">{stat.value}</h3>
                        <span className={`stats-change ${stat.positive ? 'positive' : 'negative'} small`}>
                          <i className={`bi bi-arrow-${stat.positive ? 'up' : 'down'}`}></i>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Map and Booking Section */}
          <Row className="g-3">
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-3">
                  <h5 className="fw-bold mb-3">Book Your Ride</h5>
                  <div className="map-container rounded">
                    <div className="map-helper-text">
                      <i className="bi bi-info-circle me-2"></i>
                      Click on map to set pickup and destination locations
                    </div>
                    <div ref={mapRef} style={{ height: '100%' }}></div>
                  </div>
                  <Form className="mt-4" onSubmit={handleBookingSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="bi bi-geo-alt me-2"></i>
                            Pickup Location
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter pickup location"
                            name="pickupLocation"
                            value={bookingData.pickupLocation}
                            onChange={handleBookingChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            Destination
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter destination"
                            name="destination"
                            value={bookingData.destination}
                            onChange={handleBookingChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="bi bi-car-front me-2"></i>
                            Vehicle Type
                          </Form.Label>
                          <Form.Select 
                            name="vehicleType"
                            value={bookingData.vehicleType}
                            onChange={handleBookingChange}
                          >
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="van">Van</option>
                            <option value="luxury">Luxury</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <i className="bi bi-briefcase me-2"></i>
                            Number of Luggage
                          </Form.Label>
                          <Form.Select
                            name="luggage"
                            value={bookingData.luggage}
                            onChange={handleBookingChange}
                          >
                            <option value="0">No luggage</option>
                            <option value="1">1 piece</option>
                            <option value="2">2 pieces</option>
                            <option value="3">3 pieces</option>
                            <option value="4">4+ pieces</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="w-100">
                      Book Now
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
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
                    <span>Service Fee</span>
                    <span>$2.00</span>
                  </div>
                  <div className="cost-breakdown-item">
                    <span>Luggage ({bookingData.luggage} pieces)</span>
                    <span>${Number(bookingData.luggage) * 5}.00</span>
                  </div>
                  <hr />
                  <div className="cost-breakdown-item total">
                    <strong>Total Estimated Cost</strong>
                    <strong>${33.25 + (Number(bookingData.luggage) * 5)}</strong>
                  </div>
                </Card.Body>
              </Card>

              {/* Recent Bookings Card */}
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Recent Bookings</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="recent-booking-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{booking.destination}</h6>
                          <small className="text-muted">{booking.date}</small>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${booking.status === 'Upcoming' ? 'bg-primary' : 'bg-success'}`}>
                            {booking.status}
                          </span>
                          <div className="mt-1">{booking.amount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard; 