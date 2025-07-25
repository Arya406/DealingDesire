import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input name="username" placeholder="Username" onChange={handleChange} required className="w-full border p-2" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="w-full border p-2" />
        <select name="role" onChange={handleChange} className="w-full border p-2">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white w-full py-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
