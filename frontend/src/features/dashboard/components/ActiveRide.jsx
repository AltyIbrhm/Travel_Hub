import React from 'react';
import { Button } from 'react-bootstrap';

export const ActiveRide = ({ activeRides, onContactDriver, onCancelRide }) => {
  if (!activeRides.length) return null;

  return (
    <div className="section active-ride-section">
      <div className="section-header">
        <div className="section-title">Active Ride</div>
        <div className="section-actions">
          <Button variant="outline-primary" size="sm" onClick={onContactDriver}>
            <i className="bi bi-chat-dots me-1"></i>
            Contact Driver
          </Button>
          <Button variant="outline-danger" size="sm" onClick={onCancelRide}>
            <i className="bi bi-x-circle me-1"></i>
            Cancel
          </Button>
        </div>
      </div>
      {activeRides.map(ride => (
        <div key={ride.id} className="active-ride-card">
          <div className="ride-status">
            <div className="status-badge">{ride.status}</div>
            <div className="eta">Driver arriving in {ride.timeToArrive}</div>
          </div>
          <div className="ride-route">
            <div className="route-point">
              <i className="bi bi-circle"></i>
              <span>{ride.from}</span>
            </div>
            <div className="route-line"></div>
            <div className="route-point">
              <i className="bi bi-geo-alt-fill"></i>
              <span>{ride.to}</span>
            </div>
          </div>
          <div className="driver-info">
            <div className="driver-profile">
              <i className="bi bi-person-circle"></i>
              <div className="driver-details">
                <div className="driver-name">{ride.driver.name}</div>
                <div className="driver-rating">{ride.driver.rating}★</div>
              </div>
            </div>
            <div className="car-info">
              <i className="bi bi-car-front"></i>
              <div className="car-details">
                <div>{ride.driver.car}</div>
                <div className="plate-number">{ride.driver.plate}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveRide; 