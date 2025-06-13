
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: 'Elegant Floral Dress',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop',
    category: 'Dresses',
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    name: 'Casual Pink Blouse',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop',
    category: 'Tops',
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: 'Summer Maxi Dress',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=600&fit=crop',
    category: 'Dresses',
    rating: 4.8,
    reviews: 203
  },
  {
    id: 4,
    name: 'Floral Print Kurti',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=600&fit=crop',
    category: 'Ethnic',
    rating: 4.3,
    reviews: 156
  },
  {
    id: 5,
    name: 'Designer Saree',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&h=600&fit=crop',
    category: 'Ethnic',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 6,
    name: 'Cotton Palazzo Set',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=500&h=600&fit=crop',
    category: 'Sets',
    rating: 4.4,
    reviews: 112
  }
];

const Index = () => {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
              Discover our handpicked collection of trendy and elegant pieces perfect for the modern woman
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
            {products.map((product, index) => (
              <div key={product.id} style={{animationDelay: `${index * 0.1}s`}}>
                <ProductCard product={product} />
              </div>
            ))}
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
