import { useState, useEffect, useCallback } from 'react';

export const useRoutes = () => {
  const [favoriteRoutes, setFavoriteRoutes] = useState([
    { 
      id: 1, 
      from: 'Home', 
      to: 'Office', 
      address: '123 Main St to 456 Business Ave',
      lastUsed: '2 days ago',
      frequency: '15 times this month',
      estimatedPrice: '$25-30'
    },
    { 
      id: 2, 
      from: 'Office', 
      to: 'Gym', 
      address: '456 Business Ave to 789 Fitness St',
      lastUsed: '5 days ago',
      frequency: '8 times this month',
      estimatedPrice: '$15-20'
    }
  ]);

  const handleManageRoutes = useCallback(() => {
    // Implement manage routes logic
    console.log('Opening route management interface');
  }, []);

  const handleBookNow = useCallback((routeId) => {
    // Implement immediate booking logic
    console.log('Booking route:', routeId);
  }, []);

  const handleSchedule = useCallback((routeId) => {
    // Implement schedule booking logic
    console.log('Opening schedule interface for route:', routeId);
  }, []);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API call:
    // const fetchRoutes = async () => {
    //   try {
    //     const response = await fetch('/api/routes/favorites');
    //     const data = await response.json();
    //     setFavoriteRoutes(data);
    //   } catch (error) {
    //     console.error('Error fetching favorite routes:', error);
    //   }
    // };
    // fetchRoutes();
  }, []);

  return {
    favoriteRoutes,
    handleManageRoutes,
    handleBookNow,
    handleSchedule
  };
};

export default useRoutes; 