import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { INDIAN_PROPERTY_TYPES, INDIAN_PRICE_RANGES, INDIAN_CITIES, formatPriceForDisplay } from '../../utils/indianFormatters';
import { searchProjects } from '../../service/projectService';
import { getPropertyListingsPath, getPropertyDetailsUrl } from '../../constants/routes';

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;
const SUGGESTIONS_LIMIT = 8;

const SearchInterface = ({ variant = 'hero', onSearch, initialFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.query || '');
  const [location, setLocation] = useState(initialFilters?.location || '');
  const [propertyType, setPropertyType] = useState(initialFilters?.propertyType || '');
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || '');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const filtersRef = useRef(null);
  const locationRef = useRef(null);
  const searchRef = useRef(null);
  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const propertyTypes = INDIAN_PROPERTY_TYPES;
  const priceRanges = INDIAN_PRICE_RANGES;
  const locationSuggestions = INDIAN_CITIES;

  const fetchSuggestions = useCallback(async (name, city) => {
    const id = ++requestIdRef.current;
    setSuggestionsLoading(true);
    setSuggestionsError(null);
    try {
      const params = { limit: SUGGESTIONS_LIMIT, page: 1 };
      if (name?.trim()) params.name = name.trim();
      if (city?.trim()) params.city = city.trim();
      const res = await searchProjects(params);
      if (id !== requestIdRef.current) return;
      const list = res?.projects ?? res?.data?.projects ?? [];
      const total = res?.totalCount ?? res?.data?.totalCount ?? 0;
      setSuggestions(Array.isArray(list) ? list : []);
      setTotalCount(total ?? 0);
    } catch (err) {
      if (id !== requestIdRef.current) return;
      setSuggestionsError(err?.message || 'Search failed');
      setSuggestions([]);
    } finally {
      if (id === requestIdRef.current) setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const hasQuery = searchQuery?.trim().length >= MIN_QUERY_LENGTH || location?.trim();
    if (!hasQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
      return;
    }
    setSuggestionsLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchQuery?.trim(), location?.trim());
      setShowSuggestions(true);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, location, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef?.current && !filtersRef?.current?.contains(event?.target)) {
        setIsFiltersOpen(false);
      }
      if (locationRef?.current && !locationRef?.current?.contains(event?.target)) {
        setIsLocationDropdownOpen(false);
      }
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);
    const searchParams = {
      query: searchQuery,
      location,
      propertyType,
      priceRange
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const params = new URLSearchParams();
      Object.entries(searchParams)?.forEach(([key, value]) => {
        if (value) params?.append(key, value);
      });
      navigate(`${getPropertyListingsPath()}?${params?.toString()}`);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setIsLocationDropdownOpen(false);
  };

  const handleSelectProject = (project) => {
    setShowSuggestions(false);
    setSearchQuery(project?.name ?? '');
    navigate(getPropertyDetailsUrl(project));
  };

  const handleViewAllResults = () => {
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (searchQuery?.trim()) params.set('query', searchQuery.trim());
    if (location?.trim()) params.set('location', location.trim());
    navigate(`${getPropertyListingsPath()}?${params?.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setPropertyType('');
    setPriceRange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const hasActiveFilters = searchQuery || location || propertyType || priceRange;

  const renderSuggestionsDropdown = () => {
    if (!showSuggestions) return null;
    return (
      <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border rounded-lg shadow-elevation-3 z-dropdown max-h-80 overflow-y-auto">
        {suggestionsLoading && (
          <div className="flex items-center justify-center gap-2 py-6 text-text-secondary">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {!suggestionsLoading && suggestionsError && (
          <div className="px-4 py-3 text-sm text-error flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            {suggestionsError}
          </div>
        )}
        {!suggestionsLoading && !suggestionsError && suggestions.length === 0 && (searchQuery?.trim().length >= MIN_QUERY_LENGTH || location?.trim()) && (
          <div className="px-4 py-4 text-sm text-text-secondary">No projects found. Try different keywords or city.</div>
        )}
        {!suggestionsLoading && !suggestionsError && suggestions.length > 0 && (
          <>
            <ul className="py-2">
              {suggestions.map((project) => (
                <li key={project?._id}>
                  <button
                    type="button"
                    onClick={() => handleSelectProject(project)}
                    className="w-full text-left px-4 py-3 hover:bg-secondary-100 flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="font-medium text-text-primary">{project?.name}</span>
                    <span className="text-sm text-text-secondary">
                      {[project?.location?.city?.name, project?.location?.address].filter(Boolean).join(' · ') || '—'}
                    </span>
                    <span className="text-sm text-primary font-medium">{formatPriceForDisplay(project?.starting_price)}</span>
                  </button>
                </li>
              ))}
            </ul>
            {totalCount > suggestions.length && (
              <div className="border-t border-border px-4 py-2">
                <button
                  type="button"
                  onClick={handleViewAllResults}
                  className="text-sm font-medium text-primary hover:underline w-full text-left"
                >
                  View all {totalCount} results →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main Search Bar + Suggestions */}
          <div ref={searchRef} className="relative w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon name="Search" size={24} className="text-secondary" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={() => (searchQuery?.trim().length >= MIN_QUERY_LENGTH || location?.trim()) && setShowSuggestions(true)}
                placeholder="Search by locality, landmark, project or builder..."
                className="block w-full pl-12 pr-28 py-4 text-lg border border-border rounded-lg
                 focus:border-border-focus focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 transition-all duration-200 ease-out bg-surface text-text-primary
                 placeholder-text-secondary shadow-elevation-1"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white
                 px-4 py-2 rounded-md text-base font-semibold hover:bg-primary-600
                 transition-all duration-200 ease-out shadow-elevation-2 hover:shadow-elevation-3"
              >
                Search
              </button>
            </div>

            {renderSuggestionsDropdown()}
          </div>
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Property Type Filter */}
            {/* <select
              value={propertyType}
              onChange={(e) => setPropertyType(e?.target?.value)}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium
                       focus:border-border-focus focus:ring-1 focus:ring-primary-500 
                       transition-all duration-200 ease-out"
            >
              {propertyTypes?.map((type) => (
                <option key={type?.value} value={type?.value}>
                  {type?.label}
                </option>
              ))}
            </select> */}

            {/* Price Range Filter */}
            {/* <select
              value={priceRange}
              onChange={(e) => setPriceRange(e?.target?.value)}
              className="px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium
                       focus:border-border-focus focus:ring-1 focus:ring-primary-500 
                       transition-all duration-200 ease-out"
            >
              {priceRanges?.map((range) => (
                <option key={range?.value} value={range?.value}>
                  {range?.label}
                </option>
              ))}
            </select> */}

            {/* Advanced Filters Toggle */}
            {/* <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border 
                       rounded-md hover:bg-secondary-100 transition-all duration-200 ease-out
                       micro-interaction"
            >
              <Icon name="SlidersHorizontal" size={16} />
              <span className="text-sm font-medium">More Filters</span>
            </button> */}

            {/* Clear Filters */}
            {/* {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={14} />
                <span>Clear</span>
              </button>
            )} */}
          </div>

          {/* Advanced Filters Panel */}
          {/* {isFiltersOpen && (
            <div 
              ref={filtersRef}
              className="bg-surface border border-border rounded-lg p-6 shadow-elevation-2
                       progressive-disclosure"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bedrooms (BHK)
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bathrooms
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Furnishing Status
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="furnished">Fully Furnished</option>
                    <option value="semi-furnished">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Property Age
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="0-1">Under Construction</option>
                    <option value="1-3">0-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10+">10+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Facing
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                    <option value="north-east">North-East</option>
                    <option value="north-west">North-West</option>
                    <option value="south-east">South-East</option>
                    <option value="south-west">South-West</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Posted By
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500">
                    <option value="">Any</option>
                    <option value="owner">Owner</option>
                    <option value="builder">Builder</option>
                    <option value="dealer">Dealer/Agent</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )} */}
        </form>
      </div>
    );
  }

  // Compact variant for property listings page
  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              placeholder="Search properties..."
              className="w-full px-3 py-2 border border-border rounded-md text-sm
                       focus:border-border-focus focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <select
            value={location}
            onChange={(e) => setLocation(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500"
          >
            <option value="">All Cities</option>
            {locationSuggestions?.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500"
          >
            {propertyTypes?.map((type) => (
              <option key={type?.value} value={type?.value}>
                {type?.label}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:border-border-focus focus:ring-1 focus:ring-primary-500"
          >
            {priceRanges?.map((range) => (
              <option key={range?.value} value={range?.value}>
                {range?.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium
                     hover:bg-primary-600 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInterface;