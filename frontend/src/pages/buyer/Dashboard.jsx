import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import ProductService from '../../services/productService';
import Chat from '../../components/Chat';
import API from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingCart, FiHeart, FiShare2, FiSearch, FiUser, FiLogOut, FiStar, FiShield, FiAward, FiTrendingUp, FiMessageSquare } from 'react-icons/fi';
import { FaCrown, FaGem, FaShieldAlt, FaRupeeSign, FaCheckCircle, FaStar } from 'react-icons/fa';
import { MdVerified, MdSecurity, MdLocalShipping, MdSupportAgent } from 'react-icons/md';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100000);
  const [activeTab, setActiveTab] = useState('featured');
  const [showChat, setShowChat] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  
  const categories = ['all', 'Jewelry', 'Watches', 'Fashion', 'Electronics', 'Home', 'Automotive', 'Art'];
  const tabs = [
    { id: 'featured', label: 'Featured', icon: FaStar },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp },
    { id: 'new', label: 'New Arrivals', icon: FaGem },
    { id: 'exclusive', label: 'Exclusive', icon: FaCrown }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAllProducts();
        setProducts(data.map(product => ({
          ...product,
          isFavorite: false,
          rating: product.rating || (4.2 + Math.random() * 0.8),
          reviews: product.reviews || Math.floor(Math.random() * 500) + 50,
          verified: Math.random() > 0.3,
          expressDelivery: Math.random() > 0.5,
          premiumSeller: Math.random() > 0.7
        })));
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product._id === productId 
        ? { ...product, isFavorite: !product.isFavorite } 
        : product
    ));
  };

  const handleAddToCart = (productId) => {
    console.log('Added to cart:', productId);
  };

  const handleStartChat = async (sellerId) => {
    if (!sellerId) {
      toast.error('Seller information not available. Cannot start chat.');
      return;
    }

    try {
      // Get or create chat with the seller
      const response = await API.get(`/chat/chat/${sellerId}`);
      const chat = response.data;
      setSelectedChatId(chat._id);
      setShowChat(true);
      toast.success('Chat started successfully!');
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const productName = product.name || '';
    const productDescription = product.description || '';
    const productCategory = product.category || '';
    const productPrice = product.price || 0;
    
    const matchesSearch = searchTerm === '' || 
                         productName.toLowerCase().includes(searchLower) ||
                         productDescription.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'all' || 
                          productCategory === selectedCategory;
    
    const matchesPrice = productPrice <= priceRange;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="premium-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Curating Your Premium Collection</h2>
          <p>Please wait while we prepare the finest selection for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-error">
        <div className="error-container">
          <FaShieldAlt className="error-icon" />
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      {/* Premium Header with Indian Cultural Elements */}
      <header className="premium-header">
        <div className="header-top">
          <div className="header-container">
            <div className="brand-section">
              <div className="brand-logo">
                <div className="logo-icon">
                  <FaGem />
                </div>
                <div className="brand-text">
                  <h1>DesireDeal</h1>
                  <span className="brand-tagline">Premium Marketplace</span>
                </div>
              </div>
            </div>
            
            <div className="header-center">
              <div className="premium-search">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search premium products, brands, and collections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">Search</button>
              </div>
            </div>
            
            <div className="header-actions">
              <div className="user-welcome">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <div className="user-info">
                  <span className="welcome-text">Welcome back,</span>
                  <span className="user-name">{user?.username}</span>
                </div>
              </div>
              
              {/* Chat Button */}
              <button 
                className="chat-btn"
                onClick={() => setShowChat(true)}
                title="Open Chat"
              >
                <FiMessageSquare />
              </button>
              
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut />
              </button>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators Bar */}
        <div className="trust-bar">
          <div className="trust-container">
            <div className="trust-item">
              <MdVerified className="trust-icon" />
              <span>100% Authentic Products</span>
            </div>
            <div className="trust-item">
              <MdSecurity className="trust-icon" />
              <span>Secure Payments</span>
            </div>
            <div className="trust-item">
              <MdLocalShipping className="trust-icon" />
              <span>Premium Delivery</span>
            </div>
            <div className="trust-item">
              <MdSupportAgent className="trust-icon" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </header>

      <main className="premium-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Discover Premium Excellence</h1>
            <p>Curated collections from India's finest brands and artisans</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Premium Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Verified Sellers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="category-tabs">
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Filters Section */}
        <section className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="premium-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group price-filter">
              <div className="price-header">
                <label>Price Range</label>
                <span className="price-value">Up to ₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="premium-slider"
              />
            </div>
            
            <div className="filter-group">
              <label>Sort By</label>
              <select className="premium-select">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2>Premium Collection</h2>
            <p>Handpicked products for the discerning customer</p>
          </div>
          
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article key={product._id} className="premium-product">
                  <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} />
                    
                    <div className="product-badges">
                      {product.verified && (
                        <span className="badge verified">
                          <MdVerified />
                          Verified
                        </span>
                      )}
                      {product.premiumSeller && (
                        <span className="badge premium">
                          <FaCrown />
                          Premium Seller
                        </span>
                      )}
                      {product.expressDelivery && (
                        <span className="badge express">
                          <MdLocalShipping />
                          Express Delivery
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleFavorite(product._id)}
                      className={`favorite-btn ${product.isFavorite ? 'active' : ''}`}
                    >
                      <FiHeart />
                    </button>
                    
                    <div className="product-overlay">
                      <button className="quick-view-btn">Quick View</button>
                    </div>
                  </div>
                  
                  <div className="product-details">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <div className="product-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(product.rating) ? 'star filled' : 'star'} 
                            />
                          ))}
                        </div>
                        <span className="rating-text">({product.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-footer">
                      <div className="price-section">
                        <div className="price-container">
                          <FaRupeeSign className="rupee-icon" />
                          <span className="price">{product.price.toLocaleString()}</span>
                        </div>
                        {product.price > 50000 && (
                          <span className="emi-option">EMI Available</span>
                        )}
                      </div>
                      
                      <div className="action-buttons">
                        <button className="share-btn" title="Share">
                          <FiShare2 />
                        </button>
                        {product.sellerId && (
                          <button 
                            className="chat-seller-btn"
                            onClick={() => handleStartChat(product.sellerId)}
                            title="Chat with Seller"
                          >
                            <FiMessageSquare />
                          </button>
                        )}
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          <FiShoppingCart />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <FaGem className="no-products-icon" />
                  <h3>No Products Found</h3>
                  <p>Try adjusting your search criteria or browse our featured collections</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setPriceRange(100000);
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Trust Features */}
        <section className="trust-features">
          <div className="features-container">
            <div className="feature-item">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Authenticity Guarantee</h3>
              <p>Every product is verified for authenticity with our rigorous quality checks</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FiAward />
              </div>
              <h3>Premium Quality</h3>
              <p>Curated selection of only the finest products from trusted brands</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <MdLocalShipping />
              </div>
              <h3>Express Delivery</h3>
              <p>Premium packaging and fast delivery to your doorstep</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <MdSupportAgent />
              </div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer support team available round the clock</p>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="premium-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <FaGem />
              <h2>DesireDeal</h2>
            </div>
            <p>India's premier marketplace for premium products and luxury experiences</p>
            <div className="social-links">
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h3>Shop</h3>
              <a href="#">New Arrivals</a>
              <a href="#">Trending</a>
              <a href="#">Exclusive Collections</a>
              <a href="#">Brand Directory</a>
            </div>
            
            <div className="link-group">
              <h3>Services</h3>
              <a href="#">Personal Shopping</a>
              <a href="#">Gift Cards</a>
              <a href="#">Corporate Gifting</a>
              <a href="#">Bulk Orders</a>
            </div>
            
            <div className="link-group">
              <h3>Support</h3>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Returns & Exchanges</a>
              <a href="#">Size Guide</a>
            </div>
            
            <div className="link-group">
              <h3>Company</h3>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Sustainability</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Grievance Redressal</a>
            </div>
            <p className="copyright">© {new Date().getFullYear()} DesireDeal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Component */}
      <Chat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)}
        initialChatId={selectedChatId}
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
    </div>
  );
};

export default Dashboard;