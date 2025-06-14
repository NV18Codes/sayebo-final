
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
  className?: string;
}

export const CategorySelector = ({ value, onChange, className = '' }: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    }
  };

  const handleCategoryChange = (selectedValue: string) => {
    if (selectedValue === 'other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      onChange(selectedValue);
    }
  };

  const handleCustomCategorySubmit = async () => {
    if (!customCategory.trim()) return;

    setLoading(true);
    try {
      // Check if category already exists
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('name')
        .ilike('name', customCategory.trim())
        .single();

      if (existingCategory) {
        onChange(customCategory.trim());
        setShowCustomInput(false);
        setCustomCategory('');
        toast({
          title: "Category selected",
          description: "Using existing category."
        });
        return;
      }

      // Create new category
      const { error } = await supabase
        .from('categories')
        .insert({
          name: customCategory.trim(),
          description: `Custom category added by seller`,
          is_active: true
        });

      if (error) throw error;

      onChange(customCategory.trim());
      setShowCustomInput(false);
      setCustomCategory('');
      fetchCategories(); // Refresh the list

      toast({
        title: "New category created",
        description: "Your category has been added and is pending admin approval."
      });

    } catch (error: any) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <select
        value={showCustomInput ? 'other' : value}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        required
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
        <option value="other">Other (Add new category)</option>
      </select>

      {showCustomInput && (
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter new category name"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            onKeyPress={(e) => e.key === 'Enter' && handleCustomCategorySubmit()}
          />
          <button
            type="button"
            onClick={handleCustomCategorySubmit}
            disabled={loading || !customCategory.trim()}
            className="px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomCategory('');
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
