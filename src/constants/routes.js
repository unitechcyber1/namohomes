/** Default city slug for property listings URL (e.g. /property-listings/gurugram) */
export const DEFAULT_CITY_SLUG = "gurugram";

/** Base path for property listings with optional city. Use for links and redirects. */
export const getPropertyListingsPath = (citySlug) =>
  `/property-listings/${citySlug ?? DEFAULT_CITY_SLUG}`;

/** Property details URL: prefer slug path (/property-details/:slug), fallback to query id for legacy. */
export const getPropertyDetailsUrl = (property) => {
  const slug = property?.slug;
  if (slug) return `/property-details/${encodeURIComponent(slug)}`;
  const id = property?._id ?? property?.id;
  if (id) return `/property-details?id=${encodeURIComponent(id)}`;
  return "/property-details";
};
