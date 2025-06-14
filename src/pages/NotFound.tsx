
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <Header />
      <main className="pt-20">
        <ResponsiveContainer className="py-16">
          <div className="text-center max-w-2xl mx-auto">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-bold text-sayebo-pink-200 mb-4">404</div>
              <div className="w-24 h-24 mx-auto bg-sayebo-orange-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-sayebo-orange-500" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Oops! Page not found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-sayebo-pink-500 text-white rounded-lg hover:bg-sayebo-pink-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home Page
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-sayebo-orange-500 text-white rounded-lg hover:bg-sayebo-orange-600 transition-colors"
              >
                <Search className="w-5 h-5" />
                Browse Products
              </button>
            </div>

            {/* Popular Links */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Pages</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-sayebo-pink-500 font-medium">Marketplace</div>
                  <div className="text-sm text-gray-600">Browse all products</div>
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-sayebo-pink-500 font-medium">Cart</div>
                  <div className="text-sm text-gray-600">View your cart</div>
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-sayebo-pink-500 font-medium">Wishlist</div>
                  <div className="text-sm text-gray-600">Saved items</div>
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="text-sayebo-pink-500 font-medium">Contact</div>
                  <div className="text-sm text-gray-600">Get help</div>
                </button>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
    </div>
  );
};

export default NotFound;
