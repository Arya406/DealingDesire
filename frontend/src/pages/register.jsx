import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'buyer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(JSON.stringify(err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">DesireDeal</div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join our community to start your journey</p>
        </div>
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <FiUser className="form-icon" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)'
              }} />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                onChange={handleChange}
                required
                className="form-control"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>
          
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
            <label htmlFor="password" className="form-label">Password</label>
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
          
          <div className="form-group">
            <label htmlFor="role" className="form-label">I want to</label>
            <div className="role-selector" style={{
              display: 'flex',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <label style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.75rem',
                background: formData.role === 'buyer' ? 'var(--primary-color)' : 'transparent',
                color: formData.role === 'buyer' ? 'white' : 'var(--text-color)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: formData.role === 'buyer' ? '600' : '400'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={formData.role === 'buyer'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Buy
              </label>
              <label style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.75rem',
                background: formData.role === 'seller' ? 'var(--primary-color)' : 'transparent',
                color: formData.role === 'seller' ? 'white' : 'var(--text-color)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: formData.role === 'seller' ? '600' : '400'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === 'seller'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                Sell
              </label>
            </div>
          </div>
          
          <button type="submit" className="auth-btn">
            <FiUserPlus style={{ marginRight: '8px' }} />
            Create Account
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
