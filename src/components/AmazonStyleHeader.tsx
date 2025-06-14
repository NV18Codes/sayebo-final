
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, MapPin, Package, Heart, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useCart } from '../hooks/useCart';

export const AmazonStyleHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowMobileMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-pink-600 via-pink-500 to-orange-400 text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-pink-700 to-orange-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>🇿🇦 Free delivery across South Africa</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact" className="hover:text-orange-200 transition-colors">Customer Care</Link>
            <span>|</span>
            <Link to="/register" className="hover:text-orange-200 transition-colors">Become a Seller</Link>
            <span>|</span>
            <span className="text-orange-200">💳 Secure ZAR payments</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu(!showMobileMenu);
              }}
              className="md:hidden p-2 hover:bg-pink-600 rounded"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white text-pink-500 font-bold text-xl px-3 py-1 rounded-lg shadow-md">
                <Heart className="w-6 h-6 inline mr-1 fill-current" />
                Sayebo
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl mx-4">
            <form onSubmit={handleSearch} className="flex">
              <select className="bg-gray-100 text-gray-900 px-3 py-2 rounded-l-lg border-r border-gray-300 focus:outline-none">
                <option>All Categories</option>
                <option>Fashion & Style</option>
                <option>Electronics & Tech</option>
                <option>Home & Garden</option>
                <option>Beauty & Wellness</option>
                <option>Sports & Outdoors</option>
                <option>Books & Education</option>
                <option>Automotive</option>
                <option>Baby & Kids</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products across South Africa..."
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-r-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Language/Country */}
            <div className="hidden md:flex items-center space-x-1 hover:bg-pink-600 px-2 py-1 rounded cursor-pointer">
              <span className="text-sm">🇿🇦</span>
              <span className="text-sm">ZAR</span>
            </div>

            {/* User Account */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex flex-col items-start hover:bg-pink-600 px-2 py-1 rounded transition-colors"
              >
                <span className="text-xs">Hello, {user ? profile?.first_name || 'User' : 'Sign in'}</span>
                <span className="text-sm font-medium">My Account</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-900 rounded-lg shadow-xl border z-50">
                  {!user ? (
                    <div className="p-4">
                      <div className="flex space-x-2 mb-4">
                        <Link
                          to="/login"
                          className="flex-1 bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="flex-1 border border-pink-300 hover:bg-pink-50 px-4 py-2 rounded-lg text-center transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Register
                        </Link>
                      </div>
                      <div className="text-sm text-gray-600 text-center">
                        New to Sayebo? <Link to="/register" className="text-pink-600 hover:underline">Join us today!</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-2 border-b bg-gradient-to-r from-pink-50 to-orange-50">
                        <div className="font-medium">{profile?.first_name} {profile?.last_name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-pink-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-pink-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Orders
                        </Link>
                        {profile?.role === 'seller' && (
                          <Link
                            to="/seller"
                            className="block px-4 py-2 hover:bg-pink-50 transition-colors text-orange-600 font-medium"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        {profile?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 hover:bg-pink-50 transition-colors text-pink-600 font-medium"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 hover:bg-pink-50 transition-colors text-red-600"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Orders & Returns */}
            <Link
              to="/orders"
              className="hidden md:flex flex-col items-start hover:bg-pink-600 px-2 py-1 rounded transition-colors"
            >
              <span className="text-xs">Returns</span>
              <span className="text-sm font-medium">& Orders</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center hover:bg-pink-600 p-2 rounded transition-colors"
            >
              <Heart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center hover:bg-pink-600 p-2 rounded transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
              <span className="hidden md:block ml-1 text-sm">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gradient-to-r from-pink-600 to-orange-400">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-6 py-2 text-sm overflow-x-auto">
            <Link to="/products" className="whitespace-nowrap hover:text-orange-200 transition-colors flex items-center space-x-1">
              <Menu className="w-4 h-4" />
              <span>All Products</span>
            </Link>
            <Link to="/category/fashion-style" className="whitespace-nowrap hover:text-orange-200 transition-colors">Fashion & Style</Link>
            <Link to="/category/electronics-tech" className="whitespace-nowrap hover:text-orange-200 transition-colors">Electronics & Tech</Link>
            <Link to="/category/home-garden" className="whitespace-nowrap hover:text-orange-200 transition-colors">Home & Garden</Link>
            <Link to="/category/beauty-wellness" className="whitespace-nowrap hover:text-orange-200 transition-colors">Beauty & Wellness</Link>
            <Link to="/category/sports-outdoors" className="whitespace-nowrap hover:text-orange-200 transition-colors">Sports & Outdoors</Link>
            <Link to="/offers" className="whitespace-nowrap hover:text-orange-200 transition-colors text-orange-200 font-medium">🔥 Today's Deals</Link>
            <Link to="/category/automotive" className="whitespace-nowrap hover:text-orange-200 transition-colors">Automotive</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-pink-600 border-t border-pink-500">
          <nav className="px-4 py-4 space-y-3">
            <Link to="/products" className="block py-2 hover:text-orange-200 transition-colors">All Products</Link>
            <Link to="/category/fashion-style" className="block py-2 hover:text-orange-200 transition-colors">Fashion & Style</Link>
            <Link to="/category/electronics-tech" className="block py-2 hover:text-orange-200 transition-colors">Electronics & Tech</Link>
            <Link to="/category/home-garden" className="block py-2 hover:text-orange-200 transition-colors">Home & Garden</Link>
            <Link to="/category/beauty-wellness" className="block py-2 hover:text-orange-200 transition-colors">Beauty & Wellness</Link>
            <Link to="/offers" className="block py-2 hover:text-orange-200 transition-colors">🔥 Today's Deals</Link>
            {user && profile?.role === 'seller' && (
              <Link to="/seller" className="block py-2 hover:text-orange-200 transition-colors">Seller Dashboard</Link>
            )}
            <Link to="/contact" className="block py-2 hover:text-orange-200 transition-colors">Customer Care</Link>
          </nav>
        </div>
      )}
    </header>
  );
};
