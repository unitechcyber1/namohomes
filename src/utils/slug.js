/**
 * Convert URL slug to display name (e.g. "golf-course-road" → "Golf Course Road")
 */
export function slugToName(slug) {
  if (!slug || typeof slug !== "string") return "";
  return slug
    .trim()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Convert display name to URL slug (e.g. "Golf Course Road" → "golf-course-road")
 */
export function nameToSlug(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
