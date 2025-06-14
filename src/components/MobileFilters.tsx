
import React from 'react';
import { X, Filter } from 'lucide-react';
import { CategoryFilter } from './CategoryFilter';
import { PriceFilter } from './PriceFilter';

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

export const MobileFilters = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange
}: MobileFiltersProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-sayebo-pink-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Categories</h3>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
          
          <div>
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={onPriceChange}
            />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white py-3 rounded-lg font-semibold hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-all duration-300"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
