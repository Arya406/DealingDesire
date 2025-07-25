import React, { useState } from 'react';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiChevronRight, 
  FiCreditCard, 
  FiDollarSign, 
  FiClock, 
  FiShield, 
  FiArrowRight, 
  FiZap, 
  FiGift 
} from 'react-icons/fi';
import { FaTruck, FaShieldAlt, FaHeadset, FaGift as FaGiftSolid, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { HiOutlineMail, HiOutlineArrowRight } from 'react-icons/hi';

import './Home.css';

const home = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="home">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <h2>DesireDeal</h2>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#" className="active">Home</a>
            <a href="#">Shop</a>
            <a href="#">Categories</a>
            <a href="#">Deals</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          
          <div className="nav-actions">
            <div className="search-box">
              <input type="text" placeholder="Search products..." />
              <FiSearch className="search-icon" />
            </div>
            <button className="cart-btn">
              <FiShoppingCart />
              <span className="cart-count">0</span>
            </button>
            <button className="account-btn">
              <FiUser />
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <span className="hero-badge">TRUSTED PLATFORM</span>
              <h1>Your Trusted Marketplace for <span className="highlight">Gift Cards</span> & <span className="highlight">Vouchers</span></h1>
              <p className="hero-subtitle">Get the best exchange rates with instant payments. Join over 500,000+ satisfied users who trust us with their transactions.</p>
              <div className="cta-buttons">
                <a href="#buy" className="btn btn-primary">
                  <span>Buy Gift Cards</span>
                  <FiArrowRight className="btn-icon" />
                </a>
                <a href="#sell" className="btn btn-outline">
                  <span>Sell Gift Cards</span>
                  <FiDollarSign className="btn-icon" />
                </a>
              </div>
              <div className="trust-badges">
                <div className="trust-item">
                  <FiShield className="trust-icon" />
                  <span>100% Secure</span>
                </div>
                <div className="trust-item">
                  <FiZap className="trust-icon" />
                  <span>Instant Payment</span>
                </div>
                <div className="trust-item">
                  <FiClock className="trust-icon" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="floating-card card-1">
                <div className="card-content">
                  <div className="card-icon">
                    <FiGift />
                  </div>
                  <div className="card-details">
                    <span className="card-label">Amazon Gift Card</span>
                    <div className="card-amount">$100.00</div>
                  </div>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-content">
                  <div className="card-icon">
                    <FiCreditCard />
                  </div>
                  <div className="card-details">
                    <span className="card-label">iTunes Card</span>
                    <div className="card-amount">$50.00</div>
                  </div>
                </div>
              </div>
              <div className="hero-illustration">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Best Rates</h3>
            <p>Get the best exchange rates in the market</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Payments</h3>
            <p>Receive payments instantly to your account</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Transactions</h3>
            <p>Bank-level security for all transactions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Global Support</h3>
            <p>24/7 customer support worldwide</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="category-grid">
            {[
              { name: 'Amazon', icon: '🛍️' },
              { name: 'iTunes', icon: '🎵' },
              { name: 'Google Play', icon: '▶️' },
              { name: 'Steam', icon: '🎮' },
              { name: 'Netflix', icon: '🎬' },
              { name: 'PlayStation', icon: '🎮' },
              { name: 'Xbox', icon: '🎮' },
              { name: 'Uber', icon: '🚗' }
            ].map((category, index) => (
              <div className="category-card" key={index}>
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>View Deals <FiChevronRight /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Select Your Card</h3>
              <p>Choose from our wide range of gift cards and vouchers</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Make Payment</h3>
              <p>Complete your purchase securely in seconds</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Your Code</h3>
              <p>Receive your code instantly via email</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted-by">
        <div className="container">
          <p className="trusted-by-text">Trusted by leading companies worldwide</p>
          <div className="trust-logos">
            {['Amazon', 'Google', 'Microsoft', 'PayPal', 'Visa'].map((company, i) => (
              <div className="trust-logo" key={i}>{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonial-grid">
            {[
              { 
                text: "Fast and reliable service! Got my Amazon gift card code instantly after payment.", 
                author: "John D.", 
                rating: 5 
              },
              { 
                text: "Best rates I've found online. Will definitely be using this service again.", 
                author: "Sarah M.", 
                rating: 5 
              },
              { 
                text: "Customer support was very helpful when I had an issue with my order.", 
                author: "Michael T.", 
                rating: 4 
              }
            ].map((testimonial, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={j < testimonial.rating ? 'filled' : ''}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-about">
              <h3>DesireDeal</h3>
              <p>Your one-stop shop for amazing deals and quality products.</p>
              <div className="social-links">
                <a href="#">FB</a>
                <a href="#">TW</a>
                <a href="#">IG</a>
                <a href="#">YT</a>
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Return & Refund</a></li>
                <li><a href="#">Track Order</a></li>
                <li><a href="#">Size Guide</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>Email: info@desiredeal.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Shopping St, Retail City, 10001</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} DesireDeal. All rights reserved.</p>
            <div className="payment-methods">
              <span>We accept:</span>
              <span className="payment-icon">Visa</span>
              <span className="payment-icon">MC</span>
              <span className="payment-icon">PP</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default home;