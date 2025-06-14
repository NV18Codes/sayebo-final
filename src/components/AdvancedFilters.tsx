
import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface FilterOption {
  id: string;
  name: string;
  type: string;
  options: string[] | null;
}

interface ActiveFilter {
  attributeId: string;
  name: string;
  value: string;
}

interface AdvancedFiltersProps {
  categories: string[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  categories,
  onFiltersChange,
  className = ""
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      fetchFilterOptions();
    }
  }, [categories]);

  const fetchFilterOptions = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id')
        .in('name', categories);

      if (categoriesError) throw categoriesError;

      const categoryIds = categoriesData.map(c => c.id);

      const { data, error } = await supabase
        .from('product_attributes')
        .select('*')
        .in('category_id', categoryIds)
        .order('display_order');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        options: Array.isArray(item.options) ? item.options as string[] : null
      }));
      
      setFilterOptions(transformedData);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (attributeId: string, attributeName: string, value: string) => {
    const newFilters = activeFilters.filter(f => f.attributeId !== attributeId);
    if (value) {
      newFilters.push({ attributeId, name: attributeName, value });
    }
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const removeFilter = (attributeId: string) => {
    const newFilters = activeFilters.filter(f => f.attributeId !== attributeId);
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFiltersChange([]);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-700 hover:text-sayebo-pink-500 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Advanced Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="p-4 space-y-4">
          {filterOptions.map((option) => (
            <div key={option.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {option.name}
              </label>
              
              {option.type === 'select' && option.options ? (
                <select
                  onChange={(e) => handleFilterChange(option.id, option.name, e.target.value)}
                  value={activeFilters.find(f => f.attributeId === option.id)?.value || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                >
                  <option value="">All {option.name}</option>
                  {option.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  onChange={(e) => handleFilterChange(option.id, option.name, e.target.value)}
                  value={activeFilters.find(f => f.attributeId === option.id)?.value || ''}
                  placeholder={`Filter by ${option.name.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Active Filters</span>
            <button
              onClick={clearAllFilters}
              className="text-sm text-sayebo-pink-500 hover:text-sayebo-pink-600"
            >
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.attributeId}
                className="bg-sayebo-pink-100 text-sayebo-pink-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
              >
                <span>{filter.name}: {filter.value}</span>
                <button
                  onClick={() => removeFilter(filter.attributeId)}
                  className="hover:text-sayebo-pink-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
