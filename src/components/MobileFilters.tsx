
import React from 'react';
import { X } from 'lucide-react';
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
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

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-sayebo-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-sayebo-pink-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
