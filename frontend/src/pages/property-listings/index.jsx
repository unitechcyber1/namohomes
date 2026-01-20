  import React, { useState, useEffect, useRef } from 'react';
  import { useSearchParams, Link } from 'react-router-dom';
  import Header from '../../components/ui/Header';
  import Icon from '../../components/AppIcon';

  import PropertyCard from './components/PropertyCard';
  import FilterPanel from './components/FilterPanel';
  import MapView from './components/MapView';
  import SortDropdown from './components/SortDropdown';

  const PropertyListings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [sortBy, setSortBy] = useState('relevance');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef();

    // Mock property data with Indian market data
    const mockProperties = [
      {
        id: 1,
        title: "Spacious 3 BHK in Bandra West",
        price: 8500000,
        address: "Linking Road, Bandra West, Mumbai, Maharashtra",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1450,
        propertyType: "flat",
        images: [
          "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
          "https://images.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
        ],
        agent: {
          name: "Rajesh Kumar",
          phone: "+91 98765 43210",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        coordinates: { lat: 19.0596, lng: 72.8295 },
        isSaved: false,
        daysOnMarket: 15,
        amenities: ["Gated Community", "Gym", "Lift", "Parking", "Security/CCTV", "Power Backup"],
        description: `Beautiful 3 BHK apartment in prime Bandra West location with modern amenities. This spacious flat features a well-designed layout with ample natural light and ventilation.

  The property is located in a gated community with 24/7 security, power backup, and covered parking. Close to schools, hospitals, shopping centers, and excellent connectivity to Western Express Highway.`
      },
      {
        id: 2,
        title: "Luxury Villa in Whitefield",
        price: 12500000,
        address: "ITPL Main Road, Whitefield, Bangalore, Karnataka",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        propertyType: "independent-house",
        images: [
          "https://images.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg",
          "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
        ],
        agent: {
          name: "Priya Sharma",
          phone: "+91 98765 12345",
          avatar: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        coordinates: { lat: 12.9698, lng: 77.7499 },
        isSaved: true,
        daysOnMarket: 8,
        amenities: ["Garden", "Servant Room", "Modular Kitchen", "Vastu Compliant", "Rainwater Harvesting"],
        description: `Stunning independent villa in prestigious Whitefield neighborhood. This meticulously maintained property features spacious rooms, modern kitchen, and beautiful landscaping.

  Located in a peaceful residential area with easy access to IT parks, international schools, and shopping malls. The property is Vastu compliant and includes rainwater harvesting system.`
      },
      {
        id: 3,
        title: "Cozy 1 BHK Studio Apartment",
        price: 3200000,
        address: "Koramangala 5th Block, Bangalore, Karnataka",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 550,
        propertyType: "studio",
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
          "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
        ],
        agent: {
          name: "Ananya Iyer",
          phone: "+91 98765 67890",
          avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        },
        coordinates: { lat: 12.9352, lng: 77.6245 },
        isSaved: false,
        daysOnMarket: 22,
        amenities: ["Lift", "Power Backup", "Parking", "Security/CCTV"],
        description: `Charming studio apartment in trendy Koramangala featuring modern design and efficient space utilization. Perfect for young professionals and students.

  Located in a well-maintained building with lift and security. The area is known for its vibrant cafe culture, restaurants, and excellent connectivity to major IT hubs.`
      },
      {
        id: 4,
        title: "Premium 4 BHK Penthouse",
        price: 35000000,
        address: "Golf Course Road, DLF Phase 5, Gurgaon, Haryana",
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3200,
        propertyType: "penthouse",
        images: [
          "https://images.pixabay.com/photo/2016/11/22/23/38/apartment-1851201_1280.jpg",
          "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
        ],
        agent: {
          name: "Amit Patel",
          phone: "+91 98765 11111",
          avatar: "https://randomuser.me/api/portraits/men/35.jpg"
        },
        coordinates: { lat: 28.4595, lng: 77.0266 },
        isSaved: false,
        daysOnMarket: 5,
        amenities: ["Private Terrace", "Clubhouse", "Swimming Pool", "Gym", "Concierge", "Vastu Compliant"],
        description: `Spectacular penthouse with panoramic city views and private terrace. This luxury 4 BHK residence features the finest finishes, imported fittings, and smart home automation.

  Building amenities include clubhouse, swimming pool, gym, and 24-hour concierge. Prime Golf Course Road location with easy access to Cyber Hub and IGI Airport.`
      },
      {
        id: 5,
        title: "Independent House in Jubilee Hills",
        price: 18000000,
        address: "Road No. 45, Jubilee Hills, Hyderabad, Telangana",
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3500,
        propertyType: "independent-house",
        images: [
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
          "https://images.pixabay.com/photo/2017/03/22/17/39/kitchen-2165756_1280.jpg"
        ],
        agent: {
          name: "Vikram Singh",
          phone: "+91 98765 22222",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg"
        },
        coordinates: { lat: 17.4326, lng: 78.4071 },
        isSaved: true,
        daysOnMarket: 12,
        amenities: ["Garden", "Servant Room", "Parking", "Vastu Compliant", "Solar Panels"],
        description: `Beautifully designed independent house in prestigious Jubilee Hills. This elegant 5-bedroom home combines traditional architecture with modern amenities.

  The property includes a private garden, servant quarters, and covered parking. Located in a prime residential area close to international schools, hospitals, and shopping centers.`
      },
      {
        id: 6,
        title: "Modern 2 BHK in Kharadi",
        price: 4500000,
        address: "EON Free Zone, Kharadi, Pune, Maharashtra",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        propertyType: "flat",
        images: [
          "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
          "https://images.pixabay.com/photo/2016/12/30/07/59/kitchen-1940174_1280.jpg"
        ],
        agent: {
          name: "Sneha Reddy",
          phone: "+91 98765 33333",
          avatar: "https://randomuser.me/api/portraits/women/38.jpg"
        },
        coordinates: { lat: 18.5511, lng: 73.9370 },
        isSaved: false,
        daysOnMarket: 3,
        amenities: ["Clubhouse", "Swimming Pool", "Gym", "Children Play Area", "Lift", "Power Backup"],
        description: `Contemporary 2 BHK apartment in Kharadi's premium IT hub location. This well-designed flat features modern interiors, modular kitchen, and excellent ventilation.The township offers world-class amenities including clubhouse, swimming pool, gym, and children's play area. Excellent connectivity to IT parks, Phoenix Market City, and Pune Airport.`
      }
    ];

    // Initialize properties and apply filters
    useEffect(() => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProperties(mockProperties);
        applyFilters(mockProperties);
        setLoading(false);
      }, 1000);
    }, []);

    // Apply filters based on search params
    const applyFilters = (propertiesToFilter = properties) => {
      let filtered = [...propertiesToFilter];
      
      const query = searchParams?.get('query');
      const location = searchParams?.get('location');
      const propertyType = searchParams?.get('propertyType');
      const minPrice = searchParams?.get('minPrice');
      const maxPrice = searchParams?.get('maxPrice');
      const bedrooms = searchParams?.get('bedrooms');
      const bathrooms = searchParams?.get('bathrooms');

      if (query) {
        filtered = filtered?.filter(property =>
          property?.title?.toLowerCase()?.includes(query?.toLowerCase()) ||
          property?.address?.toLowerCase()?.includes(query?.toLowerCase()) ||
          property?.description?.toLowerCase()?.includes(query?.toLowerCase())
        );
      }

      if (location) {
        filtered = filtered?.filter(property =>
          property?.address?.toLowerCase()?.includes(location?.toLowerCase())
        );
      }

      if (propertyType && propertyType !== 'all') {
        filtered = filtered?.filter(property =>
          property?.propertyType === propertyType
        );
      }

      if (minPrice) {
        filtered = filtered?.filter(property =>
          property?.price >= parseInt(minPrice)
        );
      }

      if (maxPrice) {
        filtered = filtered?.filter(property =>
          property?.price <= parseInt(maxPrice)
        );
      }

      if (bedrooms) {
        filtered = filtered?.filter(property =>
          property?.bedrooms >= parseInt(bedrooms)
        );
      }

      if (bathrooms) {
        filtered = filtered?.filter(property =>
          property?.bathrooms >= parseInt(bathrooms)
        );
      }

      // Apply sorting
      filtered = sortProperties(filtered, sortBy);
      
      setFilteredProperties(filtered);
    };

    // Sort properties
    const sortProperties = (propertiesToSort, sortOption) => {
      const sorted = [...propertiesToSort];
      
      switch (sortOption) {
        case 'price-low':
          return sorted?.sort((a, b) => a?.price - b?.price);
        case 'price-high':
          return sorted?.sort((a, b) => b?.price - a?.price);
        case 'newest':
          return sorted?.sort((a, b) => a?.daysOnMarket - b?.daysOnMarket);
        case 'oldest':
          return sorted?.sort((a, b) => b?.daysOnMarket - a?.daysOnMarket);
        case 'size':
          return sorted?.sort((a, b) => b?.sqft - a?.sqft);
        default:
          return sorted;
      }
    };

    // Handle sort change
    const handleSortChange = (newSortBy) => {
      setSortBy(newSortBy);
      const sorted = sortProperties(filteredProperties, newSortBy);
      setFilteredProperties(sorted);
    };

    // Handle filter changes
    const handleFilterChange = (filters) => {
      const newSearchParams = new URLSearchParams();
      
      Object.entries(filters)?.forEach(([key, value]) => {
        if (value && value !== '' && value !== 'all') {
          newSearchParams?.set(key, value);
        }
      });
      
      setSearchParams(newSearchParams);
      applyFilters();
    };

    // Handle property save/unsave
    const handlePropertySave = (propertyId, isSaved) => {
      setProperties(prev => prev?.map(property =>
        property?.id === propertyId ? { ...property, isSaved } : property
      ));
      setFilteredProperties(prev => prev?.map(property =>
        property?.id === propertyId ? { ...property, isSaved } : property
      ));
    };

    // Infinite scroll observer
    const lastPropertyElementRef = useRef();
    useEffect(() => {
      if (loading) return;
      
      if (observerRef?.current) observerRef?.current?.disconnect();
      
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      
      if (lastPropertyElementRef?.current) {
        observerRef?.current?.observe(lastPropertyElementRef?.current);
      }
    }, [loading, hasMore]);

    // Get breadcrumb items
    const getBreadcrumbs = () => {
      const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Properties', path: '/property-listings' }
      ];

      const location = searchParams?.get('location');
      const propertyType = searchParams?.get('propertyType');

      if (location) {
        breadcrumbs?.push({ label: location, path: null });
      }

      if (propertyType && propertyType !== 'all') {
        breadcrumbs?.push({ 
          label: propertyType?.charAt(0)?.toUpperCase() + propertyType?.slice(1), 
          path: null 
        });
      }

      return breadcrumbs;
    };

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-18">
          {/* Breadcrumb */}
          <div className="bg-surface border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <nav className="flex items-center space-x-2 text-sm">
                {getBreadcrumbs()?.map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                    )}
                    {crumb?.path ? (
                      <Link
                        to={crumb?.path}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                      >
                        {crumb?.label}
                      </Link>
                    ) : (
                      <span className="text-text-primary font-medium">{crumb?.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>

          {/* Search Results Header */}
          <div className="bg-surface border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">
                    Properties for Sale
                  </h1>
                  <p className="text-text-secondary mt-1">
                    {loading ? 'Loading...' : `${filteredProperties?.length} properties found`}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* View Toggle (Mobile) */}
                  <div className="flex lg:hidden bg-secondary-100 rounded-md p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                        viewMode === 'list' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="List" size={16} className="inline mr-1" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                        viewMode === 'map' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="Map" size={16} className="inline mr-1" />
                      Map
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown value={sortBy} onChange={handleSortChange} />

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction"
                  >
                    <Icon name="SlidersHorizontal" size={16} />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="flex">
              {/* Filter Panel */}
              <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onFilterChange={handleFilterChange}
                initialFilters={{
                  query: searchParams?.get('query') || '',
                  location: searchParams?.get('location') || '',
                  propertyType: searchParams?.get('propertyType') || '',
                  minPrice: searchParams?.get('minPrice') || '',
                  maxPrice: searchParams?.get('maxPrice') || '',
                  bedrooms: searchParams?.get('bedrooms') || '',
                  bathrooms: searchParams?.get('bathrooms') || ''
                }}
              />

              {/* Content Area */}
              <div className="flex-1 min-w-0">
                {/* Desktop Split View */}
                <div className="hidden lg:flex h-[calc(100vh-200px)]">
                  {/* Property List */}
                  <div className="w-5/5 overflow-y-auto">
                    <div className="p-6">
                      {loading ? (
                        <div className="grid grid-cols-1 gap-6">
                          {[...Array(6)]?.map((_, index) => (
                            <div key={index} className="card p-4">
                              <div className="animate-pulse">
                                <div className="flex space-x-4">
                                  <div className="w-48 h-32 bg-secondary-200 rounded-md"></div>
                                  <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                                    <div className="flex space-x-2">
                                      <div className="h-3 bg-secondary-200 rounded w-16"></div>
                                      <div className="h-3 bg-secondary-200 rounded w-16"></div>
                                      <div className="h-3 bg-secondary-200 rounded w-16"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {filteredProperties?.map((property, index) => (
                            <div
                              key={property?.id}
                              ref={index === filteredProperties?.length - 1 ? lastPropertyElementRef : null}
                              onMouseEnter={() => setSelectedProperty(property)}
                              onMouseLeave={() => setSelectedProperty(null)}
                            >
                              <PropertyCard
                                property={property}
                                variant="list"
                                onSave={handlePropertySave}
                                isHighlighted={selectedProperty?.id === property?.id}
                              />
                            </div>
                          ))}
                          
                          {filteredProperties?.length === 0 && (
                            <div className="text-center py-12">
                              <Icon name="Search" size={48} className="text-secondary mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-text-primary mb-2">
                                No properties found
                              </h3>
                              <p className="text-text-secondary">
                                Try adjusting your search criteria or filters
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map View */}
                  {/* <div className="w-2/5 border-l border-border">
                    <MapView
                      properties={filteredProperties}
                      selectedProperty={selectedProperty}
                      onPropertySelect={setSelectedProperty}
                    />
                  </div> */}
                </div>

                {/* Mobile View */}
                <div className="lg:hidden">
                  {viewMode === 'list' ? (
                    <div className="p-4">
                      {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                          {[...Array(6)]?.map((_, index) => (
                            <div key={index} className="card p-4">
                              <div className="animate-pulse">
                                <div className="w-full h-48 bg-secondary-200 rounded-md mb-4"></div>
                                <div className="space-y-3">
                                  <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                                  <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredProperties?.map((property, index) => (
                            <div
                              key={property?.id}
                              ref={index === filteredProperties?.length - 1 ? lastPropertyElementRef : null}
                            >
                              <PropertyCard
                                property={property}
                                variant="card"
                                onSave={handlePropertySave}
                              />
                            </div>
                          ))}
                          
                          {filteredProperties?.length === 0 && (
                            <div className="text-center py-12">
                              <Icon name="Search" size={48} className="text-secondary mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-text-primary mb-2">
                                No properties found
                              </h3>
                              <p className="text-text-secondary">
                                Try adjusting your search criteria or filters
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-[calc(100vh-200px)]">
                      <MapView
                        properties={filteredProperties}
                        selectedProperty={selectedProperty}
                        onPropertySelect={setSelectedProperty}
                        isMobile={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  export default PropertyListings;