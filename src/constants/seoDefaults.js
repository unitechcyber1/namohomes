/**
 * Production site origin for canonical URLs when `window` is unavailable (SSR/tests).
 * In the browser, {@link buildCanonicalUrl} prefers `window.location.origin`.
 */
export const SITE_ORIGIN = "https://www.namohomesindia.com";

/**
 * Legacy allowlist (no longer gates API calls). SEO is fetched for every route key from
 * {@link routeToSeoPath}; keep for docs or tooling if needed.
 * @deprecated
 */
export const SEO_API_PATHS = ["home", "contact-us"];

export const DEFAULT_SEO = {
  page_title: "NamoHomes - Premium Properties in Gurgaon",
  title: "NamoHomes - Premium Properties in Gurgaon",
  description:
    "Discover verified residential and commercial properties in Gurgaon with NamoHomes. Explore new launch projects, prime locations, and investment opportunities.",
  robots: "index,follow",
  index: true,
  keywords:
    "NamoHomes, properties in Gurgaon, real estate, new launch projects, residential, commercial",
  /** Placeholder; useSEO overwrites with self-referencing canonical per route. */
  url: SITE_ORIGIN,
  footer_title: "",
  footer_description: "",
  script: "",
  header_description: "",
  twitter: {
    title: "NamoHomes - Premium Properties in Gurgaon",
    description:
      "Explore verified properties, new launches, and investment opportunities in Gurgaon with NamoHomes.",
  },
  open_graph: {
    title: "NamoHomes - Premium Properties in Gurgaon",
    description:
      "Discover premium residential and commercial properties in Gurgaon with NamoHomes.",
  },
};

