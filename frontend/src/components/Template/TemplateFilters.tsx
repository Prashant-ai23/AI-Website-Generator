import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import TemplateService from '@/services/templateService';

interface TemplateSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const TemplateSearch: React.FC<TemplateSearchProps> = ({
  onSearch,
  placeholder = 'Search templates...',
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

interface TemplateFilterProps {
  onFilterChange: (filters: Record<string, any>) => void;
  categories?: any[];
}

export const TemplateFilter: React.FC<TemplateFilterProps> = ({ onFilterChange, categories = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({
    category: '',
    minRating: 0,
    sortBy: 'newest',
  });

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most Downloaded', value: 'downloads' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Most Viewed', value: 'views' },
    { label: 'Featured', value: 'featured' },
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 0 },
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
    { label: '2+ Stars', value: 2 },
  ];

  const handleCategoryChange = (value: string) => {
    const newFilters = { ...filters, category: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (value: number) => {
    const newFilters = { ...filters, minRating: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  return (
    <div className="relative inline-block w-full md:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full md:w-auto"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full px-2">{activeFilterCount}</span>
        )}
        <ChevronDown className="w-4 h-4 ml-auto md:ml-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 w-full md:w-72">
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleRatingChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  const resetFilters = { category: '', minRating: 0, sortBy: 'newest' };
                  setFilters(resetFilters);
                  onFilterChange(resetFilters);
                }}
                className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const TemplateCategoryFilter: React.FC<{
  categories: any[];
  onCategoryChange: (categoryId: string) => void;
  activeCategory?: string;
}> = ({ categories, onCategoryChange, activeCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !activeCategory
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryChange(category._id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category._id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
