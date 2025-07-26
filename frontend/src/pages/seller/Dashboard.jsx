import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiTag, FiImage, FiInfo } from 'react-icons/fi';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    value: '',
    sellingPrice: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const response = await fetch(`http://localhost:5000/api/giftcards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch gift cards: ${response.status}`);
      }

      const data = await response.json();
      setGiftCards(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setGiftCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, [user?._id]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentCard 
        ? `http://localhost:5000/api/giftcards/${currentCard._id}`
        : 'http://localhost:5000/api/giftcards';
      const method = currentCard ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Operation failed');

      toast.success(currentCard ? 'Gift card updated!' : 'Gift card created!');
      fetchGiftCards();
      setIsModalOpen(false);
      setCurrentCard(null);
      setFormData({
        title: '',
        description: '',
        brand: '',
        value: '',
        sellingPrice: '',
        image: ''
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (card) => {
    setCurrentCard(card);
    setFormData({
      title: card.title,
      description: card.description,
      brand: card.brand,
      value: card.value,
      sellingPrice: card.sellingPrice,
      image: card.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gift card?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/giftcards/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Delete failed');

        toast.success('Gift card deleted!');
        fetchGiftCards();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleStatusChange = async (cardId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/giftcards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update the local state to reflect the change
      setGiftCards(giftCards.map(card => 
        card._id === cardId ? { ...card, status: newStatus } : card
      ));
      
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error(error.message);
      // Re-fetch to ensure UI is in sync with the server
      fetchGiftCards();
    }
  };

  return (
    <div className="seller-dashboard">
      <nav className="seller-nav">
        <div className="seller-nav-container">
          <div className="seller-nav-content">
            <div className="flex items-center">
              <h1 className="seller-nav-title">Seller Dashboard</h1>
            </div>
            <div className="seller-nav-actions">
              <button
                onClick={() => {
                  setCurrentCard(null);
                  setIsModalOpen(true);
                }}
                className="btn btn-primary flex items-center"
              >
                <FiPlus className="mr-2" /> Add Gift Card
              </button>
              <span className="seller-welcome-text">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="seller-main">
        <div className="seller-content">
          <div className="seller-content-header">
            <h2 className="seller-content-title">Your Gift Cards</h2>
            {!loading && (
              <div className="seller-content-count">
                {giftCards.length} {giftCards.length === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p className="empty-state-description">Loading your gift cards...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <FiInfo className="empty-state-icon" />
              <h3 className="empty-state-title">Error loading gift cards</h3>
              <p className="empty-state-description">{error}</p>
              <button
                onClick={fetchGiftCards}
                className="btn btn-primary mt-4"
              >
                Retry
              </button>
            </div>
          ) : giftCards.length === 0 ? (
            <div className="empty-state">
              <FiTag className="empty-state-icon" />
              <h3 className="empty-state-title">No gift cards</h3>
              <p className="empty-state-description">Get started by adding a new gift card.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary flex items-center"
                >
                  <FiPlus className="mr-2" />
                  Add Gift Card
                </button>
              </div>
            </div>
          ) : (
            <div className="seller-table-container">
              <table className="seller-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Brand</th>
                    <th>Value</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giftCards.map((card) => (
                    <tr key={card._id}>
                      <td>
                        <div className="flex items-center">
                          {card.image && (
                            <img 
                              className="rounded-md mr-3" 
                              src={card.image} 
                              alt={card.title} 
                              style={{ height: '40px', width: '40px', objectFit: 'cover' }} 
                            />
                          )}
                          {card.title}
                        </div>
                      </td>
                      <td>{card.brand}</td>
                      <td>${card.value}</td>
                      <td>${card.sellingPrice}</td>
                      <td>
                        <select
                          value={card.status || 'available'}
                          onChange={(e) => handleStatusChange(card._id, e.target.value)}
                          className={`form-select status-select ${
                            card.status === 'available' ? 'status-available' : 'status-sold'
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(card)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FiEdit style={{ height: '20px', width: '20px' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(card._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 style={{ height: '20px', width: '20px' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">
                  {currentCard ? 'Edit Gift Card' : 'Add New Gift Card'}
                </h3>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input form-textarea"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand" className="form-label">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="grid-2 mb-4">
                    <div className="form-group">
                      <label htmlFor="value" className="form-label">
                        Card Value ($)
                      </label>
                      <div className="input-group">
                        <FiDollarSign className="input-icon" />
                        <input
                          type="number"
                          name="value"
                          id="value"
                          value={formData.value}
                          onChange={handleInputChange}
                          className="form-input input-with-icon"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="sellingPrice" className="form-label">
                        Selling Price ($)
                      </label>
                      <div className="input-group">
                        <FiDollarSign className="input-icon" />
                        <input
                          type="number"
                          name="sellingPrice"
                          id="sellingPrice"
                          value={formData.sellingPrice}
                          onChange={handleInputChange}
                          className="form-input input-with-icon"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="image" className="form-label">
                      Image URL
                    </label>
                    <div className="input-group">
                      <FiImage className="input-icon" />
                      <input
                        type="url"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="form-input input-with-icon"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setCurrentCard(null);
                        setFormData({
                          title: '',
                          description: '',
                          brand: '',
                          value: '',
                          sellingPrice: '',
                          image: ''
                        });
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {currentCard ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;