import React from 'react';
import { Button } from 'react-bootstrap';

const RideSummary = ({ summary, isBookingEnabled, onConfirmBooking }) => {
  return (
    <div className="ride-summary-section">
      <div className="summary-section">
        <h3 className="summary-title">Ride Summary</h3>
        <div className="summary-item">
          <span className="summary-label">Distance</span>
          <span className="summary-value">{summary.distance}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Estimated Time</span>
          <span className="summary-value">{summary.estimatedTime}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Base Fare</span>
          <span className="summary-value">${summary.baseFare.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Service Fee</span>
          <span className="summary-value">${summary.serviceFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="total-section">
        <div className="summary-item">
          <span className="summary-label">Total</span>
          <span className="total-amount">
            ${(summary.baseFare + summary.serviceFee).toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-100 mt-3"
        disabled={!isBookingEnabled}
        onClick={onConfirmBooking}
      >
        Confirm Booking
      </Button>
    </div>
  );
};

export default RideSummary; 