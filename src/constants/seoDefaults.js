/**
 * Paths for which the backend has SEO data (GET /api/client/seos-data/:path).
 * For any other path we use DEFAULT_SEO without calling the API (avoids 404).
 * Add paths here when the backend has an SEO record for them.
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
  url: "https://www.namohomesindia.com",
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

