/**
 * Maps BuilderProject API response to the property-details page view model.
 * Handles populated refs (builder, images[].image, location.city/state/country, amenties, etc.)
 */

/**
 * Parse Indian price string (e.g. "85 Lac", "1.5 Cr", "8500000") to number
 */
export function parsePriceToNumber(priceStr) {
  if (priceStr == null || priceStr === "") return null;
  const s = String(priceStr).trim().replace(/,/g, "");
  const num = parseFloat(s);
  if (!Number.isNaN(num)) {
    if (s.toLowerCase().includes("cr") || s.toLowerCase().includes("crore")) return num * 10000000;
    if (s.toLowerCase().includes("l") || s.toLowerCase().includes("lac") || s.toLowerCase().includes("lakh")) return num * 100000;
    if (s.toLowerCase().includes("k")) return num * 1000;
    return num;
  }
  return null;
}

/**
 * Build full address from location (with populated city, state, country)
 */
function buildAddress(location) {
  if (!location) return "";
  const parts = [
    location.address,
    location.city?.name,
    location.state?.name,
    location.country?.name,
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * Get image URLs from project.images (array of { image: ref|populated, name, alt, order })
 */
function getImageUrls(images) {
  if (!Array.isArray(images) || images.length === 0) return [];
  const withOrder = images
    .map((item) => ({
      url: item.image?.s3_link ?? item.image?.name,
      order: item.order ?? 999,
    }))
    .filter((item) => item.url);
  withOrder.sort((a, b) => a.order - b.order);
  return withOrder.map((item) => item.url);
}

/**
 * Get amenities as array of names (from amenties or allAmenities refs)
 */
function getAmenityNames(project) {
  const list = project.amenties ?? [];
  const names = list.map((a) => (typeof a === "object" && a?.name ? a.name : a)).filter(Boolean);
  if (names.length > 0) return names;
  const residential = project.allAmenities?.residential ?? [];
  const commercial = project.allAmenities?.commercial ?? [];
  const combined = [...residential, ...commercial];
  return combined.map((a) => (typeof a === "object" && a?.name ? a.name : a)).filter(Boolean);
}

/**
 * Derive BHK/bedrooms from configuration string or first plan
 */
function getConfigurationNums(project) {
  const config = project.configuration || "";
  const match = config.match(/(\d+)\s*BHK/i) || config.match(/(\d+)\s*BK/i);
  if (match) return { bedrooms: parseInt(match[1], 10) };
  const firstPlan = project.plans?.[0];
  const category = firstPlan?.category;
  const categoryName = typeof category === "object" && category?.name ? category.name : "";
  const bhkMatch = categoryName.match(/(\d+)\s*BHK/i) || categoryName.match(/(\d+)/);
  if (bhkMatch) return { bedrooms: parseInt(bhkMatch[1], 10) };
  return { bedrooms: null };
}

/**
 * Map contact_details[0] to agent-like object for the page
 */
function mapContactToAgent(contactDetails) {
  const c = Array.isArray(contactDetails) && contactDetails.length > 0 ? contactDetails[0] : null;
  if (!c) return null;
  return {
    name: c.user || c.designation || "Contact",
    phone: c.phone || "",
    email: c.email || "",
    avatar: null,
    rating: null,
    reviewsCount: null,
    bio: c.designation ? `${c.designation}` : "",
    reraNumber: null,
  };
}

/**
 * Map BuilderProject API response to property-details page shape
 */
export function mapProjectToPropertyDetails(project) {
  if (!project) return null;

  const priceNum = parsePriceToNumber(project.starting_price);
  const { bedrooms } = getConfigurationNums(project);
  const firstPlan = project.plans?.[0];
  const sizeSq = firstPlan?.size_sq || firstPlan?.size || "";
  const sqftNum = parseInt(String(sizeSq).replace(/\D/g, ""), 10) || null;

  return {
    id: project._id,
    slug: project.slug,
    title: project.name,
    price: priceNum ?? 0,
    starting_price: project.starting_price,
    address: buildAddress(project.location),
    bedrooms: bedrooms ?? null,
    bathrooms: null,
    sqft: sqftNum,
    carpetArea: sqftNum,
    propertyType: project.project_type || (firstPlan?.category?.name) || "flat",
    yearBuilt: null,
    facing: null,
    floor: null,
    totalFloors: null,
    furnishing: null,
    parkingSpaces: null,
    images: getImageUrls(project.images),
    agent: mapContactToAgent(project.contact_details),
    coordinates: project.geo_location?.coordinates?.length >= 2
      ? { lat: project.geo_location.coordinates[1], lng: project.geo_location.coordinates[0] }
      : (project.location?.latitude != null && project.location?.longitude != null
          ? { lat: project.location.latitude, lng: project.location.longitude }
          : null),
    daysOnMarket: null,
    propertyId: project._id,
    description: project.description || project.short_descrip || "",
    amenities: getAmenityNames(project),
    schools: [],
    neighborhood: null,
    propertyHistory: [],
    virtualTour: null,
    video: project.video || null,
    tagline: project.tagline,
    project_tag: project.project_tag,
    configuration: project.configuration,
    ratings: project.ratings,
    builder: project.builder,
    plans: project.plans,
    location: project.location,
    contact_details: project.contact_details,
    is_rera_approved: project.is_rera_approved,
    is_zero_brokerage: project.is_zero_brokerage,
    for_rent: project.for_rent,
    for_sale: project.for_sale,
    highlights: project.highlights,
    brochure: project.brochure,
    master_plan: project.master_plan,
    location_map: project.location_map,
  };
}
