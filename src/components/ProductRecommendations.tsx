
import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/use-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductRecommendationsProps {
  title: string;
  currentProductId?: string;
  category?: string;
  limit?: number;
}

export const ProductRecommendations = ({ 
  title, 
  currentProductId, 
  category, 
  limit = 10 
}: ProductRecommendationsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [currentProductId, category]);

  const fetchRecommendations = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .limit(limit);

      // Exclude current product
      if (currentProductId) {
        query = query.neq('id', currentProductId);
      }

      // Filter by category if provided
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product.id, 1);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=300&fit=crop'}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <div className="p-3">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
                {product.title}
              </h4>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(4.5)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  R{product.price.toLocaleString()}
                </span>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="bg-orange-400 hover:bg-orange-500 text-white p-1 rounded transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/products${category ? `?category=${category}` : ''}`)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          See more recommendations →
        </button>
      </div>
    </div>
  );
};
