import { useState, useCallback } from 'react';

export const useBooking = () => {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    selectedRideType: null,
    pickupLocation: null,
    dropoffLocation: null
  });

  const [summary, setSummary] = useState({
    distance: '5.2 km',
    estimatedTime: '15-20 min',
    baseFare: 20.00,
    serviceFee: 2.00
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleLocationSelect = useCallback((location) => {
    setFormData(prev => ({
      ...prev,
      pickup: location.name,
      pickupLocation: location
    }));
  }, []);

  const handleSavedPlaceClick = useCallback((place) => {
    // Handle saved place selection
    console.log('Selected place:', place);
  }, []);

  const handleRideOptionSelect = useCallback((rideId) => {
    setFormData(prev => ({
      ...prev,
      selectedRideType: rideId
    }));
  }, []);

  const handleConfirmBooking = useCallback(() => {
    // Implement booking confirmation logic
    console.log('Confirming booking with data:', formData);
  }, [formData]);

  const isBookingEnabled = Boolean(
    formData.pickup && 
    formData.dropoff && 
    formData.selectedRideType
  );

  return {
    formData,
    summary,
    isBookingEnabled,
    handleInputChange,
    handleLocationSelect,
    handleSavedPlaceClick,
    handleRideOptionSelect,
    handleConfirmBooking
  };
};

export default useBooking; 