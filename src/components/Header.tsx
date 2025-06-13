
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-peach-200 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-peach-300 bg-clip-text text-transparent">
              Sayebo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-pink-400 transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-pink-400 transition-colors">
              Categories
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-pink-400 transition-colors">
              Offers
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-400 transition-colors">
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, brands..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-pink-400 transition-colors relative">
              <Heart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/cart')}
              className="text-gray-700 hover:text-pink-400 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="text-gray-700 hover:text-pink-400 transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
                  <div className="py-2">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors"
                    >
                      Register
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors"
                    >
                      My Orders
                    </Link>
                    <hr className="my-2" />
                    <Link
                      to="/seller"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-400 transition-colors"
                    >
                      Become a Seller
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-pink-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 animate-slideIn">
            <div className="flex flex-col space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              
              <Link to="/products" className="text-gray-700 hover:text-pink-400 transition-colors">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-pink-400 transition-colors">
                Categories
              </Link>
              <Link to="/offers" className="text-gray-700 hover:text-pink-400 transition-colors">
                Offers
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-pink-400 transition-colors">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
