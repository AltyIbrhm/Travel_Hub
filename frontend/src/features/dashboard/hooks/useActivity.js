import { useState, useEffect } from 'react';

export const useActivity = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      icon: 'bi-check-circle',
      title: 'Ride Completed',
      subtitle: 'London to Manchester',
      meta: '2 hours ago',
      amount: '-$45.00'
    },
    {
      id: 2,
      icon: 'bi-ticket-perforated',
      title: 'Promo Applied',
      subtitle: 'SAVE15 - 15% discount',
      meta: '5 hours ago',
      amount: '-$7.50'
    },
    {
      id: 3,
      icon: 'bi-star-fill',
      title: 'Rated Driver',
      subtitle: 'John Smith - 5 stars',
      meta: 'Yesterday'
    }
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API call:
    // const fetchActivities = async () => {
    //   try {
    //     const response = await fetch('/api/dashboard/activities');
    //     const data = await response.json();
    //     setActivities(data);
    //   } catch (error) {
    //     console.error('Error fetching activities:', error);
    //   }
    // };
    // fetchActivities();
  }, []);

  return { activities };
};

export default useActivity; 