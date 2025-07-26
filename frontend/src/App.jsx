// In App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import RoleBasedRoute from './components/RoleBasedRoute';
import Home from './pages/home';
import BuyerDashboard from './pages/buyer/Dashboard';
import SellerDashboard from './pages/seller/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Buyer Routes */}
          <Route
            path="/buyer/*"
            element={
              <RoleBasedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </RoleBasedRoute>
            }
          />
          
          {/* Seller Routes */}
          <Route
            path="/seller/*"
            element={
              <RoleBasedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </RoleBasedRoute>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;