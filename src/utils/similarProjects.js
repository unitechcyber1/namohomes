import { getProjects } from "../service/projectService";
import { getCityName, getLocationName } from "./locationDisplay";
import { nameToSlug } from "./slug";

const SIMILAR_LIMIT = 8;

/** Microlocation name for API `microlocation` query param */
export function getMicrolocationParam(project) {
  const loc = project?.location;
  if (!loc) return "";
  const fromName = getLocationName(loc);
  if (fromName) return fromName;
  const ml = loc.micro_location;
  if (Array.isArray(ml) && ml.length > 0) {
    const first = ml[0];
    if (first != null && typeof first === "object" && first.name) {
      return String(first.name).trim();
    }
  }
  return "";
}

function extractSimilarList(projectPayload) {
  if (!projectPayload || typeof projectPayload !== "object") return [];
  const candidates = [
    projectPayload.similarProjects,
    projectPayload.similar,
    projectPayload.similar_projects,
    projectPayload.relatedProjects,
    projectPayload.nearbyProjects,
  ];
  for (const list of candidates) {
    if (Array.isArray(list) && list.length > 0) return list;
  }
  return [];
}

function isSameProject(a, currentId, currentSlug) {
  const id = a?._id ?? a?.id;
  if (currentId && id && String(id) === String(currentId)) return true;
  if (currentSlug && a?.slug && String(a.slug) === String(currentSlug)) return true;
  return false;
}

/**
 * Load projects in the same area as the current listing (microlocation → city → type).
 * Returns raw API project objects (for PropertyCard).
 */
export async function fetchSimilarProjects(project, { limit = SIMILAR_LIMIT } = {}) {
  if (!project) return [];

  const currentId = project._id ?? project.id;
  const currentSlug = project.slug;

  const embedded = extractSimilarList(project);
  if (embedded.length > 0) {
    return embedded
      .filter((p) => !isSameProject(p, currentId, currentSlug))
      .slice(0, limit);
  }

  const microlocation = getMicrolocationParam(project);
  const city = getCityName(project.location) || "Gurugram";
  const projectType = project.project_type ?? project.propertyType;

  const params = {
    page: 1,
    limit: limit + 4,
  };

  if (microlocation) {
    params.microlocation = microlocation;
  } else if (city) {
    params.city = city;
  }

  if (projectType) {
    params.project_type = projectType;
  }

  try {
    const data = await getProjects(params);
    const projects = data?.projects ?? [];
    return projects
      .filter((p) => !isSameProject(p, currentId, currentSlug))
      .slice(0, limit);
  } catch {
    return [];
  }
}

/** Listing URL for "view all" in same microlocation */
export function getSimilarPropertiesListingUrl(project) {
  const microlocation = getMicrolocationParam(project);
  if (microlocation) {
    const slug = nameToSlug(microlocation);
    return `/property-listings/gurugram/${slug}`;
  }
  const type = project?.project_type ?? project?.propertyType;
  if (type === "residential") return "/residential-properties-in-gurgaon";
  if (type === "commercial") return "/commercial-properties-in-gurgaon";
  return "/property-listings/gurugram";
}

export function getSimilarSectionSubtitle(project) {
  const microlocation = getMicrolocationParam(project);
  const city = getCityName(project?.location) || "Gurgaon";
  if (microlocation) {
    return `More properties in ${microlocation}, ${city}`;
  }
  return `More properties in ${city}`;
}
