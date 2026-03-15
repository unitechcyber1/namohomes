import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import SEO from "../../components/SEO";
import FooterSeoContent from "../../components/FooterSeoContent";
import Footer from "../homepage/components/Footer";
import Icon from "../../components/AppIcon";
import FilterPanel from "./components/FilterPanel";
import MapView from "./components/MapView";
import SortDropdown from "./components/SortDropdown";
import { getProjects, getMicroLocations } from "../../service/projectService";
import PropertyCard from "../../components/cards/PropertyCard";
import { slugToName, nameToSlug } from "../../utils/slug";
import { getPropertyListingsPath, DEFAULT_CITY_SLUG } from "../../constants/routes";

const PropertyListings = ({
  projectStatus,
  projectType,
  plansType,
  microlocationSlug: microlocationSlugProp,
}) => {
  const { citySlug, microlocationSlug: microlocationSlugFromParams } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const effectiveCitySlug = citySlug ?? DEFAULT_CITY_SLUG;
  const cityName = slugToName(effectiveCitySlug) || "Gurugram";
  const effectiveMicrolocationSlug = microlocationSlugFromParams ?? microlocationSlugProp;
  const isNewLaunchPage = projectStatus === "New Launch";
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [microlocations, setMicrolocations] = useState([]);
  const limit = 21;

  const effectiveMicrolocation =
    effectiveMicrolocationSlug?.trim()
      ? slugToName(effectiveMicrolocationSlug)
      : searchParams?.get("microlocation") ?? "";

  const loadProjects = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const query = searchParams?.get("query");
      const locationParam = searchParams?.get("location");
      const params = {
        page: pageNumber,
        limit,
      };
      if (query?.trim()) params.name = query.trim();
      if (locationParam?.trim()) params.city = locationParam.trim();
      if (effectiveMicrolocation?.trim()) params.microlocation = effectiveMicrolocation.trim();
      if (projectStatus) params.project_status = projectStatus;
      if (projectType) params.project_type = projectType;
      if (plansType) params.plans_type = plansType;
      if (sortBy === "low_to_high" || sortBy === "high_to_low") {
        params.price_sort = sortBy;
      }

      const data = await getProjects(params);

      const projects = data.projects ?? [];
      const count = data.totalCount ?? projects.length;
      const pages =
        data.totalPages ??
        (count > 0 ? Math.max(1, Math.ceil(count / limit)) : 1);

      setProperties(projects);
      setFilteredProperties(projects);
      setCurrentPage(pageNumber);
      setTotalPages(pages);
      setTotalCount(count);
    } catch (err) {
      console.error(err);
      setProperties([]);
      setFilteredProperties([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Load projects when page mounts or search params (from "View all results") change
  useEffect(() => {
    loadProjects(1);
  }, [
    searchParams?.get("query") ?? "",
    searchParams?.get("location") ?? "",
    effectiveMicrolocation,
    projectStatus,
    projectType,
    plansType,
    sortBy,
  ]);

  // Fetch microlocations for gurugram (shown at top of listing)
  useEffect(() => {
    let cancelled = false;
    getMicroLocations("Gurugram")
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.data ?? res?.microLocations ?? res?.microlocations ?? [];
        const active = list.filter((m) => m?.active !== false);
        const sorted = [...active].sort(
          (a, b) => (a?.priority?.order ?? 1000) - (b?.priority?.order ?? 1000)
        );
        setMicrolocations(sorted);
      })
      .catch(() => {
        if (!cancelled) setMicrolocations([]);
      });
    return () => { cancelled = true; };
  }, []);

  // Apply client-side filters (propertyType, minPrice, etc.) when properties or searchParams change
  useEffect(() => {
    if (properties?.length === 0 && !loading) return;
    applyFilters(properties);
  }, [properties, searchParams?.toString(), sortBy, projectType, plansType, effectiveMicrolocation]);

  // Apply filters based on search params
  const applyFilters = (propertiesToFilter = properties) => {
    let filtered = [...propertiesToFilter];
    console.log(filtered);
    const query = searchParams?.get("query");
    const location = searchParams?.get("location");
    const microlocation = effectiveMicrolocation?.trim() || searchParams?.get("microlocation");
    const propertyType = searchParams?.get("propertyType");
    const minPrice = searchParams?.get("minPrice");
    const maxPrice = searchParams?.get("maxPrice");
    const bedrooms = searchParams?.get("bedrooms");
    const bathrooms = searchParams?.get("bathrooms");

    const getTitle = (p) => p?.title ?? p?.name ?? "";
    const getAddress = (p) => p?.address ?? p?.location?.address ?? "";

    if (query) {
      filtered = filtered?.filter(
        (property) =>
          getTitle(property)?.toLowerCase()?.includes(query?.toLowerCase()) ||
          getAddress(property)?.toLowerCase()?.includes(query?.toLowerCase()) ||
          property?.description?.toLowerCase()?.includes(query?.toLowerCase()),
      );
    }

    if (location) {
      filtered = filtered?.filter((property) =>
        getAddress(property)?.toLowerCase()?.includes(location?.toLowerCase()),
      );
    }

    // microlocation: backend uses location.micro_location (array of ObjectIds refs to MicroLocation).
    // Query param can be MicroLocation ObjectId or name (when backend returns populated refs).
    if (microlocation?.trim()) {
      const mlParam = microlocation.trim();
      const mlLower = mlParam.toLowerCase();
      const isMongoId = /^[a-fA-F0-9]{24}$/.test(mlParam);
      filtered = filtered?.filter((property) => {
        const arr = property?.location?.micro_location;
        if (!Array.isArray(arr) || arr.length === 0) return false;
        return arr.some((item) => {
          if (item == null) return false;
          const id = typeof item === "object" && item !== null ? item._id ?? item.id : item;
          const name = typeof item === "object" && item !== null ? (item.name ?? item?.name) : null;
          if (isMongoId) return String(id).toLowerCase() === mlLower;
          if (name) return String(name).toLowerCase().includes(mlLower) || mlLower.includes(String(name).toLowerCase());
          return false;
        });
      });
    }

    if (propertyType && propertyType !== "all") {
      filtered = filtered?.filter(
        (property) => property?.propertyType === propertyType,
      );
    }
    if (projectType) {
      filtered = filtered?.filter(
        (property) =>
          (property?.propertyType ?? property?.project_type) === projectType,
      );
    }
    if (plansType) {
      filtered = filtered?.filter(
        (property) =>
          (property?.plans_type ?? property?.project_type) === plansType,
      );
    }

    if (minPrice) {
      filtered = filtered?.filter(
        (property) => property?.price >= parseInt(minPrice),
      );
    }

    if (maxPrice) {
      filtered = filtered?.filter(
        (property) => property?.price <= parseInt(maxPrice),
      );
    }

    if (bedrooms) {
      filtered = filtered?.filter(
        (property) => property?.bedrooms >= parseInt(bedrooms),
      );
    }

    if (bathrooms) {
      filtered = filtered?.filter(
        (property) => property?.bathrooms >= parseInt(bathrooms),
      );
    }

    // Apply sorting
    filtered = sortProperties(filtered, sortBy);

    setFilteredProperties(filtered);
  };

  // Sort properties
  const sortProperties = (propertiesToSort, sortOption) => {
    const sorted = [...propertiesToSort];
    const getPrice = (p) =>
      Number(p?.starting_price ?? 0) || 0;

    switch (sortOption) {
      case "low_to_high":
        return sorted?.sort((a, b) => getPrice(a) - getPrice(b));
      case "high_to_low":
        return sorted?.sort((a, b) => getPrice(b) - getPrice(a));
      case "newest":
        return sorted?.sort((a, b) => a?.daysOnMarket - b?.daysOnMarket);
      case "oldest":
        return sorted?.sort((a, b) => b?.daysOnMarket - a?.daysOnMarket);
      case "size":
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
      if (value && value !== "" && value !== "all") {
        newSearchParams?.set(key, value);
      }
    });

    setSearchParams(newSearchParams);
    applyFilters();
  };

  // Handle property save/unsave
  const handlePropertySave = (propertyId, isSaved) => {
    setProperties((prev) =>
      prev?.map((property) =>
        property?.id === propertyId ? { ...property, isSaved } : property,
      ),
    );
    setFilteredProperties((prev) =>
      prev?.map((property) =>
        property?.id === propertyId ? { ...property, isSaved } : property,
      ),
    );
  };

  // Infinite scroll observer
  const lastPropertyElementRef = useRef();
  useEffect(() => {
    if (loading) return;

    if (observerRef?.current) observerRef?.current?.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastPropertyElementRef?.current) {
      observerRef?.current?.observe(lastPropertyElementRef?.current);
    }
  }, [loading, hasMore]);

  // Page numbers to show in pagination (with ellipsis when many pages)
  const getPaginationPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis-left");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis-right");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  // Listing path and title for type-specific pages (residential, commercial, SCO)
  const getListingPath = () => {
    if (projectType === "residential") return "/residential-in-gurgaon";
    if (projectType === "commercial") return "/commercial-in-gurgaon";
    if (plansType === "sco") return "/sco-plots-in-gurgaon";
    return getPropertyListingsPath(effectiveCitySlug);
  };
  const getListingTitle = () => {
    if (projectType === "residential") return `Residential Properties in ${cityName}`;
    if (projectType === "commercial") return `Commercial Properties in ${cityName}`;
    if (plansType === "sco") return `SCO Plots in ${cityName}`;
    if (effectiveMicrolocation?.trim()) return `Properties in ${effectiveMicrolocation.trim()}`;
    return `Properties in ${cityName}`;
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const listingTitle = getListingTitle();
    const breadcrumbs = [
      { label: "Home", path: "/" },
      {
        label: isNewLaunchPage
          ? "New Launch Projects"
          : listingTitle ?? "Properties",
        path: isNewLaunchPage ? "/new-launch-projects" : getListingPath(),
      },
    ];

    const location = searchParams?.get("location");
    const microlocationParam = searchParams?.get("microlocation");
    const propertyTypeParam = searchParams?.get("propertyType");

    if (location) {
      breadcrumbs?.push({ label: location, path: null });
    }

    if (effectiveMicrolocation?.trim() || microlocationParam?.trim()) {
      breadcrumbs?.push({
        label: effectiveMicrolocation?.trim() || microlocationParam?.trim(),
        path: null,
      });
    }

    if (propertyTypeParam && propertyTypeParam !== "all") {
      breadcrumbs?.push({
        label: propertyTypeParam?.charAt(0)?.toUpperCase() + propertyTypeParam?.slice(1),
        path: null,
      });
    }

    return breadcrumbs;
  };
  console.log(microlocations);
  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />
      <main className="pt-16 lg:pt-18">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs()?.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Icon
                      name="ChevronRight"
                      size={14}
                      className="text-text-secondary"
                    />
                  )}
                  {crumb?.path ? (
                    <Link
                      to={crumb?.path}
                      className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                    >
                      {crumb?.label}
                    </Link>
                  ) : (
                    <span className="text-text-primary font-medium">
                      {crumb?.label}
                    </span>
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
                  {isNewLaunchPage
                    ? "New Launch Projects"
                    : getListingTitle() ?? "Properties for Sale"}
                </h1>
                <p className="text-text-secondary mt-1">
                  {loading
                    ? "Loading..."
                    : `${totalCount > 0 ? totalCount : filteredProperties?.length} properties found`}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* View Toggle (Mobile) */}
                <div className="flex lg:hidden bg-secondary-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${viewMode === "list"
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                      }`}
                  >
                    <Icon name="List" size={16} className="inline mr-1" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode("map")}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${viewMode === "map"
                      ? "bg-surface text-text-primary shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
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
                query: searchParams?.get("query") || "",
                location: searchParams?.get("location") || "",
                microlocation: effectiveMicrolocation?.trim() || searchParams?.get("microlocation") || "",
                propertyType: searchParams?.get("propertyType") || "",
                minPrice: searchParams?.get("minPrice") || "",
                maxPrice: searchParams?.get("maxPrice") || "",
                bedrooms: searchParams?.get("bedrooms") || "",
                bathrooms: searchParams?.get("bathrooms") || "",
              }}
            />

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {/* Desktop Split View */}
              <div className="hidden lg:flex h-[calc(100vh-200px)]">
                {/* Property List */}
                <div className="w-full overflow-y-auto">
                  {/* Microlocations strip - clickable cards linking to /slug */}
                  {microlocations?.length > 0 && (
                    <div className="bg-surface border-b border-border">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">
                          Explore by Microlocation
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                          {microlocations.map((micro) => {
                            const slug = micro?.slug || nameToSlug(micro?.name ?? "");
                            const name = micro?.name ?? slugToName(slug);
                            const isActive =
                              effectiveMicrolocation?.toLowerCase() === name?.toLowerCase() ||
                              (effectiveMicrolocationSlug && slug === effectiveMicrolocationSlug);
                            return (
                              <Link
                                key={micro?._id ?? slug ?? name}
                                to={`/property-listings/${effectiveCitySlug}/${slug}`}
                                className={`flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all duration-200 ${isActive
                                    ? "border-primary bg-primary-50 shadow-sm"
                                    : "border-border bg-surface hover:border-primary hover:bg-primary-50/50"
                                  }`}
                                style={{ minWidth: "140px", maxWidth: "180px" }}
                              >
                                {/* {micro?.image ? (
                        <div className="aspect-[4/3] bg-secondary-100">
                          <img
                            src={micro.image}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-secondary-100 flex items-center justify-center">
                          <Icon name="MapPin" size={28} className="text-text-secondary" />
                        </div>
                      )} */}
                                <div className="p-2.5">
                                  <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-text-primary"}`}>
                                    {name}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6">

                    {loading ? (
                      <div className="grid grid-cols-1 gap-6">
                        {[...Array(6)].map((_, index) => (
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
                      <>
                        {filteredProperties.length === 0 ? (
                          <div className="text-center py-12">
                            <Icon
                              name="Search"
                              size={48}
                              className="text-secondary mx-auto mb-4"
                            />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                              No properties found
                            </h3>
                            <p className="text-text-secondary">
                              Try adjusting your search criteria or filters
                            </p>
                          </div>
                        ) : (
                          <div
                            className={`grid gap-6 transition-all duration-300
              ${isFilterOpen
                                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                                : "grid-cols-1 sm:grid-cols-4 lg:grid-cols-3"
                              }
            `}
                          >
                            {filteredProperties.map((property, index) => (
                              <PropertyCard
                                key={property?._id || index}
                                property={property}
                                variant="card"
                                onSave={handlePropertySave}
                              />
                            ))}

                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {filteredProperties.length > 0 && totalPages > 0 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-10 pb-10 px-2">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => loadProjects(currentPage - 1)}
                        className="px-4 py-2 border border-border rounded-md bg-surface text-text-primary hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {getPaginationPages().map((page, idx) =>
                        page === "ellipsis-left" || page === "ellipsis-right" ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-text-secondary">
                            …
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => loadProjects(page)}
                            className={`min-w-[2.5rem] px-4 py-2 border rounded-md text-sm font-medium ${currentPage === page
                              ? "bg-primary text-white border-primary"
                              : "bg-surface border-border text-text-primary hover:bg-secondary-100"
                              }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => loadProjects(currentPage + 1)}
                        className="px-4 py-2 border border-border rounded-md bg-surface text-text-primary hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
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
                {viewMode === "list" ? (
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
                            key={property?._id}
                            ref={
                              index === filteredProperties?.length - 1
                                ? lastPropertyElementRef
                                : null
                            }
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
                            <Icon
                              name="Search"
                              size={48}
                              className="text-secondary mx-auto mb-4"
                            />
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                              No properties found
                            </h3>
                            <p className="text-text-secondary">
                              Try adjusting your search criteria or filters
                            </p>
                          </div>
                        )}

                        {/* Mobile pagination */}
                        {filteredProperties?.length > 0 && totalPages > 0 && (
                          <div className="flex flex-wrap justify-center items-center gap-2 py-6">
                            <button
                              type="button"
                              disabled={currentPage <= 1}
                              onClick={() => loadProjects(currentPage - 1)}
                              className="px-4 py-2 border border-border rounded-md bg-surface text-text-primary hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-text-secondary px-2">
                              Page {currentPage} of {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={currentPage >= totalPages}
                              onClick={() => loadProjects(currentPage + 1)}
                              className="px-4 py-2 border border-border rounded-md bg-surface text-text-primary hover:bg-secondary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
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
      <FooterSeoContent />
      <Footer />
    </div>
  );
};

export default PropertyListings;
