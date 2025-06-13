
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Pink');
  const [loading, setLoading] = useState(true);

  // Mock product data - in real app, this would come from Supabase
  const product = {
    id: parseInt(id || '1'),
    name: 'Elegant Floral Dress',
    price: 899,
    originalPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=700&fit=crop',
      'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=700&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=700&fit=crop'
    ],
    category: 'Dresses',
    rating: 4.5,
    reviews: 127,
    description: 'Beautiful floral dress perfect for the modern South African woman. Made with premium cotton blend fabric, this dress combines comfort with style. Perfect for casual outings or special occasions.',
    features: [
      'Premium cotton blend fabric',
      'Machine washable',
      'Available in multiple sizes',
      'Designed in South Africa',
      'Sustainable fashion'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Peach', 'White', 'Light Blue'],
    inStock: true,
    stockCount: 15
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleAddToCart = () => {
    console.log('Added to cart:', { 
      product: product.name, 
      quantity, 
      size: selectedSize, 
      color: selectedColor 
    });
    // In real app, this would update Supabase cart
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-pink-400 font-medium">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-pink-400 font-medium mb-2">{product.category}</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-pink-400">
                  R{product.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  R{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  31% OFF
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-600">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Size</h3>
              <div className="flex space-x-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-pink-400 bg-pink-50 text-pink-400'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                      selectedColor === color
                        ? 'border-pink-400 bg-pink-50 text-pink-400'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stockCount} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-pink-400 text-pink-400 font-semibold py-3 px-6 rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-pink-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pink-500 transition-colors"
              >
                Buy Now
              </button>
              <button className="p-3 border-2 border-gray-200 rounded-lg hover:border-pink-200 transition-colors">
                <Heart className="w-6 h-6 text-gray-400 hover:text-pink-400" />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-lg p-4 space-y-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Free shipping on orders over R500</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">1 year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
