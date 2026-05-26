import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import PropertyCard from "../../../components/cards/PropertyCard";
import {
  getSimilarPropertiesListingUrl,
  getSimilarSectionSubtitle,
} from "../../../utils/similarProjects";

const SimilarProperties = ({ properties = [], currentProperty = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const scrollToIndex = (index) => {
    if (!containerRef.current?.children?.length) return;
    const cardWidth = containerRef.current.children[0]?.offsetWidth ?? 0;
    const gap = 16;
    const scrollPosition = index * (cardWidth + gap);
    containerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    const maxIndex = Math.max(0, properties.length - 1);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, properties.length - 1);
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const viewAllHref = currentProperty
    ? getSimilarPropertiesListingUrl(currentProperty)
    : "/property-listings/gurugram";

  const subtitle = currentProperty
    ? getSimilarSectionSubtitle(currentProperty)
    : "Properties you might also like";

  if (!properties?.length) {
    return (
      <div className="text-center py-12">
        <Icon name="Home" size={48} className="text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No similar properties nearby
        </h3>
        <p className="text-text-secondary mb-6">
          We could not find other listings in this location right now.
        </p>
        <Link
          to={viewAllHref}
          className="inline-flex items-center space-x-2 text-primary hover:text-primary-700 font-medium"
        >
          <span>Browse all properties</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Similar Properties</h2>
          <p className="text-text-secondary">{subtitle}</p>
        </div>
        {properties.length > 1 && (
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={handlePrevious}
              className="p-2 border border-border rounded-md hover:bg-secondary-100 transition-all duration-200"
              aria-label="Previous properties"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 border border-border rounded-md hover:bg-secondary-100 transition-all duration-200"
              aria-label="Next properties"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {properties.map((property, index) => (
            <div
              key={property._id ?? property.id ?? property.slug ?? `similar-${index}`}
              className="snap-start shrink-0 w-[min(100%,320px)] sm:w-[340px]"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          to={viewAllHref}
          className="inline-flex items-center space-x-2 text-primary hover:text-primary-700 font-medium transition-colors duration-200"
        >
          <span>View all in this location</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SimilarProperties;
