
import { ProductRecommendations } from './ProductRecommendations';
import { TodaysDeals } from './TodaysDeals';
import { Categories } from './Categories';
import { Promotions } from './Promotions';
import { Hero } from './Hero';

export const AmazonStyleHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Today's Deals */}
        <TodaysDeals />

        {/* Categories */}
        <Categories />

        {/* Promotions */}
        <Promotions />

        {/* Product Recommendations */}
        <ProductRecommendations 
          title="Recommended for You" 
          limit={10}
        />

        <ProductRecommendations 
          title="Recently Viewed" 
          limit={5}
        />

        <ProductRecommendations 
          title="Best Sellers in Electronics" 
          category="Electronics"
          limit={8}
        />

        <ProductRecommendations 
          title="Fashion Picks for You" 
          category="Fashion"
          limit={8}
        />

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Stay Updated with Sayebo
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to get notified about new arrivals, exclusive offers, and special deals!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
