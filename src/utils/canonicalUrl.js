import { SITE_ORIGIN } from "../constants/seoDefaults";

/**
 * Absolute self-referencing canonical URL for the current route.
 * Uses window.location.origin in the browser (staging/prod correct); falls back to SITE_ORIGIN in SSR/tests.
 *
 * @param {string} pathname — e.g. /residential-properties-in-gurgaon (from React Router)
 */
export function buildCanonicalUrl(pathname) {
  const pathOnly = (pathname || "/").split("?")[0].split("#")[0] || "/";
  const normalized = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;

  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? String(window.location.origin).replace(/\/$/, "")
      : String(SITE_ORIGIN).replace(/\/$/, "");

  if (normalized === "/") {
    return `${origin}/`;
  }
  return `${origin}${normalized}`;
}
