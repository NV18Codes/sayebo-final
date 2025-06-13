
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Filter, Grid, List } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const ProductListing = () => {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('title');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0);

      if (category) {
        const categoryName = category.replace('-', ' ');
        query = query.ilike('category', `%${categoryName}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'title':
      default:
        return a.title.localeCompare(b.title);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-300 border-t-transparent"></div>
            <p className="mt-4 text-pink-400 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <main className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {category ? `${category.replace('-', ' ')} Collection` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover our beautiful collection of {products.length} items
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button className="flex items-center space-x-2 px-4 py-2 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="title">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-pink-400 text-white' 
                  : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-pink-400 text-white' 
                  : 'text-gray-400 hover:text-pink-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product, index) => (
            <div key={product.id} className="animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductListing;
