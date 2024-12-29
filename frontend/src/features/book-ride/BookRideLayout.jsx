import React from 'react';
import LocationForm from './components/LocationForm';
import SavedPlaces from './components/SavedPlaces';
import RideOptions from './components/RideOptions';
import RideSummary from './components/RideSummary';
import useBooking from './hooks/useBooking';
import useSavedPlaces from './hooks/useSavedPlaces';
import useRideOptions from './hooks/useRideOptions';

const BookRideLayout = () => {
  const {
    formData,
    summary,
    isBookingEnabled,
    handleInputChange,
    handleLocationSelect,
    handleSavedPlaceClick,
    handleRideOptionSelect,
    handleConfirmBooking
  } = useBooking();

  const { savedPlaces } = useSavedPlaces();
  const { rideOptions } = useRideOptions();

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
              {/* Location Form with Map */}
              <LocationForm
                formData={formData}
                onInputChange={handleInputChange}
                onLocationSelect={handleLocationSelect}
              />

              {/* Saved Places */}
              <SavedPlaces
                places={savedPlaces}
                onPlaceSelect={handleSavedPlaceClick}
              />

              {/* Ride Options */}
              <RideOptions
                options={rideOptions}
                selectedRideType={formData.selectedRideType}
                onRideSelect={handleRideOptionSelect}
              />
            </div>

            {/* Ride Summary */}
            <RideSummary
              summary={summary}
              isBookingEnabled={isBookingEnabled}
              onConfirmBooking={handleConfirmBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRideLayout; 