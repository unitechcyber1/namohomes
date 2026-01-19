import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { INDIAN_PROPERTY_TYPES, INDIAN_PRICE_RANGES, INDIAN_AMENITIES } from '../../../utils/indianFormatters';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  onFilterChange, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minSqft: '',
    maxSqft: '',
    amenities: [],
    ...initialFilters
  });

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    bedsBaths: true,
    propertyType: true,
    size: false,
    amenities: false
  });

  const propertyTypes = INDIAN_PROPERTY_TYPES;
  const priceRanges = INDIAN_PRICE_RANGES;
  const amenitiesList = INDIAN_AMENITIES;

  useEffect(() => {
    setFilters(prev => ({ ...prev, ...initialFilters }));
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeSelect = (range) => {
    const newFilters = {
      ...filters,
      minPrice: range?.min,
      maxPrice: range?.max
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters?.amenities?.includes(amenity)
      ? filters?.amenities?.filter(a => a !== amenity)
      : [...filters?.amenities, amenity];
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      query: '',
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minSqft: '',
      maxSqft: '',
      amenities: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    Array.isArray(value) ? value?.length > 0 : value !== ''
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-modal lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Filter Panel */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 bg-surface border-r border-border z-modal
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? 'lg:block' : 'lg:hidden'}
      `}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-text-secondary hover:text-text-primary transition-colors duration-200 lg:hidden"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Search Query */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="Search" size={16} className="text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={filters?.query}
                    onChange={(e) => handleFilterChange('query', e?.target?.value)}
                    placeholder="Search properties..."
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md
                             focus:border-border-focus focus:ring-1 focus:ring-primary-500
                             transition-all duration-200 ease-out text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="MapPin" size={16} className="text-text-secondary" />
                  </div>
                  <input
                    type="text"
                    value={filters?.location}
                    onChange={(e) => handleFilterChange('location', e?.target?.value)}
                    placeholder="City, locality, or project"
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md
                             focus:border-border-focus focus:ring-1 focus:ring-primary-500
                             transition-all duration-200 ease-out text-sm"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <button
                  onClick={() => toggleSection('propertyType')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-text-primary">Property Type</span>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedSections?.propertyType ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections?.propertyType && (
                  <div className="space-y-2">
                    {propertyTypes?.map((type) => (
                      <label
                        key={type?.value}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={type?.value}
                          checked={filters?.propertyType === type?.value}
                          onChange={(e) => handleFilterChange('propertyType', e?.target?.value)}
                          className="w-4 h-4 text-primary focus:ring-primary-500"
                        />
                        <span className="text-sm text-text-secondary">{type?.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div>
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-text-primary">Budget</span>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedSections?.price ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections?.price && (
                  <div className="space-y-2">
                    {priceRanges?.map((range) => (
                      <button
                        key={range?.value}
                        onClick={() => handlePriceRangeSelect(range)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                          filters?.minPrice === range?.min && filters?.maxPrice === range?.max
                            ? 'bg-primary text-white' :'hover:bg-secondary-100 text-text-secondary'
                        }`}
                      >
                        {range?.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bedrooms & Bathrooms */}
              <div>
                <button
                  onClick={() => toggleSection('bedsBaths')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-text-primary">BHK & Bathrooms</span>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedSections?.bedsBaths ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections?.bedsBaths && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-text-secondary mb-2">Bedrooms (BHK)</label>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '3', '4', '5+']?.map((bed) => (
                          <button
                            key={bed}
                            onClick={() => handleFilterChange('bedrooms', bed)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                              filters?.bedrooms === bed
                                ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                            }`}
                          >
                            {bed}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-2">Bathrooms</label>
                      <div className="flex flex-wrap gap-2">
                        {['1', '2', '3', '4+']?.map((bath) => (
                          <button
                            key={bath}
                            onClick={() => handleFilterChange('bathrooms', bath)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                              filters?.bathrooms === bath
                                ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                            }`}
                          >
                            {bath}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Area/Size */}
              <div>
                <button
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-text-primary">Built-up Area (sq.ft)</span>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedSections?.size ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections?.size && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-text-secondary mb-2">Min Area</label>
                      <input
                        type="number"
                        value={filters?.minSqft}
                        onChange={(e) => handleFilterChange('minSqft', e?.target?.value)}
                        placeholder="Min sq.ft"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm
                                 focus:border-border-focus focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-2">Max Area</label>
                      <input
                        type="number"
                        value={filters?.maxSqft}
                        onChange={(e) => handleFilterChange('maxSqft', e?.target?.value)}
                        placeholder="Max sq.ft"
                        className="w-full px-3 py-2 border border-border rounded-md text-sm
                                 focus:border-border-focus focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <button
                  onClick={() => toggleSection('amenities')}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-sm font-medium text-text-primary">Amenities</span>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedSections?.amenities ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections?.amenities && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {amenitiesList?.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters?.amenities?.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-text-secondary">{amenity}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary-600 transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;