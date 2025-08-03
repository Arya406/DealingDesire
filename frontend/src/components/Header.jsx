import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-[var(--luxury-navy)] text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[var(--luxury-gold)]">
            GiftVault
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[var(--luxury-gold)] transition-colors">Home</Link>
            <Link to="/buyer" className="hover:text-[var(--luxury-gold)] transition-colors">Gift Cards</Link>
            <Link to="/seller" className="hover:text-[var(--luxury-gold)] transition-colors">Sell</Link>
            <Link to="#" className="hover:text-[var(--luxury-gold)] transition-colors">About</Link>
            <Link to="#" className="hover:text-[var(--luxury-gold)] transition-colors">Contact</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button className="bg-[var(--luxury-gold)] text-[var(--luxury-navy)] hover:bg-[var(--luxury-gold)]/90">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
