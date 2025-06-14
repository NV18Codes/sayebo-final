
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ProductGrid } from '../components/ProductGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import { PriceFilter } from '../components/PriceFilter';
import { MobileFilters } from '../components/MobileFilters';
import { SearchBar } from '../components/SearchBar';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  stock: number;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('newest');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm, priceRange, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .gt('stock', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      
      // Set initial price range based on products
      if (data && data.length > 0) {
        const prices = data.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sayebo-pink-500 via-sayebo-orange-400 to-sayebo-pink-400 text-white py-8 sm:py-16">
          <ResponsiveContainer>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Discover Amazing Products
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
                Shop from our curated collection of quality products from trusted sellers across South Africa
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  onSearch={setSearchTerm}
                  placeholder="Search for products, categories..."
                  className="w-full"
                />
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        <ResponsiveContainer className="py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
                
                <div>
                  <PriceFilter
                    minPrice={0}
                    maxPrice={Math.max(...products.map(p => p.price), 10000)}
                    onPriceChange={handlePriceChange}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-sayebo-pink-200 hover:bg-sayebo-pink-50 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-600">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-sayebo-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              <ProductGrid
                products={filteredProducts}
                loading={loading}
                emptyMessage={
                  searchTerm || selectedCategory
                    ? 'No products match your search criteria'
                    : 'No products available'
                }
              />
            </div>
          </div>
        </ResponsiveContainer>

        {/* Mobile Filters Modal */}
        <MobileFilters
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setShowMobileFilters(false);
          }}
          minPrice={0}
          maxPrice={Math.max(...products.map(p => p.price), 10000)}
          onPriceChange={handlePriceChange}
        />
      </main>
    </div>
  );
};

export default Marketplace;
