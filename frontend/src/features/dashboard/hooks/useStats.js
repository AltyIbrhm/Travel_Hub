import { useState, useEffect } from 'react';

export const useStats = () => {
  const [stats, setStats] = useState([
    { id: 1, icon: 'bi-car-front', label: 'Rides Taken', value: '28', trend: '+3' },
    { id: 2, icon: 'bi-wallet2', label: 'Total Spent', value: '$580', trend: '+$45' },
    { id: 3, icon: 'bi-piggy-bank', label: 'Savings', value: '$120', trend: '+$15' },
    { id: 4, icon: 'bi-map', label: 'Distance', value: '892 km', trend: '+24km' }
  ]);

  // In a real application, you would fetch this data from an API
  useEffect(() => {
    // Example API call:
    // const fetchStats = async () => {
    //   try {
    //     const response = await fetch('/api/dashboard/stats');
    //     const data = await response.json();
    //     setStats(data);
    //   } catch (error) {
    //     console.error('Error fetching stats:', error);
    //   }
    // };
    // fetchStats();
  }, []);

  return { stats };
};

export default useStats; 