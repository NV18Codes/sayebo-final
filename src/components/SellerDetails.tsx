
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Star, MapPin, Shield, Clock, MessageCircle } from 'lucide-react';

interface SellerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface SellerDetailsProps {
  sellerId: string;
}

export const SellerDetails: React.FC<SellerDetailsProps> = ({ sellerId }) => {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerStats, setSellerStats] = useState({
    totalProducts: 0,
    rating: 4.5,
    totalSales: 0,
    joinDate: '',
  });

  useEffect(() => {
    fetchSellerDetails();
  }, [sellerId]);

  const fetchSellerDetails = async () => {
    try {
      // Fetch seller profile
      const { data: sellerData, error: sellerError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .eq('role', 'seller')
        .single();

      if (sellerError) throw sellerError;
      setSeller(sellerData);

      // Fetch seller statistics
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', sellerId);

      if (productsError) throw productsError;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          total_amount,
          order_items!inner(
            product_id,
            products!inner(seller_id)
          )
        `)
        .eq('order_items.products.seller_id', sellerId);

      if (ordersError) throw ordersError;

      setSellerStats({
        totalProducts: productsData?.length || 0,
        rating: 4.5, // Placeholder - would calculate from reviews
        totalSales: ordersData?.length || 0,
        joinDate: sellerData?.created_at || '',
      });

    } catch (error) {
      console.error('Error fetching seller details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-500">Seller information not available</p>
      </div>
    );
  }

  const memberSince = new Date(sellerStats.joinDate).getFullYear();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Seller Information</h3>
      
      <div className="space-y-4">
        {/* Seller Name */}
        <div>
          <h4 className="font-medium text-gray-900">
            {seller.first_name} {seller.last_name}
          </h4>
          <p className="text-sm text-gray-500">Professional Seller</p>
        </div>

        {/* Seller Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{sellerStats.rating}</span>
            </div>
            <p className="text-xs text-gray-500">Seller Rating</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">{sellerStats.totalProducts}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">{sellerStats.totalSales}</p>
            <p className="text-xs text-gray-500">Sales</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">{memberSince}</p>
            <p className="text-xs text-gray-500">Member Since</p>
          </div>
        </div>

        {/* Seller Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Verified Seller
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Fast Shipping
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Ships from South Africa</span>
        </div>

        {/* Contact Seller Button */}
        <button className="w-full mt-4 flex items-center justify-center space-x-2 bg-sayebo-pink-50 text-sayebo-pink-600 py-2 px-4 rounded-lg hover:bg-sayebo-pink-100 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>Contact Seller</span>
        </button>
      </div>
    </div>
  );
};
