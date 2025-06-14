
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductAttributes } from '../components/ProductAttributes';
import { ProductReviews } from '../components/ProductReviews';
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCw, ArrowLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  brand: string;
  condition: string;
  discount_percentage: number;
  is_featured: boolean;
  seller_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus();
    }
  }, [user, product]);

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

      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('name', data.category)
        .single();

      if (!categoryError && categoryData) {
        setCategory(categoryData);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive"
      });
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user || !product) return;

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
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    
    toast({
      title: "Added to cart",
      description: `${quantity} item(s) added to your cart`
    });
  };

  const handleWishlist = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist) {
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
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sayebo-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-sayebo-pink-400 font-medium">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-sayebo-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sayebo-pink-600 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/marketplace')} className="hover:text-sayebo-pink-500">
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Back to Products
          </button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-white shadow-lg relative">
              {product.is_featured && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Featured
                </div>
              )}
              {product.discount_percentage > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount_percentage}%
                </div>
              )}
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=700&fit=crop'} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <div className="text-sm text-sayebo-pink-400 font-medium mb-2 uppercase tracking-wide">
                  {product.brand}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  {product.discount_percentage > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-sayebo-pink-400">
                        R{discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        R{product.price.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        Save R{(product.price - discountedPrice).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-sayebo-pink-400">
                      R{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
                
                {product.condition && product.condition !== 'new' && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {product.condition}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Attributes */}
            {category && (
              <ProductAttributes
                categoryId={category.id}
                productId={product.id}
                readOnly={true}
              />
            )}

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
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Sold by</h4>
              <p className="text-gray-600">
                {product.profiles?.first_name} {product.profiles?.last_name}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white border-2 border-sayebo-pink-400 text-sayebo-pink-400 font-semibold py-3 px-6 rounded-lg hover:bg-sayebo-pink-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-sayebo-pink-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sayebo-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button 
                onClick={handleWishlist}
                className="p-3 border-2 border-gray-200 rounded-lg hover:border-sayebo-pink-200 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isInWishlist ? 'text-sayebo-pink-500 fill-sayebo-pink-500' : 'text-gray-400'}`} />
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

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
