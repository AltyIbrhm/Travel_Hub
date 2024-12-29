import { useState, useEffect } from 'react';

export const useRideOptions = () => {
  const [rideOptions, setRideOptions] = useState([
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
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API call:
    // const fetchRideOptions = async () => {
    //   try {
    //     const response = await fetch('/api/rides/options');
    //     const data = await response.json();
    //     setRideOptions(data);
    //   } catch (error) {
    //     console.error('Error fetching ride options:', error);
    //   }
    // };
    // fetchRideOptions();
  }, []);

  return { rideOptions };
};

export default useRideOptions; 