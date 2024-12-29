import React from 'react';
import { Button } from 'react-bootstrap';

const UpcomingRides = ({ rides, onEdit, onCancel, onBookRide }) => {
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Upcoming Rides</div>
        <div className="section-actions">
          <Button variant="primary" size="sm" onClick={onBookRide}>
            <i className="bi bi-plus-lg me-1"></i>
            Book Ride
          </Button>
        </div>
      </div>
      <div className="list">
        {rides.map(item => (
          <div key={item.id} className="list-item">
            <div className="item-content">
              <div className="item-title">{item.title}</div>
              <div className="item-subtitle">{item.subtitle}</div>
              {item.driver && (
                <div className="ride-details">
                  <span className="ride-info">
                    <i className="bi bi-person"></i> {item.driver} ({item.driverRating}★)
                  </span>
                  <span className="ride-info">
                    <i className="bi bi-car-front"></i> {item.carInfo}
                  </span>
                  <span className="ride-info">
                    <i className="bi bi-cash"></i> {item.price}
                  </span>
                </div>
              )}
              {item.estimatedPrice && (
                <div className="ride-details">
                  <span className="ride-info">
                    <i className="bi bi-cash"></i> Est. {item.estimatedPrice}
                  </span>
                </div>
              )}
            </div>
            <div className="ride-actions">
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(item.id)}>
                <i className="bi bi-pencil"></i>
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onCancel(item.id)}>
                <i className="bi bi-x"></i>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingRides; 