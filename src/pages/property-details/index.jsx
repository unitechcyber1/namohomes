// src/pages/property-details/index.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

import { getProjectById, getProjectBySlug } from '../../service/projectService';
import { mapProjectToPropertyDetails } from '../../utils/mapProjectToPropertyDetails';
import { fetchSimilarProjects } from '../../utils/similarProjects';

import ImageGallery from './components/ImageGallery';
import PropertyOverview from './components/PropertyOverview';
import PropertyTabs from './components/PropertyTabs';
import PriceTable from './components/PriceTable';
import FloorPlan from './components/FloorPlan';
import MasterPlan from './components/MasterPlan';
import LocationMap from './components/LocationMap';
import ProjectHighlights from './components/ProjectHighlights';
import LocationAdvantages from './components/LocationAdvantages';
import MortgageCalculator from './components/MortgageCalculator';
import ContactForm from './components/ContactForm';
import SimilarProperties from './components/SimilarProperties';
import LoadingState from './components/LoadingState';
import SEO from '../../components/SEO';

const PropertyDetails = () => {
  const { slug: slugFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);

  const slugFromQuery = searchParams?.get('slug');
  const propertyId = searchParams?.get('id');
  const slug = slugFromParams ?? slugFromQuery;

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = slug
          ? await getProjectBySlug(slug)
          : await getProjectById(propertyId);
        // Support { data }, { project }, or body as the project document
        const data =
          raw?.result?.project ??
          raw?.result ??
          raw?.project ??
          raw?.data?.project ??
          raw?.data ??
          raw;
        const mapped = mapProjectToPropertyDetails(data);
        setProperty(mapped);
        setIsSaved(false);
        const similar = await fetchSimilarProjects(data);
        setSimilarProperties(similar);
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load property');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId || slug) {
      fetchProperty();
    } else {
      setLoading(false);
      setProperty(null);
    }
  }, [propertyId, slug]);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In real app, sync with backend
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location?.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard?.writeText(window.location?.href);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', path: '/homepage' },
      { label: 'Properties', path: '/property-listings/gurugram' },
      { label: property?.title || 'Property Details', path: null }
    ];
    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SEO />
        <LoadingState />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SEO />
        <main className="pt-16 lg:pt-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <Icon name="Home" size={64} className="text-secondary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                {error ? 'Something went wrong' : 'Property Not Found'}
              </h1>
              <p className="text-text-secondary mb-6">
                {error || "The property you're looking for doesn't exist or has been removed."}
              </p>
              <Link
                to="/property-listings/gurugram"
                className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-all duration-200"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to Properties</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const primaryPhone = property?.contact_details?.[0]?.phone;
  const phoneHref = primaryPhone
    ? `tel:${String(primaryPhone).replace(/[\s-]/g, "")}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO />
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
                    <span className="text-text-primary font-medium truncate">{crumb?.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Actions Bar */}
        <div className="lg:hidden bg-surface border-b border-border sticky top-16 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className={`p-2 rounded-md transition-all duration-200 ${
                  isSaved 
                    ? 'bg-error text-white' :'bg-secondary-100 text-text-secondary hover:bg-error hover:text-white'
                }`}
              >
                <Icon name="Heart" size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-secondary-100 text-text-secondary rounded-md hover:bg-secondary-200 transition-all duration-200"
              >
                <Icon name="Share" size={18} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-600 transition-all duration-200"
                >
                  Contact Agent
                </a>
              ) : (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-600 transition-all duration-200"
                >
                  Contact Agent
                </button>
              )}
              <button
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-all duration-200"
              >
                Schedule Tour
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* ImageGallery inside container */}
          <section className="mb-6">
            <ImageGallery
              images={property?.images}
              title={property?.title}
              virtualTour={property?.virtualTour}
              video={property?.video}
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <PropertyOverview
                property={property}
                isSaved={isSaved}
                onSave={handleSave}
                onShare={handleShare}
                onContact={() => setShowContactForm(true)}
              />

              <PropertyTabs
                property={property}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <PriceTable
                plans={property?.plans}
                contactPhone={property?.contact_details?.[0]?.phone}
              />

              <FloorPlan
                plans={property?.plans}
                name={property?.title ?? property?.name}
                contactPhone={property?.contact_details?.[0]?.phone}
              />

              <MasterPlan
                name={property?.title ?? property?.name}
                masterPlan={property?.master_plan}
              />

              <LocationMap
                name={property?.title ?? property?.name}
                locationMap={property?.location_map}
              />

              <ProjectHighlights
                name={property?.title ?? property?.name}
                highlights={property?.highlights}
              />

              <LocationAdvantages
                name={property?.title ?? property?.name}
                advantages={property?.location_advantages}
                brochure={property?.brochure?.s3_link ?? property?.brochure?.name ?? property?.brochure}
              />
            </div>

            {/* Right Column - Sticky Contact Form (reuses ContactForm) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ContactForm
                  property={property}
                  agent={property?.agent}
                  variant="inline"
                />
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mt-12">
            <SimilarProperties
              properties={similarProperties}
              currentProperty={property}
            />
          </div>
        </div>
      </main>
      {/* Contact Form Modal (mobile / when opened from buttons) */}
      {showContactForm && (
        <ContactForm
          property={property}
          agent={property?.agent}
          variant="modal"
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetails;