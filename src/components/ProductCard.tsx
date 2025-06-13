
import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Added to wishlist:', product.title);
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer card-hover"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop'}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-110"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-pink-400 hover:fill-pink-400 transition-colors" />
        </button>

        <div className="absolute top-3 left-3 bg-pink-400 text-white px-3 py-1 rounded-full text-sm font-medium">
          {product.category}
        </div>

        <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-pink-400 text-white py-2 rounded-lg font-medium hover:bg-pink-500 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            4.5 (128 reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-pink-400">
              R{product.price.toLocaleString()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
      </div>
    </div>
  );
};
