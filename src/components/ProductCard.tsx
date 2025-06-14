
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Badge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  brand?: string;
  condition?: string;
  discount_percentage?: number;
  is_featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
    fetchReviewStats();
  }, [user, product.id]);

  const checkWishlistStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking wishlist:', error);
        return;
      }

      setIsInWishlist(!!data);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      setIsInWishlist(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', product.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(avg);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;

        setIsInWishlist(false);
        toast({
          title: "Removed from wishlist",
          description: "Product removed from your wishlist"
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: product.id
          });

        if (error) throw error;

        setIsInWishlist(true);
        toast({
          title: "Added to wishlist",
          description: "Product added to your wishlist"
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div 
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer card-hover relative"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {product.is_featured && (
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </span>
        )}
        {product.discount_percentage && product.discount_percentage > 0 && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{product.discount_percentage}%
          </span>
        )}
        {product.condition && product.condition !== 'new' && (
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
            {product.condition}
          </span>
        )}
      </div>

      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop'}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-110"
        >
          <Heart className={`w-5 h-5 transition-colors ${
            isInWishlist 
              ? 'text-sayebo-pink-500 fill-sayebo-pink-500' 
              : 'text-gray-400 hover:text-sayebo-pink-400 hover:fill-sayebo-pink-400'
          }`} />
        </button>

        <div className="absolute top-3 left-3 bg-sayebo-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </div>

        <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-sayebo-pink-400 text-white py-2 rounded-lg font-medium hover:bg-sayebo-pink-500 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
        )}
        
        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-sayebo-pink-400 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        {reviewCount > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {averageRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.discount_percentage && product.discount_percentage > 0 ? (
              <>
                <span className="text-2xl font-bold text-sayebo-pink-400">
                  R{discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  R{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-sayebo-pink-400">
                R{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
      </div>
    </div>
  );
};
