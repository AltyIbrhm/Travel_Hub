import api from '../../../shared/api/config';

export const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch dashboard statistics');
  }
};

export const fetchRecentActivity = async () => {
  try {
    const response = await api.get('/api/dashboard/activity');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch recent activity');
  }
};

export const fetchUpcomingReservations = async () => {
  try {
    const response = await api.get('/api/dashboard/upcoming-reservations');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch upcoming reservations');
  }
}; 