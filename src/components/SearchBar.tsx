
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  image_url?: string;
  price: number;
  category: string;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for products...", 
  className = "" 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (onSearch) onSearch('');
      return;
    }
    setLoading(true);
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, image_url, price, category')
        .ilike('title', `%${query}%`)
        .limit(5);
      if (!error && data) {
        setSuggestions(data);
        setShowSuggestions(true);
        if (onSearch) onSearch(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setLoading(false);
    };
    const timeout = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);

  // Hide suggestions on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/marketplace?search=${encodeURIComponent(query.trim())}`);
      }
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false);
    setQuery(product.title);
    navigate(`/product/${product.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex-1 max-w-2xl ${className}`}> 
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-sayebo-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sayebo-pink-300 focus:border-transparent text-gray-900 placeholder-gray-500"
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute left-0 right-0 mt-2 bg-white border border-sayebo-pink-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto scrollbar-hide"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : (
              suggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-sayebo-pink-50 transition-colors"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=40&h=40&fit=crop'}
                    alt={product.title}
                    className="w-10 h-10 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{product.title}</div>
                    <div className="text-xs text-gray-500">{product.category}</div>
                  </div>
                  <div className="text-sm font-bold text-sayebo-pink-500 ml-2">R{product.price}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </form>
  );
};
