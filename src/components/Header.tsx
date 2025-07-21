import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart, Shield, LogOut, Package, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useCart } from '../hooks/useCart';
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    user,
    signOut
  } = useAuth();
  const {
    profile
  } = useProfile();
  const {
    cartItems
  } = useCart();
  const navigate = useNavigate();
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
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
  return <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-pink-100">
      {/* Top promotional bar */}
      <div className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Free shipping on orders over R500 • Same day delivery in major cities
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with better spacing */}
          <Link to="/" className="flex items-center space-x-3 group mr-8">
            <div className="w-12 h-12 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 bg-clip-text text-transparent">
              Sayebo
            </span>
          </Link>

          {/* Desktop Navigation with proper spacing */}
          <nav className="hidden lg:flex items-center space-x-10 mr-8">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            <Link to="/marketplace" className="flex items-center space-x-2 text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium group">
              <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Marketplace</span>
            </Link>
            <Link to="/category/fashion" className="text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium relative group">
              <span>Fashion</span>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-sayebo-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/category/electronics" className="text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium relative group">
              <span>Electronics</span>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-sayebo-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/category/beauty" className="text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium relative group">
              <span>Beauty</span>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-sayebo-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Search Bar (Desktop) with improved spacing */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            
          </div>

          {/* Right Side Actions with improved spacing */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-3 text-gray-700 hover:text-sayebo-pink-500 transition-colors rounded-full hover:bg-sayebo-pink-50 group" title="Wishlist">
              <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-3 text-gray-700 hover:text-sayebo-pink-500 transition-colors rounded-full hover:bg-sayebo-pink-50 group" title="Shopping Cart">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>}
            </Link>

            {/* User Account */}
            {user ? <div className="relative">

                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-button flex items-center space-x-3 p-2 text-gray-700 hover:text-sayebo-pink-500 transition-colors rounded-full hover:bg-sayebo-pink-50 group">
                  <div className="w-9 h-9 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {profile && <span className="hidden md:block text-sm font-medium">
                      {profile.first_name}
                    </span>}
                </button>
                {/* Profile Dropdown */}
                {isProfileOpen && <div className="profile-dropdown absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-sayebo-pink-50 to-sayebo-orange-50">
                      <p className="text-sm font-semibold text-gray-800">{profile?.first_name} {profile?.last_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsProfileOpen(false)}>
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsProfileOpen(false)}>
                      <Package className="w-4 h-4 mr-3" />
                      My Orders
                    </Link>
                    {profile?.role === 'seller' && <Link to="/seller-dashboard" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Shield className="w-4 h-4 mr-3" />
                        Seller Dashboard
                      </Link>}
                    {profile?.role === 'admin' && <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Shield className="w-4 h-4 mr-3" />
                        Admin Dashboard
                      </Link>}
                    <hr className="my-2 border-gray-100" />
                    <button onClick={handleSignOut} className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>}
                  </div> : <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-sayebo-pink-500 transition-colors font-medium px-4 py-2 rounded-full hover:bg-sayebo-pink-50">
                  Sign In
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium transform hover:scale-105">
                  Sign Up
                </Link>
                </div>}
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-button lg:hidden p-2 text-gray-700 hover:text-sayebo-pink-500 transition-colors rounded-full hover:bg-sayebo-pink-50">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && <div className="mobile-menu lg:hidden border-t border-gray-200 py-4 bg-white shadow-lg rounded-b-xl">
            {/* Mobile Search */}
            <div className="px-4 pb-4">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search for products..." className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link to="/" className="flex items-center px-4 py-3 text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
              <Link to="/marketplace" className="flex items-center px-4 py-3 text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Package className="w-5 h-5 mr-3" />
                Marketplace
              </Link>
              <Link to="/category/fashion" className="block px-4 py-3 text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Fashion
              </Link>
              <Link to="/category/electronics" className="block px-4 py-3 text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Electronics
              </Link>
              <Link to="/category/beauty" className="block px-4 py-3 text-gray-700 hover:bg-sayebo-pink-50 hover:text-sayebo-pink-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Beauty
              </Link>
            </nav>
          </div>}
      </div>
    </header>;
};