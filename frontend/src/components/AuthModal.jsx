import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiX, FiUser, FiMail, FiLock, FiUserPlus, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';
import '../pages/Auth.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setError('');
      setFormData(prev => ({
        ...prev,
        password: '',
        ...(mode === 'register' && {
          username: '',
          role: 'buyer'
        })
      }));
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = '';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // In AuthModal.jsx, update the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData);
      }
      
      if (result.success) {
        toast.success(mode === 'login' ? 'Login successful!' : 'Account created successfully!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
        });
        
        // Close modal after a short delay
        setTimeout(() => {
          onClose();
          // Redirect based on user role
          const dashboardPath = result.user.role === 'seller' ? '/seller/dashboard' : '/buyer/dashboard';
          navigate(dashboardPath, { replace: true });
        }, 1500);
      } else {
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.message || `Failed to ${mode}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen && !isMounted) return null;

  return (
    <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className={`auth-modal ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          <FiX size={24} />
        </button>
        
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">DesireDeal</div>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login' 
                ? 'Please enter your credentials to access your account'
                : 'Join our community to start your journey'}
            </p>
          </div>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <div className="input-with-icon">
                <FiUser className="form-icon" size={18} />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder ="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="form-control"
                    autoComplete="username"
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="form-icon" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                  autoComplete={mode === 'login' ? 'username' : 'email'}
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="password-label-container">
                <label htmlFor="password" className="form-label">
                  {mode === 'login' ? 'Password' : 'Create Password'}
                </label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    className="forgot-password"
                    onClick={() => alert('Password reset functionality coming soon!')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="input-with-icon">
                <FiLock className="form-icon" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="form-control"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="role" className="form-label">I want to</label>
                <div className="role-selector">
                  <label className={`role-option ${formData.role === 'buyer' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={formData.role === 'buyer'}
                      onChange={handleChange}
                    />
                    <span>Buy</span>
                  </label>
                  <label className={`role-option ${formData.role === 'seller' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={formData.role === 'seller'}
                      onChange={handleChange}
                    />
                    <span>Sell</span>
                  </label>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <button 
                type="submit" 
                className={`auth-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                ) : (
                  <>
                    {mode === 'login' ? (
                      <>
                        <FiLogIn className="btn-icon" size={18} />
                        Sign In
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="btn-icon" size={18} />
                        Create Account
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button 
              type="button" 
              className="auth-link"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Sign up now' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;