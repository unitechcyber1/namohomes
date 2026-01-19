import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { formatINR, formatArea } from '../../../utils/indianFormatters';

const PropertyCard = ({ 
  property, 
  variant = 'card', 
  onSave, 
  isHighlighted = false 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Updated real estate images from multiple stock photography platforms
  const updatedImages = [
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    "https://images.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop"
  ];

  // Use updated images if property images are outdated or from common old sources
  const shouldUpdateImages = property?.images?.some(img => 
    img?.includes('photo-1545324418-cc1a3fa10c00') || 
    img?.includes('photo-1396122') ||
    img?.includes('photo-1438832') ||
    img?.includes('kitchen-1336160') ||
    img?.includes('very-old-image-urls') ||
    !img?.includes('w=800') // Check if image doesn't have proper sizing parameters
  );

  const displayImages = shouldUpdateImages ? updatedImages : (property?.images || updatedImages);

  const formatPrice = (price) => {
    return formatINR(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN')?.format(num);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (onSave) {
      onSave(property?.id, !property?.isSaved);
    }
  };

  const handleImageNavigation = (direction, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === displayImages?.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? displayImages?.length - 1 : prev - 1
      );
    }
  };

  const handleContactAgent = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    // Handle contact agent action
    window.open(`tel:${property?.agent?.phone}`, '_self');
  };

  if (variant === 'list') {
    return (
      <Link
        to={`/property-details?id=${property?.id}`}
        className={`block card hover:shadow-elevation-2 transition-all duration-200 ease-out
                   ${isHighlighted ? 'ring-2 ring-primary shadow-elevation-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          <div className="flex space-x-4">
            {/* Property Images */}
            <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={displayImages?.[currentImageIndex]}
                alt={property?.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {displayImages?.length > 1 && isHovered && (
                <>
                  <button
                    onClick={(e) => handleImageNavigation('prev', e)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 
                             bg-surface/90 rounded-full flex items-center justify-center
                             hover:bg-surface transition-all duration-200"
                  >
                    <Icon name="ChevronLeft" size={14} />
                  </button>
                  <button
                    onClick={(e) => handleImageNavigation('next', e)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 
                             bg-surface/90 rounded-full flex items-center justify-center
                             hover:bg-surface transition-all duration-200"
                  >
                    <Icon name="ChevronRight" size={14} />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {displayImages?.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                              flex space-x-1">
                  {displayImages?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
                           transition-all duration-200 ease-out ${
                  property?.isSaved
                    ? 'bg-error text-white' :'bg-surface/90 text-text-secondary hover:bg-surface hover:text-error'
                }`}
              >
                <Icon 
                  name="Heart" 
                  size={16} 
                  fill={property?.isSaved ? "currentColor" : "none"} 
                />
              </button>
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-1 truncate">
                    {property?.title}
                  </h3>
                  <p className="text-sm text-text-secondary flex items-center">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {property?.address}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(property?.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-3 text-sm text-text-secondary">
                <div className="flex items-center">
                  <Icon name="Bed" size={16} className="mr-1" />
                  <span>{property?.bedrooms} BHK</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Bath" size={16} className="mr-1" />
                  <span>{property?.bathrooms} Bath</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Maximize" size={16} className="mr-1" />
                  <span>{formatArea(property?.sqft)}</span>
                </div>
              </div>

              {isHovered && (
                <div className="space-y-2 progressive-disclosure">
                  <div className="flex flex-wrap gap-2">
                    {property?.amenities?.slice(0, 4)?.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary-100 text-text-secondary text-xs rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={property?.agent?.avatar}
                        alt={property?.agent?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {property?.agent?.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {property?.daysOnMarket} days on market
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleContactAgent}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-600 transition-colors duration-200"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Card variant (default)
  return (
    <Link
      to={`/property-details?id=${property?.id}`}
      className={`block card overflow-hidden hover:shadow-elevation-2 transition-all duration-200 ease-out
                 ${isHighlighted ? 'ring-2 ring-primary shadow-elevation-2' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={displayImages?.[currentImageIndex]}
          alt={property?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {displayImages?.length > 1 && isHovered && (
          <>
            <button
              onClick={(e) => handleImageNavigation('prev', e)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 
                       bg-surface/90 rounded-full flex items-center justify-center
                       hover:bg-surface transition-all duration-200 z-10"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={(e) => handleImageNavigation('next', e)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 
                       bg-surface/90 rounded-full flex items-center justify-center
                       hover:bg-surface transition-all duration-200 z-10"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {displayImages?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 
                        flex space-x-1 z-10">
            {displayImages?.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                     transition-all duration-200 ease-out z-10 ${
            property?.isSaved
              ? 'bg-error text-white' : 'bg-surface/90 text-text-secondary hover:bg-surface hover:text-error'
          }`}
        >
          <Icon 
            name="Heart" 
            size={18} 
            fill={property?.isSaved ? "currentColor" : "none"} 
          />
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-white text-xs font-medium rounded z-10">
          {property?.propertyType}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-text-primary mb-1 truncate">
            {property?.title}
          </h3>
          <p className="text-sm text-text-secondary flex items-center truncate">
            <Icon name="MapPin" size={14} className="mr-1 flex-shrink-0" />
            {property?.address}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(property?.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
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
            <span>{formatNumber(property?.sqft)} sq.ft</span>
          </div>
        </div>

        {/* Agent Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={property?.agent?.avatar}
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
          
          {isHovered && (
            <button
              onClick={handleContactAgent}
              className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-600 transition-colors duration-200 progressive-disclosure"
            >
              Contact
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;