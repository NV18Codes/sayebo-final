
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X,
  MapPin,
  Truck,
  Phone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';

export const AmazonStyleHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 
    'Books', 'Beauty', 'Automotive', 'Groceries'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Deliver to South Africa</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Free delivery on orders over R500</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>Support: 0800-SAYEBO</span>
              </div>
              <Link to="/admin/login" className="hover:text-gray-300 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 bg-clip-text text-transparent">
                  Sayebo
                </h1>
                <p className="text-xs text-gray-500">South Africa's Marketplace</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex rounded-lg overflow-hidden border-2 border-sayebo-pink-200 focus-within:border-sayebo-pink-400">
                <select className="px-3 py-2 bg-gray-50 border-r text-sm focus:outline-none">
                  <option>All</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="flex-1 px-4 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/wishlist"
                  className="flex items-center space-x-1 text-gray-700 hover:text-sayebo-pink-500 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  <span className="hidden lg:block">Wishlist</span>
                </Link>
                
                <Link
                  to="/cart"
                  className="flex items-center space-x-1 text-gray-700 hover:text-sayebo-pink-500 transition-colors relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="hidden lg:block">Cart</span>
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-sayebo-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-sayebo-pink-500 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="hidden lg:block">Account</span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Orders
                      </Link>
                      <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Seller Dashboard
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sayebo-pink-600 border border-sayebo-pink-300 rounded-lg hover:bg-sayebo-pink-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white rounded-lg hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="hidden lg:flex items-center space-x-8 text-sm">
            {categories.map(category => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="text-gray-700 hover:text-sayebo-pink-600 transition-colors whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="p-4 space-y-4">
            {categories.map(category => (
              <Link
                key={category}
                to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="block text-gray-700 hover:text-sayebo-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
            
            {user && (
              <>
                <hr className="my-4" />
                <Link
                  to="/wishlist"
                  className="block text-gray-700 hover:text-sayebo-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  className="block text-gray-700 hover:text-sayebo-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart ({items.length})
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-sayebo-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-sayebo-pink-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
