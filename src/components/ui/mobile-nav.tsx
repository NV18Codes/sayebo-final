
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../hooks/useCart';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold gradient-text">Menu</h2>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link
                to="/marketplace"
                onClick={toggleMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Marketplace</span>
              </Link>
              
              <Link
                to="/cart"
                onClick={toggleMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Cart</span>
                {cartItems.length > 0 && (
                  <span className="bg-sayebo-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              
              <Link
                to="/wishlist"
                onClick={toggleMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Wishlist</span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={toggleMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                  >
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">Sign In</span>
                  </Link>
                  
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-all"
                  >
                    <span className="font-medium">Create Account</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
