import axios from 'axios';

// Create axios instance with default config
const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://desiredealbackend-2.onrender.com/api' 
    : 'http://localhost:5000/api',

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add a request interceptor to add the auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login here or handle it in the component
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
