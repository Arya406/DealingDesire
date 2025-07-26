import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiMail } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">DesireDeal</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Please enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail className="form-icon" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                onChange={handleChange}
                required
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" className="form-label">Password</label>
              <Link to="/forgot-password" className="forgot-password" style={{
                fontSize: '0.8rem',
                color: 'var(--primary-color)',
                textDecoration: 'none'
              }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <FiLock className="form-icon" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
