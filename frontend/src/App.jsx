// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/dashboard';
import Home from './pages/home';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './components/AuthContext';

// Wrapper component to handle auth redirects
const AuthWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated and trying to access auth pages
  if (isAuthenticated && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthWrapper>
        
        {/* Toast notifications */}
       
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;