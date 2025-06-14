
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
          <p className="mt-4 text-pink-400 font-medium">Loading Sayebo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-16">
        <Hero />
        <Categories />
        
        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of trendy and elegant pieces perfect for the modern South African woman
            </p>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
              {products.map((product, index) => (
                <div key={product.id} style={{animationDelay: `${index * 0.1}s`}}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-6">No products available at the moment.</p>
              <p className="text-gray-400">Check back soon for new arrivals!</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              View All Products
            </button>
          </div>
        </section>

        {/* Why Choose Sayebo */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose Sayebo?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the best online shopping designed for South African women
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Products</h3>
                <p className="text-gray-600">Carefully curated products from trusted sellers across South Africa</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>  
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable delivery to your doorstep nationwide</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Women-Focused</h3>
                <p className="text-gray-600">Designed specifically for South African women's needs and preferences</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="peach-gradient py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Stay Updated with Sayebo
            </h3>
            <p className="text-gray-600 mb-8">
              Subscribe to get notified about new arrivals, exclusive offers, and Women's Day specials!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
