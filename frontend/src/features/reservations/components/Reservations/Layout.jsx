import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Tabs, Tab } from 'react-bootstrap';
import './styles.css';

const Reservations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const upcomingReservations = [
    {
      id: 1,
      from: 'Hotel Grand',
      to: 'Airport Terminal 1',
      date: '2024-01-15',
      time: '09:30 AM',
      status: 'confirmed',
      price: 45.00,
      vehicle: 'Sedan',
      driver: {
        name: 'John Smith',
        rating: 4.8,
        photo: 'https://via.placeholder.com/40'
      }
    },
    {
      id: 2,
      from: 'Shopping Mall',
      to: 'Beach Resort',
      date: '2024-01-18',
      time: '02:00 PM',
      status: 'pending',
      price: 35.00,
      vehicle: 'SUV',
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        photo: 'https://via.placeholder.com/40'
      }
    }
  ];

  const pastReservations = [
    {
      id: 3,
      from: 'Airport Terminal 2',
      to: 'Downtown Hotel',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'completed',
      price: 55.00,
      vehicle: 'Sedan',
      rating: 5,
      driver: {
        name: 'Mike Wilson',
        rating: 4.7,
        photo: 'https://via.placeholder.com/40'
      }
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: 'success',
      pending: 'warning',
      completed: 'info',
      cancelled: 'danger'
    };
    return <Badge bg={statusStyles[status]}>{status}</Badge>;
  };

  const renderReservationCard = (reservation) => (
    <Card key={reservation.id} className="reservation-card mb-3">
      <Card.Body>
        <Row>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="mb-1">Trip #{reservation.id}</h6>
                <div className="text-muted small">
                  {reservation.date} • {reservation.time}
                </div>
              </div>
              {getStatusBadge(reservation.status)}
            </div>
            
            <div className="trip-route mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-circle text-success"></i>
                <div className="ms-3">{reservation.from}</div>
              </div>
              <div className="route-line"></div>
              <div className="d-flex align-items-center">
                <i className="bi bi-circle text-danger"></i>
                <div className="ms-3">{reservation.to}</div>
              </div>
            </div>

            <div className="trip-details">
              <span className="me-3">
                <i className="bi bi-car-front me-2"></i>
                {reservation.vehicle}
              </span>
              <span>
                <i className="bi bi-cash me-2"></i>
                ${reservation.price.toFixed(2)}
              </span>
            </div>
          </Col>
          
          <Col md={4} className="border-start">
            <div className="driver-info">
              <div className="d-flex align-items-center mb-2">
                <img 
                  src={reservation.driver.photo} 
                  alt={reservation.driver.name}
                  className="driver-photo me-2"
                />
                <div>
                  <div className="driver-name">{reservation.driver.name}</div>
                  <div className="driver-rating">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    {reservation.driver.rating}
                  </div>
                </div>
              </div>
              
              {reservation.status === 'confirmed' && (
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-chat-dots me-2"></i>
                    Contact Driver
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel Ride
                  </Button>
                </div>
              )}
              
              {reservation.status === 'completed' && !reservation.rating && (
                <Button variant="primary" size="sm" className="w-100">
                  <i className="bi bi-star me-2"></i>
                  Rate Trip
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="reservations-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">My Reservations</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="search"
            placeholder="Search reservations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="upcoming" title="Upcoming Reservations">
          {upcomingReservations.map(renderReservationCard)}
        </Tab>
        <Tab eventKey="past" title="Past Reservations">
          {pastReservations.map(renderReservationCard)}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Reservations; 