// src/components/cards/PropertyCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Icon from "../AppIcon";
import Image from "../AppImage";
import { formatINR, formatArea } from "../../utils/indianFormatters";

const PropertyCard = ({ property, saved, onSave }) => {
  return (
    <Link
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
        {property?.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
            FEATURED
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave(property?.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            transition-all duration-200 ease-out ${
              saved
                ? "bg-error text-white"
                : "bg-surface/90 text-text-secondary hover:bg-surface hover:text-error"
            }`}
        >
          <Icon
            name="Heart"
            size={18}
            fill={saved ? "currentColor" : "none"}
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
            {formatINR(property?.price)}
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

        {/* Agent */}
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
  );
};

export default PropertyCard;
