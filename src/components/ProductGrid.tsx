
import React from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const ProductGrid = ({ 
  products, 
  loading = false, 
  emptyMessage = "No products found",
  className = "" 
}: ProductGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-5.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H1" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 ${className}`}>
      {products.map((product, index) => (
        <div key={product.id} className="animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};
