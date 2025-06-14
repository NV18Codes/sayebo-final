
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useCart } from '../hooks/useCart';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-button')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-[#FFDAB9] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
              Sayebo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/marketplace" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Marketplace
            </Link>
            <Link to="/category/fashion" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Fashion
            </Link>
            <Link to="/category/electronics" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Electronics
            </Link>
            <Link to="/category/beauty" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Beauty
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              Offers
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-400 transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-700 hover:text-pink-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="profile-button flex items-center space-x-2 p-2 text-gray-700 hover:text-pink-400 transition-colors"
                >
                  <User className="w-6 h-6" />
                  {profile && (
                    <span className="hidden md:block text-sm font-medium">
                      {profile.first_name}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4 inline mr-2" />
                      My Orders
                    </Link>
                    {profile?.role === 'seller' && (
                      <Link
                        to="/seller"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Seller Dashboard
                      </Link>
                    )}
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-400 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-400 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-button md:hidden p-2 text-gray-700 hover:text-pink-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/category/fashion"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link
                to="/category/electronics"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                to="/category/beauty"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Beauty
              </Link>
              <Link
                to="/offers"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
