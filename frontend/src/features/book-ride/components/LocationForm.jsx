import React from 'react';
import { Form } from 'react-bootstrap';
import Map from './Map';

const LocationForm = ({ formData, onInputChange, onLocationSelect }) => {
  return (
    <>
      {/* Map View */}
      <div className="form-section">
        <h2 className="form-section-title">Select Location on Map</h2>
        <Map onLocationSelect={onLocationSelect} />
      </div>

      {/* Location Inputs */}
      <div className="form-section">
        <h2 className="form-section-title">Route Details</h2>
        <div className="location-input">
          <i className="bi bi-circle location-icon"></i>
          <Form.Control
            type="text"
            name="pickup"
            placeholder="Enter pickup location"
            value={formData.pickup}
            onChange={onInputChange}
          />
        </div>
        <div className="route-line"></div>
        <div className="location-input">
          <i className="bi bi-geo-alt location-icon"></i>
          <Form.Control
            type="text"
            name="dropoff"
            placeholder="Enter drop-off location"
            value={formData.dropoff}
            onChange={onInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default LocationForm; 