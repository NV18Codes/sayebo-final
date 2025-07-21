
{/* Newsletter/promotions 
import { useState, useEffect } from 'react';
import { Tag, Clock, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  code?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  banner_image?: string;
}

export const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      // For now, we'll use mock data since promotions table doesn't exist yet
      const mockPromotions: Promotion[] = [
        {
          id: '1',
          title: 'Heritage Day Special',
          description: 'Celebrate Heritage Day with 25% off all traditional wear',
          discount_type: 'percentage',
          discount_value: 25,
          code: 'HERITAGE25',
          start_date: '2024-09-20',
          end_date: '2024-09-30',
          is_active: true,
          banner_image: 'https://images.unsplash.com/photo-1594736797933-d0301ba2d4b3?w=800&h=400&fit=crop'
        },
        {
          id: '2',
          title: 'Youth Month Deals',
          description: 'Youth power! Get up to R500 off electronics',
          discount_type: 'fixed',
          discount_value: 500,
          start_date: '2024-06-01',
          end_date: '2024-06-30',
          is_active: true,
          banner_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop'
        },
        {
          id: '3',
          title: 'Spring Day Flash Sale',
          description: '24-hour flash sale with massive discounts',
          discount_type: 'percentage',
          discount_value: 40,
          start_date: '2024-09-01',
          end_date: '2024-09-01',
          is_active: true,
          banner_image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=400&fit=crop'
        }
      ];
      
      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days left`;
    return `${hours} hours left`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Current Promotions</h2>
        <div className="flex items-center space-x-2 text-pink-400">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">Hot Deals</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promotions.map((promotion) => (
          <div
            key={promotion.id}
            className="relative bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {promotion.banner_image && (
              <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${promotion.banner_image})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute top-4 left-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {promotion.discount_type === 'percentage' 
                      ? `${promotion.discount_value}% OFF`
                      : `R${promotion.discount_value} OFF`
                    }
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getTimeRemaining(promotion.end_date)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {promotion.title}
                </h3>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              
              <p className="text-gray-600 mb-4">
                {promotion.description}
              </p>
              
              {promotion.code && (
                <div className="flex items-center space-x-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Use code:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-pink-600">
                    {promotion.code}
                  </code>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Valid until {new Date(promotion.end_date).toLocaleDateString('en-ZA')}
                </div>
                <button className="btn-primary text-sm px-4 py-2">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-6 border">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Never Miss a Deal!
          </h3>
          <p className="text-gray-600 mb-4">
            Subscribe to get notified about flash sales, Heritage Day specials, and exclusive South African deals.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button className="btn-primary rounded-l-none">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
*/}