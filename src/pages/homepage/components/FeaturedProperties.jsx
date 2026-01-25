import React, { useState } from "react";
import PropertyCard from "../../../components/cards/PropertyCard";
import { Link } from "react-router-dom";
import Icon from '../../../components/AppIcon';
const FeaturedProperties = () => {
  const [savedProperties, setSavedProperties] = useState(new Set());

  const featuredProperties = [{ id: 1, title: "Modern 3 BHK Apartment", price: 8500000, location: "Bandra West, Mumbai", bedrooms: 3, bathrooms: 2, sqft: 1450, type: "Flat", image: "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", agent: { name: "Rajesh Kumar", photo: "https://randomuser.me/api/portraits/men/32.jpg" }, featured: true, daysOnMarket: 5 }, { id: 2, title: "Spacious Villa with Garden", price: 12500000, location: "Whitefield, Bangalore", bedrooms: 4, bathrooms: 3, sqft: 2800, type: "Villa", image: "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", agent: { name: "Priya Sharma", photo: "https://randomuser.me/api/portraits/women/45.jpg" }, featured: true, daysOnMarket: 12 }, { id: 3, title: "Luxury Penthouse", price: 35000000, location: "Golf Course Road, Gurgaon", bedrooms: 4, bathrooms: 4, sqft: 3200, type: "Penthouse", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", agent: { name: "Amit Patel", photo: "https://randomuser.me/api/portraits/men/28.jpg" }, featured: true, daysOnMarket: 3 }, { id: 4, title: "Cozy 2 BHK Flat", price: 4500000, location: "Kharadi, Pune", bedrooms: 2, bathrooms: 2, sqft: 1100, type: "Flat", image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop", agent: { name: "Sneha Reddy", photo: "https://randomuser.me/api/portraits/women/33.jpg" }, featured: true, daysOnMarket: 8 }, { id: 5, title: "Independent House", price: 18000000, location: "Jubilee Hills, Hyderabad", bedrooms: 5, bathrooms: 4, sqft: 3500, type: "Independent House", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", agent: { name: "Vikram Singh", photo: "https://randomuser.me/api/portraits/men/41.jpg" }, featured: true, daysOnMarket: 15 }, { id: 6, title: "Studio Apartment", price: 3200000, location: "Koramangala, Bangalore", bedrooms: 1, bathrooms: 1, sqft: 550, type: "Studio", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop", agent: { name: "Ananya Iyer", photo: "https://randomuser.me/api/portraits/women/52.jpg" }, featured: true, daysOnMarket: 7 }];

  const handleSaveProperty = (propertyId) => {
    setSavedProperties((prev) => {
      const updated = new Set(prev);
      updated.has(propertyId) ? updated.delete(propertyId) : updated.add(propertyId);
      return updated;
    });
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 font-heading">
            Featured Properties
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties from top locations across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {featuredProperties?.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              saved={savedProperties.has(property.id)}
              onSave={handleSaveProperty}
            />
          ))}
        </div>

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

export default FeaturedProperties;
