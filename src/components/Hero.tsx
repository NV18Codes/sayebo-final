
import React from 'react';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-pink-50 overflow-hidden pt-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              South Africa's #1 Online Marketplace
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Shop Smart with{' '}
              <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                Sayebo
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover millions of products from trusted South African sellers. 
              From electronics to fashion, we've got everything you need delivered to your door.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/marketplace"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link 
                to="/seller-dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl border-2 border-orange-200 hover:bg-orange-50 transition-all duration-300"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          
          {/* Right Content - Hero Image/Stats */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">24h</h3>
                  <p className="text-gray-600">Fast Delivery</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">100%</h3>
                  <p className="text-gray-600">Secure Payment</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">50K+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900">1M+</h3>
                  <p className="text-gray-600">Products</p>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-200 rounded-full opacity-60 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Trust Indicators */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Sayebo?</h2>
            <p className="text-gray-600">Join millions of South Africans who trust us for their shopping needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery on orders over R500 across South Africa</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Buyer Protection</h3>
              <p className="text-gray-600">Your purchases are protected with our money-back guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Quality Products</h3>
              <p className="text-gray-600">Verified sellers and authentic products guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
