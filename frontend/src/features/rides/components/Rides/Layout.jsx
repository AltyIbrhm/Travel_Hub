import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import './styles.css';

const Rides = () => {
  const [rides, setRides] = useState([
    {
      id: 1,
      from: 'Airport Terminal 2',
      to: 'Downtown Hotel',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'completed',
      price: 55.00,
      distance: '15.5 miles',
      duration: '45 mins',
      vehicle: 'Sedan',
      driver: {
        name: 'Mike Wilson',
        rating: 4.7,
        photo: 'https://via.placeholder.com/40'
      },
      rating: 5,
      review: 'Great service and very professional driver!'
    },
    {
      id: 2,
      from: 'Hotel Grand',
      to: 'Shopping Mall',
      date: '2024-01-12',
      time: '02:30 PM',
      status: 'completed',
      price: 35.00,
      distance: '8.2 miles',
      duration: '25 mins',
      vehicle: 'SUV',
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        photo: 'https://via.placeholder.com/40'
      },
      rating: 4,
      review: 'Very comfortable ride'
    }
  ]);

  const [showRideDetails, setShowRideDetails] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleShowDetails = (ride) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: 'success',
      cancelled: 'danger',
      ongoing: 'warning'
    };
    return <Badge bg={statusStyles[status]}>{status}</Badge>;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      ></i>
    ));
  };

  return (
    <Container fluid className="rides-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">My Rides</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Form.Control
            type="search"
            placeholder="Search rides..."
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
            <option value="all">All Rides</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col>
          {rides.map(ride => (
            <Card key={ride.id} className="ride-card mb-3">
              <Card.Body>
                <Row>
                  <Col md={9}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="mb-1">Ride #{ride.id}</h6>
                        <div className="text-muted small">
                          {ride.date} • {ride.time}
                        </div>
                      </div>
                      {getStatusBadge(ride.status)}
                    </div>

                    <div className="trip-route mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-circle text-success"></i>
                        <div className="ms-3">{ride.from}</div>
                      </div>
                      <div className="route-line"></div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-circle text-danger"></i>
                        <div className="ms-3">{ride.to}</div>
                      </div>
                    </div>

                    <div className="ride-details">
                      <span className="me-3">
                        <i className="bi bi-car-front me-2"></i>
                        {ride.vehicle}
                      </span>
                      <span className="me-3">
                        <i className="bi bi-clock me-2"></i>
                        {ride.duration}
                      </span>
                      <span className="me-3">
                        <i className="bi bi-map me-2"></i>
                        {ride.distance}
                      </span>
                      <span>
                        <i className="bi bi-cash me-2"></i>
                        ${ride.price.toFixed(2)}
                      </span>
                    </div>
                  </Col>

                  <Col md={3} className="border-start">
                    <div className="driver-info">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={ride.driver.photo}
                          alt={ride.driver.name}
                          className="driver-photo me-2"
                        />
                        <div>
                          <div className="driver-name">{ride.driver.name}</div>
                          <div className="driver-rating">
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {ride.driver.rating}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100"
                        onClick={() => handleShowDetails(ride)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      <Modal show={showRideDetails} onHide={() => setShowRideDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ride Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRide && (
            <>
              <div className="ride-details-header mb-4">
                <h5>Trip #{selectedRide.id}</h5>
                <div className="text-muted">
                  {selectedRide.date} • {selectedRide.time}
                </div>
              </div>

              <div className="ride-details-map mb-4">
                {/* Map placeholder */}
                <div className="map-placeholder">
                  <i className="bi bi-map"></i>
                  <span>Map view will be available soon</span>
                </div>
              </div>

              <div className="ride-details-info mb-4">
                <Row>
                  <Col md={6}>
                    <h6>Trip Information</h6>
                    <div className="info-item">
                      <span className="label">From:</span>
                      <span className="value">{selectedRide.from}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">To:</span>
                      <span className="value">{selectedRide.to}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Distance:</span>
                      <span className="value">{selectedRide.distance}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Duration:</span>
                      <span className="value">{selectedRide.duration}</span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6>Payment Information</h6>
                    <div className="info-item">
                      <span className="label">Vehicle:</span>
                      <span className="value">{selectedRide.vehicle}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Base Fare:</span>
                      <span className="value">${(selectedRide.price * 0.8).toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Service Fee:</span>
                      <span className="value">${(selectedRide.price * 0.2).toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Total:</span>
                      <span className="value fw-bold">${selectedRide.price.toFixed(2)}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {selectedRide.rating && (
                <div className="ride-review">
                  <h6>Your Review</h6>
                  <div className="stars mb-2">
                    {renderStars(selectedRide.rating)}
                  </div>
                  <p className="review-text">{selectedRide.review}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Rides; 