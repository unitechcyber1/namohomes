  import React, { useState } from 'react';
  import { Link } from 'react-router-dom';
  import Icon from '../../../components/AppIcon';
  import Image from '../../../components/AppImage';
  import { formatINR, formatArea } from '../../../utils/indianFormatters';

  const NewLaunchProjects = () => {
    const [savedProperties, setSavedProperties] = useState(new Set());

    const newLaunchProjects = [
      {
        id: 1,
        title: "Modern 3 BHK Apartment",
        price: 8500000,
        location: "Bandra West, Mumbai",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1450,
        type: "Flat",
        image: "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        agent: {
          name: "Rajesh Kumar",
          photo: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        featured: true,
        daysOnMarket: 5
      },
      {
        id: 2,
        title: "Spacious Villa with Garden",
        price: 12500000,
        location: "Whitefield, Bangalore",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2800,
        type: "Villa",
        image: "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        agent: {
          name: "Priya Sharma",
          photo: "https://randomuser.me/api/portraits/women/45.jpg"
        },
        featured: true,
        daysOnMarket: 12
      },
      {
        id: 3,
        title: "Luxury Penthouse",
        price: 35000000,
        location: "Golf Course Road, Gurgaon",
        bedrooms: 4,
        bathrooms: 4,
        sqft: 3200,
        type: "Penthouse",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        agent: {
          name: "Amit Patel",
          photo: "https://randomuser.me/api/portraits/men/28.jpg"
        },
        featured: true,
        daysOnMarket: 3
      },
      {
        id: 4,
        title: "Cozy 2 BHK Flat",
        price: 4500000,
        location: "Kharadi, Pune",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        type: "Flat",
        image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        agent: {
          name: "Sneha Reddy",
          photo: "https://randomuser.me/api/portraits/women/33.jpg"
        },
        featured: true,
        daysOnMarket: 8
      },
      {
        id: 5,
        title: "Independent House",
        price: 18000000,
        location: "Jubilee Hills, Hyderabad",
        bedrooms: 5,
        bathrooms: 4,
        sqft: 3500,
        type: "Independent House",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
        agent: {
          name: "Vikram Singh",
          photo: "https://randomuser.me/api/portraits/men/41.jpg"
        },
        featured: true,
        daysOnMarket: 15
      },
      {
        id: 6,
        title: "Studio Apartment",
        price: 3200000,
        location: "Koramangala, Bangalore",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 550,
        type: "Studio",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        agent: {
          name: "Ananya Iyer",
          photo: "https://randomuser.me/api/portraits/women/52.jpg"
        },
        featured: true,
        daysOnMarket: 7
      }
    ];

    const formatPrice = (price) => {
      return formatINR(price);
    };

    const handleSaveProperty = (propertyId) => {
      setSavedProperties(prev => {
        const newSaved = new Set(prev);
        if (newSaved?.has(propertyId)) {
          newSaved?.delete(propertyId);
        } else {
          newSaved?.add(propertyId);
        }
        return newSaved;
      });
    };

    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
              New Launch Projects
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties from top locations across India
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {newLaunchProjects?.map((property) => (
              <Link
                key={property?.id}
                to={`/property-details?id=${property?.id}`}
                className="card overflow-hidden hover:shadow-elevation-2 transition-all duration-200 ease-out group"
              >
                {/* Property Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={property?.image}
                    alt={property?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    FEATURED
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e?.preventDefault();
                      handleSaveProperty(property?.id);
                    }}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                              transition-all duration-200 ease-out ${
                      savedProperties?.has(property?.id)
                        ? 'bg-error text-white' :'bg-surface/90 text-text-secondary hover:bg-surface hover:text-error'
                    }`}
                  >
                    <Icon 
                      name="Heart" 
                      size={18} 
                      fill={savedProperties?.has(property?.id) ? "currentColor" : "none"} 
                    />
                  </button>

                  {/* Property Type */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-surface/90 backdrop-blur-sm text-text-primary text-xs font-medium rounded">
                    {property?.type}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
                      {property?.title}
                    </h3>
                    <p className="text-sm text-text-secondary flex items-center">
                      <Icon name="MapPin" size={14} className="mr-1 flex-shrink-0" />
                      {property?.location}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(property?.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                    <div className="flex items-center text-sm text-text-secondary">
                      <Icon name="Bed" size={16} className="mr-1" />
                      <span>{property?.bedrooms} BHK</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Icon name="Bath" size={16} className="mr-1" />
                      <span>{property?.bathrooms}</span>
                    </div>
                    <div className="flex items-center text-sm text-text-secondary">
                      <Icon name="Maximize" size={16} className="mr-1" />
                      <span>{formatArea(property?.sqft)}</span>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={property?.agent?.photo}
                        alt={property?.agent?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {property?.agent?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {property?.daysOnMarket} days ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              to="/property-listings"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-white rounded-lg
                      hover:bg-primary-600 transition-all duration-200 ease-out shadow-elevation-1
                      hover:shadow-elevation-2 micro-interaction"
            >
              <span className="font-semibold">View All Properties</span>
              <Icon name="ArrowRight" size={20} />
            </Link>
          </div>
        </div>
      </section>
    );
  };

  export default NewLaunchProjects;