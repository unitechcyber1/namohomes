// src/pages/property-details/components/PropertyTabs.jsx
import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { parseNearbySubdoc, pickNearbyDetail } from '../../../utils/nearbyPlaces';

const PropertyTabs = ({ property, activeTab, onTabChange }) => {
  const mapRef = useRef(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'amenities', label: 'Amenities', icon: 'Star' },
    { id: 'location', label: 'Location', icon: 'MapPin' },
    { id: 'nearby', label: 'Near By', icon: 'MapPinned' },
  ];

  const isHtml = (str) => {
    if (!str || typeof str !== "string") return false;
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const renderDescription = () => {
    const desc = property?.description;
    const hasDescription = !!desc?.trim();
    const descriptionContent = desc ? (
      isHtml(desc) ? (
        <div
          className="prose prose-sm md:prose-base max-w-none prose-headings:text-text-primary prose-p:text-text-primary prose-li:text-text-primary prose-strong:text-text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: desc }}
        />
      ) : (
        <div className="text-text-primary whitespace-pre-line leading-relaxed">
          {desc}
        </div>
      )
    ) : null;

    return (
    <div className="prose max-w-none">
      {hasDescription && (
        <div className="relative">
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
              descriptionExpanded ? 'max-h-none' : 'max-h-48'
            }`}
          >
            {descriptionContent}
          </div>
          {!descriptionExpanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none"
              aria-hidden
            />
          )}
          <button
            type="button"
            onClick={() => setDescriptionExpanded((prev) => !prev)}
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-700 transition-colors"
          >
            {descriptionExpanded ? (
              <>
                <span>See less</span>
                <Icon name="ChevronDown" size={16} className="rotate-180" />
              </>
            ) : (
              <>
                <span>See more</span>
                <Icon name="ChevronDown" size={16} />
              </>
            )}
          </button>
        </div>
      )}
      {!hasDescription && descriptionContent}

      {property?.propertyHistory && property.propertyHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Price History</h3>
          <div className="space-y-3">
            {property.propertyHistory.map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium text-text-primary">{event.event}</p>
                  <p className="text-sm text-text-secondary">{event.date}</p>
                </div>
                <p className="font-semibold text-primary">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(event.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    );
  };

  const renderAmenities = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {property?.amenities?.map((amenity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-md">
            <Icon name="Check" size={16} className="text-success flex-shrink-0" />
            <span className="text-text-primary">{amenity}</span>
          </div>
        ))}
      </div>
      
      {(!property?.amenities || property.amenities.length === 0) && (
        <div className="text-center py-8">
          <Icon name="Star" size={48} className="text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No amenities listed for this property</p>
        </div>
      )}
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      {/* Neighborhood Scores */}
      {property?.neighborhood && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-primary mb-1">
              {property.neighborhood.walkScore}
            </div>
            <div className="text-sm text-text-secondary">Walk Score</div>
            <div className="text-xs text-text-secondary mt-1">
              {property.neighborhood.walkScore >= 90 ? 'Walker\'s Paradise' :
               property.neighborhood.walkScore >= 70 ? 'Very Walkable' :
               property.neighborhood.walkScore >= 50 ? 'Somewhat Walkable' : 'Car-Dependent'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-accent mb-1">
              {property.neighborhood.transitScore}
            </div>
            <div className="text-sm text-text-secondary">Transit Score</div>
            <div className="text-xs text-text-secondary mt-1">
              {property.neighborhood.transitScore >= 90 ? 'Excellent Transit' :
               property.neighborhood.transitScore >= 70 ? 'Great Transit' :
               property.neighborhood.transitScore >= 50 ? 'Good Transit' : 'Some Transit'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-background rounded-md">
            <div className="text-2xl font-bold text-warning mb-1">
              {property.neighborhood.bikeScore}
            </div>
            <div className="text-sm text-text-secondary">Bike Score</div>
            <div className="text-xs text-text-secondary mt-1">
              {property.neighborhood.bikeScore >= 90 ? 'Biker\'s Paradise' :
               property.neighborhood.bikeScore >= 70 ? 'Very Bikeable' :
               property.neighborhood.bikeScore >= 50 ? 'Bikeable' : 'Somewhat Bikeable'}
            </div>
          </div>
        </div>
      )}
      
      {/* Map Placeholder */}
      <div className="bg-secondary-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Map" size={48} className="text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">Interactive neighborhood map would be embedded here</p>
          <p className="text-sm text-text-secondary mt-1">
            Coordinates: {property?.coordinates?.lat}, {property?.coordinates?.lng}
          </p>
        </div>
      </div>
      
      {/* Nearby Places */}
      {property?.neighborhood?.nearbyPlaces && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Nearby Places</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {property.neighborhood.nearbyPlaces.map((place, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={
                      place.type === 'Park' ? 'Trees' :
                      place.type === 'Shopping' ? 'ShoppingBag' :
                      place.type === 'Transit' ? 'Train' :
                      place.type === 'Grocery' ? 'ShoppingCart' : 'MapPin'
                    } 
                    size={16} 
                    className="text-primary" 
                  />
                  <div>
                    <p className="font-medium text-text-primary">{place.name}</p>
                    <p className="text-sm text-text-secondary">{place.type}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{place.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const formatNearbyDistance = (distance) => {
    if (distance == null || Number.isNaN(Number(distance))) return null;
    return `${Number(distance)} km`;
  };

  /** Prefer mapped fields; also resolve from raw API shape if mapper missed a path */
  const nearbySections = [
    {
      key: "metro",
      label: "Metro",
      icon: "TrainFront",
      isNearKey: "is_near_metro",
      snake: "metro_detail",
      camel: "metroDetail",
    },
    {
      key: "school",
      label: "School",
      icon: "School",
      isNearKey: "is_near_school",
      snake: "school_detail",
      camel: "schoolDetail",
    },
    {
      key: "restro",
      label: "Restaurant",
      icon: "Utensils",
      isNearKey: "is_near_restro",
      snake: "restro_detail",
      camel: "restroDetail",
    },
    {
      key: "hospital",
      label: "Hospital",
      icon: "Hospital",
      isNearKey: "is_near_hospital",
      snake: "hospital_detail",
      camel: "hospitalDetail",
    },
    {
      key: "college",
      label: "College",
      icon: "GraduationCap",
      isNearKey: "is_near_college",
      snake: "college_detail",
      camel: "collegeDetail",
    },
    {
      key: "market",
      label: "Market",
      icon: "Store",
      isNearKey: "is_near_market",
      snake: "market_detail",
      camel: "marketDetail",
    },
  ];

  const renderNearby = () => {
    const blocks = nearbySections
      .map((section) => {
        const raw =
          property?.[section.snake] ??
          property?.[section.camel] ??
          pickNearbyDetail(property, section.snake, section.camel);
        const parsed = parseNearbySubdoc(raw, section.isNearKey);
        if (!parsed) return null;

        const distLabel = formatNearbyDistance(parsed.distance);

        return (
          <div key={section.key} className="rounded-lg border border-border bg-surface p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Icon name={section.icon} size={20} className="text-primary shrink-0" />
              <h3 className="text-lg font-semibold text-text-primary">{section.label}</h3>
              {parsed.isNear && (
                <span className="rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success">
                  Nearby
                </span>
              )}
            </div>
            <div className="space-y-1 rounded-md border border-border bg-background px-3 py-3">
              <p className="font-medium text-text-primary">{parsed.name}</p>
              {distLabel && (
                <p className="text-sm text-text-secondary">
                  <span className="text-text-secondary">Distance: </span>
                  <span className="font-medium text-text-primary">{distLabel}</span>
                </p>
              )}
            </div>
          </div>
        );
      })
      .filter(Boolean);

    if (blocks.length === 0) {
      return (
        <div className="text-center py-8">
          <Icon name="MapPinned" size={48} className="text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No nearby places information available for this project</p>
        </div>
      );
    }

    return <div className="space-y-6">{blocks}</div>;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return renderDescription();
      case 'amenities':
        return renderAmenities();
      case 'location':
        return renderLocation();
      case 'nearby':
        return renderNearby();
      default:
        return renderDescription();
    }
  };

  return (
    <div className="card overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyTabs;