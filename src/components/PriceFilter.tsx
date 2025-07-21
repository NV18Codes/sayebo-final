
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  className?: string;
}

export const PriceFilter = ({ minPrice, maxPrice, onPriceChange, className = "" }: PriceFilterProps) => {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onPriceChange(value[0], value[1]);
  };

  return (
    <div className={`hidden lg:block w-64 bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        Price Range
      </h3>
      <Slider
        value={priceRange}
        onValueChange={handlePriceChange}
        max={maxPrice}
        min={minPrice}
        step={10}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>R{priceRange[0]}</span>
        <span>R{priceRange[1]}</span>
      </div>
    </div>
  );
};
