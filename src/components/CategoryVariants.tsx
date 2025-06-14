import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Plus, X, Edit2 } from 'lucide-react';

interface CategoryAttribute {
  id: string;
  name: string;
  type: string;
  options: string[] | null;
  required: boolean;
}

interface CategoryVariantsProps {
  category: string;
  onVariantsChange?: (variants: any[]) => void;
  existingVariants?: any[];
  readOnly?: boolean;
}

export const CategoryVariants: React.FC<CategoryVariantsProps> = ({
  category,
  onVariantsChange,
  existingVariants = [],
  readOnly = false
}) => {
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [variants, setVariants] = useState<any[]>(existingVariants);
  const [loading, setLoading] = useState(true);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariant, setNewVariant] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategoryAttributes();
  }, [category]);

  const fetchCategoryAttributes = async () => {
    try {
      // First get the category ID
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();

      if (categoryError) throw categoryError;

      // Then get attributes for this category
      const { data: attributesData, error: attributesError } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('display_order');

      if (attributesError) throw attributesError;

      const transformedAttributes = (attributesData || []).map(attr => ({
        id: attr.id,
        name: attr.name,
        type: attr.type,
        options: Array.isArray(attr.options) ? attr.options as string[] : null,
        required: attr.required || false
      }));

      setAttributes(transformedAttributes);
    } catch (error) {
      console.error('Error fetching category attributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    const variant = {
      id: Date.now().toString(),
      ...newVariant,
      stock: parseInt(newVariant.stock || '0'),
      price_adjustment: parseFloat(newVariant.price_adjustment || '0')
    };
    
    const updatedVariants = [...variants, variant];
    setVariants(updatedVariants);
    onVariantsChange?.(updatedVariants);
    setNewVariant({});
    setShowAddVariant(false);
  };

  const removeVariant = (variantId: string) => {
    const updatedVariants = variants.filter(v => v.id !== variantId);
    setVariants(updatedVariants);
    onVariantsChange?.(updatedVariants);
  };

  const getVariantLabel = (variant: any) => {
    return attributes
      .filter(attr => variant[attr.name])
      .map(attr => `${attr.name}: ${variant[attr.name]}`)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  if (attributes.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-500">No variants available for this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
        {!readOnly && (
          <button
            onClick={() => setShowAddVariant(true)}
            className="flex items-center space-x-2 bg-sayebo-pink-500 text-white px-4 py-2 rounded-lg hover:bg-sayebo-pink-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Variant</span>
          </button>
        )}
      </div>

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Current Variants:</h4>
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{getVariantLabel(variant)}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>Stock: {variant.stock || 0}</span>
                  <span>Price Adjustment: R{variant.price_adjustment || 0}</span>
                </div>
              </div>
              {!readOnly && (
                <button
                  onClick={() => removeVariant(variant.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Variant Form */}
      {showAddVariant && !readOnly && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4">Add New Variant</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attr) => (
              <div key={attr.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {attr.name}
                  {attr.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {attr.type === 'select' && attr.options ? (
                  <select
                    value={newVariant[attr.name] || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, [attr.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                    required={attr.required}
                  >
                    <option value="">Select {attr.name}</option>
                    {attr.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={attr.type === 'number' ? 'number' : 'text'}
                    value={newVariant[attr.name] || ''}
                    onChange={(e) => setNewVariant({ ...newVariant, [attr.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                    required={attr.required}
                  />
                )}
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                value={newVariant.stock || ''}
                onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Adjustment (R)</label>
              <input
                type="number"
                value={newVariant.price_adjustment || ''}
                onChange={(e) => setNewVariant({ ...newVariant, price_adjustment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={addVariant}
              className="bg-sayebo-pink-500 text-white px-6 py-2 rounded-lg hover:bg-sayebo-pink-600 transition-colors"
            >
              Add Variant
            </button>
            <button
              onClick={() => {
                setShowAddVariant(false);
                setNewVariant({});
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
