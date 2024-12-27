import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Map from './components/Map';

const BookRideLayout = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    selectedRideType: null,
    pickupLocation: null,
    dropoffLocation: null
  });

  const savedPlaces = [
    { id: 1, name: 'Home', icon: 'bi-house' },
    { id: 2, name: 'Office', icon: 'bi-building' },
    { id: 3, name: 'Gym', icon: 'bi-bicycle' },
    { id: 4, name: 'Mall', icon: 'bi-shop' }
  ];

  const rideOptions = [
    {
      id: 1,
      name: 'Standard',
      icon: 'bi-car-front',
      details: '4 seats • Regular car',
      price: '$25-30',
      estimatedTime: '15-20 min'
    },
    {
      id: 2,
      name: 'Premium',
      icon: 'bi-car-front-fill',
      details: '4 seats • Luxury car',
      price: '$35-40',
      estimatedTime: '15-20 min'
    },
    {
      id: 3,
      name: 'XL',
      icon: 'bi-truck',
      details: '6 seats • SUV/Van',
      price: '$45-50',
      estimatedTime: '18-25 min'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      pickup: location.name,
      pickupLocation: location
    }));
  };

  const handleSavedPlaceClick = (place) => {
    // Handle saved place selection
  };

  const handleRideOptionSelect = (rideId) => {
    setFormData(prev => ({
      ...prev,
      selectedRideType: rideId
    }));
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="book-ride-container">
          <div className="book-ride-header">
            <h1 className="page-title">Book a Ride</h1>
            <p className="page-subtitle">Where would you like to go today?</p>
          </div>

          <div className="book-ride-content">
            <div className="booking-form-section">
              {/* Map View */}
              <div className="form-section">
                <h2 className="form-section-title">Select Location on Map</h2>
                <Map onLocationSelect={handleLocationSelect} />
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Saved Places */}
              <div className="form-section">
                <h2 className="form-section-title">Saved Places</h2>
                <div className="saved-places">
                  {savedPlaces.map(place => (
                    <div
                      key={place.id}
                      className="saved-place-card"
                      onClick={() => handleSavedPlaceClick(place)}
                    >
                      <i className={`bi ${place.icon} saved-place-icon`}></i>
                      <div className="saved-place-name">{place.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ride Options */}
              <div className="form-section">
                <h2 className="form-section-title">Select Ride Type</h2>
                <div className="ride-options">
                  {rideOptions.map(option => (
                    <div
                      key={option.id}
                      className={`ride-option-card ${formData.selectedRideType === option.id ? 'selected' : ''}`}
                      onClick={() => handleRideOptionSelect(option.id)}
                    >
                      <div className="ride-option-header">
                        <i className={`bi ${option.icon} ride-option-icon`}></i>
                        <span className="ride-option-name">{option.name}</span>
                      </div>
                      <div className="ride-option-details">{option.details}</div>
                      <div className="ride-option-price">{option.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ride Summary */}
            <div className="ride-summary-section">
              <div className="summary-section">
                <h3 className="summary-title">Ride Summary</h3>
                <div className="summary-item">
                  <span className="summary-label">Distance</span>
                  <span className="summary-value">5.2 km</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Estimated Time</span>
                  <span className="summary-value">15-20 min</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Base Fare</span>
                  <span className="summary-value">$20.00</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Service Fee</span>
                  <span className="summary-value">$2.00</span>
                </div>
              </div>

              <div className="total-section">
                <div className="summary-item">
                  <span className="summary-label">Total</span>
                  <span className="total-amount">$22.00</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mt-3"
                disabled={!formData.pickup || !formData.dropoff || !formData.selectedRideType}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRideLayout; 