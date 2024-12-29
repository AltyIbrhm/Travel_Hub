import { useState, useEffect } from 'react';

export const useSavedPlaces = () => {
  const [savedPlaces, setSavedPlaces] = useState([
    { id: 1, name: 'Home', icon: 'bi-house' },
    { id: 2, name: 'Office', icon: 'bi-building' },
    { id: 3, name: 'Gym', icon: 'bi-bicycle' },
    { id: 4, name: 'Mall', icon: 'bi-shop' }
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API call:
    // const fetchSavedPlaces = async () => {
    //   try {
    //     const response = await fetch('/api/places/saved');
    //     const data = await response.json();
    //     setSavedPlaces(data);
    //   } catch (error) {
    //     console.error('Error fetching saved places:', error);
    //   }
    // };
    // fetchSavedPlaces();
  }, []);

  return { savedPlaces };
};

export default useSavedPlaces; 