
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: 'Fashion & Style',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    count: '2,500+ items',
    description: 'Trendy fashion for every occasion'
  },
  {
    id: 2,
    name: 'Electronics & Tech',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=300&fit=crop',
    count: '1,800+ items',
    description: 'Latest gadgets and electronics'
  },
  {
    id: 3,
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    count: '3,200+ items',
    description: 'Beautiful home essentials'
  },
  {
    id: 4,
    name: 'Beauty & Wellness',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop',
    count: '1,500+ items',
    description: 'Self-care and beauty products'
  },
  {
    id: 5,
    name: 'Sports & Outdoors',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    count: '900+ items',
    description: 'Active lifestyle essentials'
  },
  {
    id: 6,
    name: 'Books & Education',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
    count: '750+ items',
    description: 'Knowledge and learning resources'
  },
  {
    id: 7,
    name: 'Automotive',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=300&fit=crop',
    count: '650+ items',
    description: 'Car accessories and parts'
  },
  {
    id: 8,
    name: 'Baby & Kids',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop',
    count: '1,200+ items',
    description: 'Everything for little ones'
  }
];

export const Categories = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Our Categories
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Discover thousands of quality products across all categories, sourced from trusted South African sellers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
              className="group card-hover animate-fadeIn bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90 mb-1">
                    {category.description}
                  </p>
                  <p className="text-xs font-medium text-orange-300">
                    {category.count}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/marketplace"
            className="inline-flex items-center bg-gradient-to-r from-pink-400 to-orange-400 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
