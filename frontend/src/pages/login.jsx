import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2" />
        <button type="submit" className="bg-green-500 text-white w-full py-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
