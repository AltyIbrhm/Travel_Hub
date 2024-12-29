import { useState, useEffect, useCallback } from 'react';

export const useRides = () => {
  const [activeRides, setActiveRides] = useState([
    {
      id: 1,
      from: 'Current Location',
      to: 'Manchester Airport',
      status: 'Driver Arriving',
      timeToArrive: '5 mins',
      driver: {
        name: 'John Smith',
        rating: 4.8,
        car: 'Tesla Model 3',
        plate: 'ABC 123',
        eta: '5 mins'
      }
    }
  ]);

  const [upcomingRides, setUpcomingRides] = useState([
    {
      id: 1,
      title: 'Manchester to Liverpool',
      subtitle: 'Today, 15:00',
      status: 'Confirmed',
      driver: 'John Smith',
      driverRating: 4.8,
      price: '$35.00',
      carInfo: 'Tesla Model 3 - ABC 123'
    },
    {
      id: 2,
      title: 'Liverpool to Birmingham',
      subtitle: 'Tomorrow, 09:00',
      status: 'Pending',
      estimatedPrice: '$42.00 - $48.00'
    }
  ]);

  const handleContactDriver = useCallback((rideId) => {
    // Implement contact driver logic
    console.log('Contacting driver for ride:', rideId);
  }, []);

  const handleCancelRide = useCallback((rideId) => {
    // Implement ride cancellation logic
    console.log('Cancelling active ride:', rideId);
    setActiveRides(prev => prev.filter(ride => ride.id !== rideId));
  }, []);

  const handleEditRide = useCallback((rideId) => {
    // Implement ride edit logic
    console.log('Editing upcoming ride:', rideId);
  }, []);

  const handleCancelUpcomingRide = useCallback((rideId) => {
    // Implement upcoming ride cancellation logic
    console.log('Cancelling upcoming ride:', rideId);
    setUpcomingRides(prev => prev.filter(ride => ride.id !== rideId));
  }, []);

  const handleBookRide = useCallback(() => {
    // Implement book ride logic
    console.log('Opening book ride form');
  }, []);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API calls:
    // const fetchRides = async () => {
    //   try {
    //     const activeResponse = await fetch('/api/rides/active');
    //     const activeData = await activeResponse.json();
    //     setActiveRides(activeData);
    //
    //     const upcomingResponse = await fetch('/api/rides/upcoming');
    //     const upcomingData = await upcomingResponse.json();
    //     setUpcomingRides(upcomingData);
    //   } catch (error) {
    //     console.error('Error fetching rides:', error);
    //   }
    // };
    // fetchRides();
  }, []);

  return {
    activeRides,
    upcomingRides,
    handleContactDriver,
    handleCancelRide,
    handleEditRide,
    handleCancelUpcomingRide,
    handleBookRide
  };
};

export default useRides; 