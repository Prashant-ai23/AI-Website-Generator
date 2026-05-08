import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const ProjectSearch: React.FC<ProjectSearchProps> = ({
  onSearch,
  placeholder = 'Search projects...',
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

interface FilterOption {
  label: string;
  value: string;
}

interface ProjectFilterProps {
  onFilterChange: (filters: Record<string, any>) => void;
  statusOptions?: FilterOption[];
  typeOptions?: FilterOption[];
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  onFilterChange,
  statusOptions = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  typeOptions = [
    { label: 'Website', value: 'website' },
    { label: 'Blog', value: 'blog' },
    { label: 'Portfolio', value: 'portfolio' },
    { label: 'E-commerce', value: 'ecommerce' },
    { label: 'SaaS', value: 'saas' },
    { label: 'Custom', value: 'custom' },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({
    status: '',
    type: '',
    isFavorite: false,
  });

  const handleStatusChange = (value: string) => {
    const newFilters = { ...filters, status: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTypeChange = (value: string) => {
    const newFilters = { ...filters, type: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFavoriteChange = () => {
    const newFilters = { ...filters, isFavorite: !filters.isFavorite };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Filter className="w-4 h-4" />
        Filters {activeFilterCount > 0 && <span className="bg-blue-500 text-white text-xs rounded-full px-2">{activeFilterCount}</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 w-64">
          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Favorites Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="favorites"
                checked={filters.isFavorite}
                onChange={handleFavoriteChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="favorites" className="ml-2 text-sm text-gray-700">
                Favorites only
              </label>
            </div>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilters({ status: '', type: '', isFavorite: false });
                  onFilterChange({ status: '', type: '', isFavorite: false });
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
