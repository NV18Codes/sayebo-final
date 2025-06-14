
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { SearchBar } from './SearchBar';
import { useCart } from '../hooks/useCart';
import { MobileNav } from './ui/mobile-nav';

export const AmazonStyleHeader = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-sayebo-orange-900 to-sayebo-pink-900 text-white shadow-lg fixed top-0 w-full z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-sayebo-orange-800 to-sayebo-pink-800 py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center space-x-4">
            <span>🇿🇦 Deliver to South Africa</span>
            <span>|</span>
            <span>Free shipping on orders over R500</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline">Hello, {user.email}</span>
                {profile?.role === 'seller' && (
                  <>
                    <span className="hidden md:inline">|</span>
                    <Link to="/seller-dashboard" className="hover:underline">
                      Seller Dashboard
                    </Link>
                  </>
                )}
                {profile?.role === 'admin' && (
                  <>
                    <span className="hidden md:inline">|</span>
                    <Link to="/admin/dashboard" className="hover:underline">
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <span className="hidden md:inline">|</span>
                <button onClick={signOut} className="hover:underline">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Sign In</Link>
                <span className="hidden md:inline">|</span>
                <Link to="/register" className="hover:underline">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-sayebo-pink-300 to-sayebo-orange-300 bg-clip-text text-transparent">
              Sayebo
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="flex items-center space-x-1 hover:text-sayebo-pink-300 transition-colors">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="flex items-center space-x-1 hover:text-sayebo-pink-300 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-sayebo-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile navigation */}
          <MobileNav />
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-3">
          <SearchBar />
        </div>
      </div>

      {/* Navigation categories */}
      <nav className="bg-gradient-to-r from-sayebo-orange-700 to-sayebo-pink-700 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto">
            <Link to="/marketplace" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors flex items-center space-x-1">
              <Package className="w-4 h-4" />
              <span>All Products</span>
            </Link>
            <Link to="/category/Electronics" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Electronics</Link>
            <Link to="/category/Fashion" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Fashion</Link>
            <Link to="/category/Home & Garden" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Home & Garden</Link>
            <Link to="/category/Sports" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Sports</Link>
            <Link to="/category/Books" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Books</Link>
            <Link to="/category/Health & Beauty" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Health & Beauty</Link>
            <Link to="/category/Toys" className="whitespace-nowrap hover:text-sayebo-pink-300 transition-colors">Toys</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
