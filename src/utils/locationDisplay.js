/**
 * Shared "location line" for cards and detail pages: microlocation / location name + city, not full street address.
 */

/** @param {Record<string, unknown> | null | undefined} location */
export function getCityName(location) {
  if (!location?.city) return "";
  const c = location.city;
  if (typeof c === "string") return c.trim();
  return (c?.name ?? "").trim();
}

/** Local / microlocation name (not full street address) */
/** @param {Record<string, unknown> | null | undefined} location */
export function getLocationName(location) {
  if (!location) return "";
  if (typeof location.name === "string" && location.name.trim()) return location.name.trim();
  const ml = location.micro_location;
  if (Array.isArray(ml) && ml.length > 0) {
    const first = ml[0];
    if (first != null && typeof first === "object" && first.name) return String(first.name).trim();
  }
  const locality = location.locality;
  const area = location.area;
  if (typeof locality === "string" && locality.trim()) return locality.trim();
  if (typeof area === "string" && area.trim()) return area.trim();
  return "";
}

/**
 * "Location name, City" — falls back to full address when parts are missing.
 * @param {Record<string, unknown> | null | undefined} property
 */
export function getLocationLine(property) {
  const loc = property?.location;
  const locName = getLocationName(loc);
  const cityName = getCityName(loc);
  const parts = [locName, cityName].filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return property?.location?.address ?? property?.address ?? "";
}
