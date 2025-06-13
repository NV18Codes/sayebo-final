
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Filter, Grid, List } from 'lucide-react';

// Mock products with South African market focus and ZAR pricing
const mockProducts = [
  {
    id: 1,
    name: 'African Print Dress',
    price: 899,
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=600&fit=crop',
    category: 'Dresses',
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    name: 'Boho Chic Blouse',
    price: 549,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=600&fit=crop',
    category: 'Tops',
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: 'Summer Maxi Dress',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=600&fit=crop',
    category: 'Dresses',
    rating: 4.8,
    reviews: 203
  },
  {
    id: 4,
    name: 'Floral Kaftan',
    price: 749,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=600&fit=crop',
    category: 'Traditional',
    rating: 4.3,
    reviews: 156
  },
  {
    id: 5,
    name: 'Designer Wrap Dress',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&h=600&fit=crop',
    category: 'Formal',
    rating: 4.9,
    reviews: 78
  },
  {
    id: 6,
    name: 'Cotton Palazzo Set',
    price: 899,
    image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=500&h=600&fit=crop',
    category: 'Sets',
    rating: 4.4,
    reviews: 112
  }
];

const ProductListing = () => {
  const { category } = useParams();
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    // Filter products by category if specified
    let filteredProducts = mockProducts;
    if (category) {
      const categoryName = category.replace('-', ' ');
      filteredProducts = mockProducts.filter(product => 
        product.category.toLowerCase().includes(categoryName.toLowerCase())
      );
    }
    
    setProducts(filteredProducts);
    setTimeout(() => setLoading(false), 800);
  }, [category]);

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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {category ? `${category.replace('-', ' ')} Collection` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover our beautiful collection of {products.length} items
          </p>
        </div>

        {/* Filters and View Controls */}
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
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
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

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product, index) => (
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
