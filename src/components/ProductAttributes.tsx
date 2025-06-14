
import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface ProductAttribute {
  id: string;
  name: string;
  type: string;
  options: string[] | null;
  required: boolean;
  display_order: number;
}

interface ProductAttributeValue {
  attribute_id: string;
  value: string;
}

interface ProductAttributesProps {
  categoryId: string;
  productId?: string;
  values?: ProductAttributeValue[];
  onChange?: (values: ProductAttributeValue[]) => void;
  readOnly?: boolean;
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  categoryId,
  productId,
  values = [],
  onChange,
  readOnly = false
}) => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<ProductAttributeValue[]>(values);

  useEffect(() => {
    fetchAttributes();
  }, [categoryId]);

  useEffect(() => {
    if (productId) {
      fetchAttributeValues();
    }
  }, [productId]);

  const fetchAttributes = async () => {
    try {
      const { data, error } = await supabase
        .from('product_attributes')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        options: Array.isArray(item.options) ? item.options as string[] : null,
        required: item.required || false,
        display_order: item.display_order || 0
      }));
      
      setAttributes(transformedData);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const fetchAttributeValues = async () => {
    if (!productId) return;

    try {
      const { data, error } = await supabase
        .from('product_attribute_values')
        .select('attribute_id, value')
        .eq('product_id', productId);

      if (error) throw error;
      setAttributeValues(data || []);
    } catch (error) {
      console.error('Error fetching attribute values:', error);
    }
  };

  const handleValueChange = (attributeId: string, value: string) => {
    const newValues = attributeValues.filter(v => v.attribute_id !== attributeId);
    if (value) {
      newValues.push({ attribute_id: attributeId, value });
    }
    setAttributeValues(newValues);
    onChange?.(newValues);
  };

  const getAttributeValue = (attributeId: string) => {
    return attributeValues.find(v => v.attribute_id === attributeId)?.value || '';
  };

  const renderAttributeInput = (attribute: ProductAttribute) => {
    const value = getAttributeValue(attribute.id);

    switch (attribute.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleValueChange(attribute.id, e.target.value)}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 disabled:bg-gray-100"
            required={attribute.required}
          >
            <option value="">Select {attribute.name}</option>
            {attribute.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {attribute.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value.split(',').includes(option)}
                  onChange={(e) => {
                    const currentValues = value ? value.split(',') : [];
                    let newValues;
                    if (e.target.checked) {
                      newValues = [...currentValues, option];
                    } else {
                      newValues = currentValues.filter(v => v !== option);
                    }
                    handleValueChange(attribute.id, newValues.join(','));
                  }}
                  disabled={readOnly}
                  className="text-sayebo-pink-500"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={(e) => handleValueChange(attribute.id, e.target.checked ? 'true' : 'false')}
              disabled={readOnly}
              className="text-sayebo-pink-500"
            />
            <span className="text-sm">Yes</span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleValueChange(attribute.id, e.target.value)}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 disabled:bg-gray-100"
            required={attribute.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(attribute.id, e.target.value)}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 disabled:bg-gray-100"
            required={attribute.required}
          />
        );
    }
  };

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Product Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {attribute.name}
              {attribute.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderAttributeInput(attribute)}
          </div>
        ))}
      </div>
    </div>
  );
};
