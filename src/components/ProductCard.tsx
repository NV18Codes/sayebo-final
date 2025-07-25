
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  discount_percentage?: number;
  is_featured?: boolean;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user) {
        setIsWishlisted(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('wishlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();
        setIsWishlisted(!!data);
      } catch {
        setIsWishlisted(false);
      }
    };
    checkWishlistStatus();
  }, [user, product.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        setIsWishlisted(false);
        toast({ title: 'Removed from wishlist', description: 'Item has been removed from your wishlist.' });
      } else {
        await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: product.id });
        setIsWishlisted(true);
        toast({ title: 'Added to wishlist', description: 'Item has been added to your wishlist.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update wishlist. Please try again.', variant: 'destructive' });
    }
  };

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const isOnSale = product.discount_percentage && product.discount_percentage > 0;
  const isLowStock = product.stock < 10;
  const isFeatured = product.is_featured;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isFeatured && (
          <span className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount_percentage}%
          </span>
        )}
        {isLowStock && product.stock > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        className={`absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-opacity duration-300 hover:bg-white ${isWishlisted ? 'text-sayebo-pink-500' : 'text-gray-600'}`}
        onClick={handleWishlistToggle}
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-sayebo-pink-500' : 'hover:text-sayebo-pink-500'}`} />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </Link>

      {/* Product Info - Flex grow to fill space */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-sayebo-pink-600 transition-colors min-h-[3rem]">
            {product.title}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>

        {/* Rating (placeholder) */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-4 h-4 fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">(4.5)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              R{discountedPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                R{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">Free delivery</span>
          </div>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Add to Cart Button - Push to bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
