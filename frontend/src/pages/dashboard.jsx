import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMail, FiShield, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../components/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Show logout message
      toast.success('You have been logged out successfully!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner">
          <FiLoader className="spinner-icon" />
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-greeting">
          <h1>Welcome back, {user?.username || 'User'}! 👋</h1>
          <p className="welcome-text">Here's what's happening with your account today.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <FiLoader className="btn-icon spin" />
              Logging out...
            </>
          ) : (
            <>
              <FiLogOut className="btn-icon" />
              Logout
            </>
          )}
        </button>
      </header>

      <div className="dashboard-content">
        <div className="user-card">
          <div className="user-avatar">
            <FiUser className="avatar-icon" />
          </div>
          <div className="user-details">
            <h2>{user?.username || 'User'}</h2>
            <p className="user-email">
              <FiMail className="icon" /> {user?.email || 'No email provided'}
            </p>
            <div className="user-role">
              <FiShield className="icon" />
              <span className={`role-badge ${user?.role || 'buyer'}`}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Buyer'}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">0</p>
            <p className="stat-label">No orders yet</p>
          </div>
          <div className="stat-card">
            <h3>Account Status</h3>
            <p className="stat-value">Active</p>
            <p className="stat-label">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
