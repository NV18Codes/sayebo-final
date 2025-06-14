import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AmazonStyleHeader } from '../components/AmazonStyleHeader';
import { ProductReviews } from '../components/ProductReviews';
import { ProductRecommendations } from '../components/ProductRecommendations';
import { ProductAttributes } from '../components/ProductAttributes';
import { SellerDetails } from '../components/SellerDetails';
import { supabase } from '../integrations/supabase/client';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Share2,
  Minus,
  Plus,
  MapPin
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  seller_id: string;
  brand?: string;
  condition?: string;
  discount_percentage?: number;
  is_featured?: boolean;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .single();

      if (data) setIsWishlisted(true);
    } catch (error) {
      // Item not in wishlist
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
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

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      if (isWishlisted) {
        await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
        
        setIsWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist."
        });
      } else {
        await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
        
        setIsWishlisted(true);
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AmazonStyleHeader />
        <div className="pt-24 max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AmazonStyleHeader />
        <div className="pt-24 max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white px-6 py-3 rounded-lg hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  const isOnSale = product.discount_percentage && product.discount_percentage > 0;
  const isInStock = product.stock > 0;

  // Mock images array - in real app, this would come from the product data
  const productImages = [
    product.image_url || '/placeholder.svg',
    product.image_url || '/placeholder.svg',
    product.image_url || '/placeholder.svg'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AmazonStyleHeader />
      <main className="pt-4 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-sayebo-pink-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/marketplace')} className="hover:text-sayebo-pink-600">Products</button>
          <span>/</span>
          <button onClick={() => navigate(`/category/${product.category.toLowerCase()}`)} className="hover:text-sayebo-pink-600">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-sayebo-pink-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Title and Brand */}
            <div>
              {product.brand && (
                <p className="text-sm text-sayebo-pink-600 font-medium mb-1">{product.brand}</p>
              )}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.5)</span>
                </div>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  R{discountedPrice.toLocaleString()}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      R{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      -{product.discount_percentage}%
                    </span>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Attributes */}
            <ProductAttributes
              categoryId={product.category}
              productId={product.id}
              readOnly={true}
            />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="flex-1 bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isInStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-sayebo-pink-50 border-sayebo-pink-300 text-sayebo-pink-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-green-500" />
                <span>Free delivery on orders over R500</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Buyer protection guarantee</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-purple-500" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>

          {/* Seller Details Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SellerDetails sellerId={product.seller_id} />
            
            {/* Delivery Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Deliver to South Africa</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Standard Delivery: 3-5 business days</p>
                  <p>Express Delivery: 1-2 business days (+R50)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <ProductRecommendations 
            title="Related Products"
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
