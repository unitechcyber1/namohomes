export const routeToSeoPath = (pathname) => {
  if (!pathname || pathname === "/") {
    return "home";
  }

  try {
    // Strip query/hash if a full URL sneaks in
    const cleanPath = pathname.split("?")[0].split("#")[0];
    const trimmed = cleanPath.replace(/^\/+/, "").replace(/\/+$/, "");
    if (!trimmed) return "home";

    // SEO API expects a single path segment; use base segment for listing pages (e.g. property-listings/gurugram or property-listings/gurugram/dwarka-expressway → property-listings)
    if (trimmed.startsWith("property-listings/")) {
      return "property-listings";
    }
    return trimmed;
  } catch {
    return "home";
  }
};

