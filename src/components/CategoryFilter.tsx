
import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  image_url?: string;
}

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange, className = '' }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, image_url')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className={className}>
      {/* Desktop Category Sidebar */}
      <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === '' 
                ? 'bg-pink-100 text-pink-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                selectedCategory === category.name 
                  ? 'bg-pink-100 text-pink-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.image_url && (
                <img 
                  src={category.image_url} 
                  alt={category.name}
                  className="w-6 h-6 rounded mr-3 object-cover"
                />
              )}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Category Dropdown */}
      <div className="lg:hidden">
        <div className="relative">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full bg-white border border-pink-200 rounded-lg px-4 py-2 text-left flex items-center justify-between"
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {selectedCategory || 'All Categories'}
            </span>
            <svg className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showMobileMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-pink-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              <button
                onClick={() => {
                  onCategoryChange('');
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                  selectedCategory === '' ? 'bg-pink-100 text-pink-600 font-medium' : ''
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.name);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center ${
                    selectedCategory === category.name ? 'bg-pink-100 text-pink-600 font-medium' : ''
                  }`}
                >
                  {category.image_url && (
                    <img 
                      src={category.image_url} 
                      alt={category.name}
                      className="w-6 h-6 rounded mr-3 object-cover"
                    />
                  )}
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
