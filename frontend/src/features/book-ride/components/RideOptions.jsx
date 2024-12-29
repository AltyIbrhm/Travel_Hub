import React from 'react';

const RideOptions = ({ options, selectedRideType, onRideSelect }) => {
  return (
    <div className="form-section">
      <h2 className="form-section-title">Select Ride Type</h2>
      <div className="ride-options">
        {options.map(option => (
          <div
            key={option.id}
            className={`ride-option-card ${selectedRideType === option.id ? 'selected' : ''}`}
            onClick={() => onRideSelect(option.id)}
          >
            <div className="ride-option-header">
              <i className={`bi ${option.icon} ride-option-icon`}></i>
              <span className="ride-option-name">{option.name}</span>
            </div>
            <div className="ride-option-details">{option.details}</div>
            <div className="ride-option-price">{option.price}</div>
            <div className="ride-option-time">{option.estimatedTime}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptions; 