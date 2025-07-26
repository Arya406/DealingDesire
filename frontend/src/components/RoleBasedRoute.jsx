// src/components/RoleBasedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="full-page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they don't have access
    const redirectTo = user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RoleBasedRoute;