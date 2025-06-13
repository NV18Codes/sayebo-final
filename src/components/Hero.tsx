
import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-peach-100" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Celebrate
              <span className="block bg-gradient-to-r from-pink-400 to-peach-300 bg-clip-text text-transparent">
                Women's Day
              </span>
              with Style
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Discover our exclusive collection of elegant and trendy fashion pieces crafted for the modern woman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/products" className="btn-primary">
                Shop Collection
              </Link>
              <Link to="/offers" className="btn-secondary">
                View Offers
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=700&fit=crop"
                alt="Women's Fashion"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
              />
              <div className="absolute -top-4 -right-4 bg-pink-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg animate-pulse">
                Up to 50% OFF
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-full font-semibold shadow-lg border border-pink-200">
                Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-peach-200 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute top-40 right-20 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}} />
    </section>
  );
};
