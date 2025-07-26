// src/components/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token) {
          try {
            // Set the token in the request headers
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Verify token and get user data
            const res = await API.get('/auth/me');
            
            // If we have a saved user, use it, otherwise use the one from the API
            const userData = savedUser ? JSON.parse(savedUser) : res.data;
            
            // Update state and localStorage
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (error) {
            console.error('Token verification failed:', error);
            // Clear invalid auth data
            delete API.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // No token, ensure user is cleared
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set the token in the request headers for subsequent requests
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any partial auth data on failed login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await API.post('/auth/register', userData);
      // Auto-login after registration
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if needed
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setUser(null);
      
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;