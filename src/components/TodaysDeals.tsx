
import { useState, useEffect } from 'react';
import { Clock, Star, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface Deal {
  id: string;
  title: string;
  original_price: number;
  sale_price: number;
  image_url: string;
  discount_percentage: number;
  ends_at: string;
  stock: number;
  claimed: number;
}

export const TodaysDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // For now, using mock data since we don't have a deals table yet
    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'Samsung Galaxy Smartphone - Limited Time Deal',
        original_price: 8999,
        sale_price: 6999,
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        discount_percentage: 22,
        ends_at: '2024-12-31T23:59:59',
        stock: 50,
        claimed: 35
      },
      {
        id: '2',
        title: 'Nike Running Shoes - Flash Sale',
        original_price: 1899,
        sale_price: 1299,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        discount_percentage: 32,
        ends_at: '2024-12-31T23:59:59',
        stock: 30,
        claimed: 18
      },
      {
        id: '3',
        title: 'MacBook Pro - Early Bird Special',
        original_price: 25999,
        sale_price: 21999,
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        discount_percentage: 15,
        ends_at: '2024-12-31T23:59:59',
        stock: 15,
        claimed: 8
      },
      {
        id: '4',
        title: 'Wireless Headphones - Today Only',
        original_price: 2999,
        sale_price: 1799,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        discount_percentage: 40,
        ends_at: '2024-12-31T23:59:59',
        stock: 100,
        claimed: 75
      }
    ];
    
    setDeals(mockDeals);
    setLoading(false);
  }, []);

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Deal Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m left`;
  };

  const getProgressPercentage = (claimed: number, stock: number) => {
    return Math.min((claimed / stock) * 100, 100);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="bg-gray-200 animate-pulse rounded-lg h-8 w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 text-white p-2 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
            <p className="text-gray-600">Limited time offers - Don't miss out!</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/offers')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          See all deals →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => navigate(`/product/${deal.id}`)}
            className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Deal Badge */}
            <div className="relative">
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold z-10">
                {deal.discount_percentage}% OFF
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
                <Clock className="w-3 h-3 inline mr-1" />
                {getTimeRemaining(deal.ends_at)}
              </div>
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
                {deal.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(4.5)</span>
              </div>

              {/* Pricing */}
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-600">
                    R{deal.sale_price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    R{deal.original_price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{deal.claimed} claimed</span>
                  <span>{deal.stock - deal.claimed} left</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(deal.claimed, deal.stock)}%` }}
                  ></div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
