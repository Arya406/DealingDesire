import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import Chat from '../../components/Chat';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiPlus, FiEdit, FiTrash2, FiDollarSign, FiTag, FiImage, FiInfo, FiMessageSquare,
  FiSearch, FiFilter, FiTrendingUp, FiEye, FiShoppingCart, FiCheckCircle, FiXCircle,
  FiBarChart2, FiCalendar, FiDownload, FiUpload, FiX
} from 'react-icons/fi';
import './NewDashboard.css';

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState([]);
  const [filteredGiftCards, setFilteredGiftCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    value: '',
    sellingPrice: '',
    image: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [selectedCards, setSelectedCards] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCards: 0,
    availableCards: 0,
    soldCards: 0,
    totalValue: 0,
    totalRevenue: 0,
    averagePrice: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      setError(null);
    
      const response = await fetch(`http://localhost:5000/api/giftcards/my-cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch gift cards: ${response.status}`);
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

  useEffect(() => {
    const totalCards = giftCards.length;
    const availableCards = giftCards.filter(card => card.status === 'available').length;
    const soldCards = giftCards.filter(card => card.status === 'sold').length;
    const totalValue = giftCards.reduce((sum, card) => sum + parseFloat(card.value || 0), 0);
    const totalRevenue = giftCards
      .filter(card => card.status === 'sold')
      .reduce((sum, card) => sum + parseFloat(card.sellingPrice || 0), 0);
    const averagePrice = totalCards > 0 ? totalValue / totalCards : 0;

    setAnalytics({
      totalCards,
      availableCards,
      soldCards,
      totalValue,
      totalRevenue,
      averagePrice
    });
  }, [giftCards]);

  useEffect(() => {
    let filtered = giftCards;

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(card => card.brand === brandFilter);
    }

    setFilteredGiftCards(filtered);
  }, [giftCards, searchTerm, statusFilter, brandFilter]);

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
        image: '',
        expiryDate: ''
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
      image: card.image,
      expiryDate: card.expiryDate || ''
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

      setGiftCards(giftCards.map(card => 
        card._id === cardId ? { ...card, status: newStatus } : card
      ));
      
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error(error.message);
      fetchGiftCards();
    }
  };

  const handleSelectCard = (cardId) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredGiftCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredGiftCards.map(card => card._id));
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedCards.length === 0) {
      toast.warning('Please select cards to update');
      return;
    }

    try {
      const promises = selectedCards.map(cardId =>
        fetch(`http://localhost:5000/api/giftcards/${cardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: newStatus })
        })
      );

      await Promise.all(promises);
      
      setGiftCards(giftCards.map(card => 
        selectedCards.includes(card._id) ? { ...card, status: newStatus } : card
      ));
      
      setSelectedCards([]);
      toast.success(`${selectedCards.length} cards updated successfully!`);
    } catch (error) {
      toast.error('Failed to update some cards');
      fetchGiftCards();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCards.length === 0) {
      toast.warning('Please select cards to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCards.length} gift cards?`)) {
      return;
    }

    try {
      const promises = selectedCards.map(cardId =>
        fetch(`http://localhost:5000/api/giftcards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      );

      await Promise.all(promises);
      
      setSelectedCards([]);
      toast.success(`${selectedCards.length} cards deleted successfully!`);
      fetchGiftCards();
    } catch (error) {
      toast.error('Failed to delete some cards');
      fetchGiftCards();
    }
  };

  const getUniqueBrands = () => {
    const brands = [...new Set(giftCards.map(card => card.brand).filter(Boolean))];
    return brands.sort();
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/unread-count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  return (
    <div className="seller-dashboard">
      {/* Sidebar */}
      <div className="seller-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <i className="fas fa-gift"></i>
            <span>DealDesire</span>
          </div>
        </div>
        <div className="sidebar-menu">
          <div className={`menu-item ${!currentCard ? 'active' : ''}`} onClick={() => setCurrentCard(null)}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div className="menu-item" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus-circle"></i>
            <span>Add Gift Card</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="seller-main-content">
        <nav className="seller-nav">
          <div className="seller-nav-container">
            <div className="seller-nav-content">
              <div className="nav-content-wrapper">
                <h1 className="seller-nav-title">Seller Dashboard</h1>
                <div className="nav-actions-wrapper">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus className="btn-icon" />
                    <span>Add Gift Card</span>
                  </button>
                  
                  <button
                    onClick={() => setShowChat(true)}
                    className="btn btn-secondary chat-btn"
                    title="Open Chat"
                  >
                    <FiMessageSquare className="btn-icon" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="chat-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  
                  <span className="seller-welcome-text">Welcome, {user?.username || user?.name || 'Seller'}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="seller-main">
          {/* Analytics Section */}
          {!loading && !error && (
            <div className="analytics-section">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <FiTag />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">{analytics.totalCards}</h3>
                    <p className="analytics-label">Total Cards</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon available">
                    <FiCheckCircle />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">{analytics.availableCards}</h3>
                    <p className="analytics-label">Available</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon sold">
                    <FiShoppingCart />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">{analytics.soldCards}</h3>
                    <p className="analytics-label">Sold</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon revenue">
                    <FiDollarSign />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">${analytics.totalRevenue.toFixed(2)}</h3>
                    <p className="analytics-label">Total Revenue</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon value">
                    <FiTrendingUp />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">${analytics.totalValue.toFixed(2)}</h3>
                    <p className="analytics-label">Total Value</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon average">
                    <FiBarChart2 />
                  </div>
                  <div className="analytics-content">
                    <h3 className="analytics-value">${analytics.averagePrice.toFixed(2)}</h3>
                    <p className="analytics-label">Average Price</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="seller-content">
            <div className="seller-content-header">
              <h2 className="seller-content-title">Your Gift Cards</h2>
              {!loading && (
                <div className="seller-content-count">
                  {filteredGiftCards.length} of {giftCards.length} {giftCards.length === 1 ? 'item' : 'items'}
                </div>
              )}
            </div>

            {/* Search and Filter Section */}
            {!loading && !error && giftCards.length > 0 && (
              <div className="filters-section">
                <div className="filters-row">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search gift cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-controls">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Brands</option>
                      {getUniqueBrands().map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedCards.length > 0 && (
              <div className="bulk-actions">
                <div className="bulk-actions-content">
                  <span className="bulk-actions-text">
                    {selectedCards.length} card{selectedCards.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="bulk-actions-buttons">
                    <button
                      onClick={() => handleBulkStatusChange('available')}
                      className="btn btn-success btn-sm"
                    >
                      <FiCheckCircle className="btn-icon" />
                      <span>Mark Available</span>
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('sold')}
                      className="btn btn-secondary btn-sm"
                    >
                      <FiShoppingCart className="btn-icon" />
                      <span>Mark Sold</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="btn btn-danger btn-sm"
                    >
                      <FiTrash2 className="btn-icon" />
                      <span>Delete Selected</span>
                    </button>
                    <button
                      onClick={() => setSelectedCards([])}
                      className="btn btn-outline btn-sm"
                    >
                      <FiXCircle className="btn-icon" />
                      <span>Clear Selection</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                  className="btn btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : giftCards.length === 0 ? (
              <div className="empty-state">
                <FiTag className="empty-state-icon" />
                <h3 className="empty-state-title">No gift cards</h3>
                <p className="empty-state-description">Get started by adding a new gift card.</p>
                <div className="empty-state-action">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                  >
                    <FiPlus className="btn-icon" />
                    <span>Add Gift Card</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="seller-table-container">
                <table className="seller-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedCards.length === filteredGiftCards.length && filteredGiftCards.length > 0}
                          onChange={handleSelectAll}
                          className="table-checkbox"
                        />
                      </th>
                      <th>Title</th>
                      <th>Brand</th>
                      <th>Value</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGiftCards.map((card) => (
                      <tr key={card._id} className={selectedCards.includes(card._id) ? 'selected-row' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedCards.includes(card._id)}
                            onChange={() => handleSelectCard(card._id)}
                            className="table-checkbox"
                          />
                        </td>
                        <td>
                          <div className="card-info">
                            {card.image && (
                              <img 
                                className="card-image" 
                                src={card.image} 
                                alt={card.title} 
                              />
                            )}
                            <div className="card-details">
                              <div className="card-title">{card.title}</div>
                              {card.description && (
                                <div className="card-description">
                                  {card.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="brand-badge">{card.brand}</span>
                        </td>
                        <td>
                          <span className="value-text">${card.value}</span>
                        </td>
                        <td>
                          <span className="price-text">${card.sellingPrice}</span>
                        </td>
                        <td>
                          <select
                            value={card.status || 'available'}
                            onChange={(e) => handleStatusChange(card._id, e.target.value)}
                            className={`form-select status-select ${
                              card.status === 'available' ? 'status-available' : 
                              card.status === 'sold' ? 'status-sold' :
                              card.status === 'pending' ? 'status-pending' : 'status-expired'
                            }`}
                          >
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="pending">Pending</option>
                            <option value="expired">Expired</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEdit(card)}
                              className="action-btn edit-btn"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(card._id)}
                              className="action-btn delete-btn"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Chat Component */}
        <Chat 
          isOpen={showChat} 
          onClose={() => setShowChat(false)}
        />
        
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Modal for Add/Edit Gift Card */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">
                    {currentCard ? 'Edit Gift Card' : 'Add New Gift Card'}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentCard(null);
                      setFormData({
                        title: '',
                        description: '',
                        brand: '',
                        value: '',
                        sellingPrice: '',
                        image: '',
                        expiryDate: ''
                      });
                    }}
                    className="modal-close-btn"
                  >
                    <FiX />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Title <span className="required-field">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="e.g. Amazon $50 Gift Card"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="description" className="form-label">
                        Description <span className="required-field">*</span>
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-input form-textarea"
                        placeholder="Describe your gift card (condition, terms, etc.)"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group form-group-half">
                        <label htmlFor="brand" className="form-label">
                          Brand <span className="required-field">*</span>
                        </label>
                        <input
                          type="text"
                          name="brand"
                          id="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="form-input"
                          placeholder="e.g. Amazon, Walmart"
                          required
                        />
                      </div>
                      
                      <div className="form-group form-group-half">
                        <label htmlFor="expiryDate" className="form-label">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          name="expiryDate"
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group form-group-half">
                        <label htmlFor="value" className="form-label">
                          Card Value ($) <span className="required-field">*</span>
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
                            placeholder="50.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group form-group-half">
                        <label htmlFor="sellingPrice" className="form-label">
                          Selling Price ($) <span className="required-field">*</span>
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
                            placeholder="45.00"
                            min="0"
                            step="0.01"
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
                      {formData.image && (
                        <div className="image-preview">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="preview-image"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                            image: '',
                            expiryDate: ''
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
                        {currentCard ? 'Update Card' : 'Add Card'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;