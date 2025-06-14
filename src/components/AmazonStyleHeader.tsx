
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
    <header className="bg-white text-gray-800 shadow-lg fixed top-0 w-full z-50 border-b border-pink-100">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-pink-50 to-orange-50 py-2 border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center space-x-4 text-gray-600">
            <span>🇿🇦 Deliver to South Africa</span>
            <span>|</span>
            <span>Free shipping on orders over R500</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline text-gray-700">Hello, {user.email}</span>
                {profile?.role === 'seller' && (
                  <>
                    <span className="hidden md:inline text-gray-400">|</span>
                    <Link to="/seller-dashboard" className="hover:text-pink-600 transition-colors">
                      Seller Dashboard
                    </Link>
                  </>
                )}
                {profile?.role === 'admin' && (
                  <>
                    <span className="hidden md:inline text-gray-400">|</span>
                    <Link to="/admin/dashboard" className="hover:text-pink-600 transition-colors">
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <span className="hidden md:inline text-gray-400">|</span>
                <button onClick={signOut} className="hover:text-pink-600 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-pink-600 transition-colors">Sign In</Link>
                <span className="hidden md:inline text-gray-400">|</span>
                <Link to="/register" className="hover:text-pink-600 transition-colors">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4 bg-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              Sayebo
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="flex items-center space-x-1 hover:text-pink-500 transition-colors text-gray-700">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="flex items-center space-x-1 hover:text-pink-500 transition-colors relative text-gray-700">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
      <nav className="bg-gradient-to-r from-pink-100 to-orange-100 py-3 border-t border-pink-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 overflow-x-auto">
            <Link to="/marketplace" className="whitespace-nowrap hover:text-pink-600 transition-colors flex items-center space-x-1 text-gray-700">
              <Package className="w-4 h-4" />
              <span>All Products</span>
            </Link>
            <Link to="/category/Electronics" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Electronics</Link>
            <Link to="/category/Fashion" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Fashion</Link>
            <Link to="/category/Home & Garden" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Home & Garden</Link>
            <Link to="/category/Sports" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Sports</Link>
            <Link to="/category/Books" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Books</Link>
            <Link to="/category/Health & Beauty" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Health & Beauty</Link>
            <Link to="/category/Toys" className="whitespace-nowrap hover:text-pink-600 transition-colors text-gray-700">Toys</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
