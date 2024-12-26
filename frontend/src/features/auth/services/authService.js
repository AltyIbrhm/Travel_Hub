import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    setAuthToken(token);
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    setAuthToken(null);
    return null;
  }
};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  const { token, user } = response.data;
  setAuthToken(token);
  return user;
};

const logout = () => {
  setAuthToken(null);
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const authService = {
  getCurrentUser,
  login,
  logout,
  isAuthenticated,
  setAuthToken
};

export default authService; 