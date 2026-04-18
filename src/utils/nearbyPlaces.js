/**
 * Nearby POI blocks (metro, school, etc.) may live on the project root, under location, or under nearby.
 * Distance may be a number or a string like "2.5 km" — Number("2.5 km") is NaN without parsing.
 */

/** @param {unknown} distRaw */
export function parseDistanceValue(distRaw) {
  if (distRaw == null || distRaw === "") return null;
  if (typeof distRaw === "number" && !Number.isNaN(distRaw)) return distRaw;
  const s = String(distRaw).trim().replace(/,/g, "");
  const m = s.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isNaN(n) ? null : n;
}

function snakeToCamelKey(snake) {
  return snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/** @param {Record<string, unknown>} obj */
export function readNearbyBool(obj, snakeKey) {
  if (!obj || typeof obj !== "object") return false;
  const camelKey = snakeToCamelKey(snakeKey);
  const v = obj[snakeKey] ?? obj[camelKey];
  return v === true || v === "true" || v === 1 || v === "1";
}

/**
 * First non-empty detail object from root, location, or nearby wrappers.
 * @param {Record<string, unknown> | null | undefined} project
 */
export function pickNearbyDetail(project, snakeKey, camelKey) {
  if (!project || typeof project !== "object") return null;

  const containers = [
    project,
    project.location,
    project.nearby,
    project.nearBy,
    project.near_by,
  ].filter((c) => c && typeof c === "object");

  for (const container of containers) {
    const v = container[snakeKey] ?? container[camelKey];
    if (v == null) continue;
    if (Array.isArray(v)) {
      if (v.length > 0) return v;
      continue;
    }
    if (typeof v === "object" && v !== null) {
      if (Array.isArray(v)) continue;
      if (Object.keys(v).length > 0) return v;
    }
  }
  return null;
}

/**
 * @param {unknown} raw — subdocument or array of subdocuments
 * @param {string} isNearKey — e.g. is_near_metro
 */
export function parseNearbySubdoc(raw, isNearKey) {
  if (raw == null) return null;
  const obj = Array.isArray(raw) ? raw[0] : raw;
  if (!obj || typeof obj !== "object") return null;

  const rawName = obj.name ?? obj.place_name ?? obj.title ?? obj.label;
  const name =
    rawName != null && typeof rawName === "object" && rawName !== null && "name" in rawName
      ? String(rawName.name ?? "").trim()
      : String(rawName ?? "").trim();
  const distRaw = obj.distance ?? obj.dist ?? obj.km ?? obj.Distance;
  const distance = parseDistanceValue(distRaw);
  const isNear = readNearbyBool(obj, isNearKey);

  if (!name && distance == null && !isNear) return null;

  return { name: name || "—", distance, isNear };
}
