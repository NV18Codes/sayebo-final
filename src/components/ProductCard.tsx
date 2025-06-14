
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck } from 'lucide-react';

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
  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const isOnSale = product.discount_percentage && product.discount_percentage > 0;
  const isLowStock = product.stock < 10;
  const isFeatured = product.is_featured;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
        {isLowStock && (
          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
        <Heart className="w-4 h-4 text-gray-600 hover:text-sayebo-pink-500" />
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

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-sayebo-pink-600 transition-colors">
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
        <div className="flex items-center justify-between mb-4">
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

        {/* Add to Cart Button */}
        <button
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};
