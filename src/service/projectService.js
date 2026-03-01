import api from "./api";

/**
 * Get project list (with filters / pagination)
 */
export const getProjects = async (params = {}) => {
  try {
    const { data } = await api.get("/api/client/projects-page", {
      params,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search projects
 */
export const searchProjects = async (params = {}) => {
  try {
    const { data } = await api.get("/api/client/search-projects", {
      params,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single project by ID (MongoDB _id)
 */
export const getProjectById = async (id) => {
  try {
    const { data } = await api.get(`/api/client/projects/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get single project by slug (for SEO-friendly URLs)
 */
export const getProjectBySlug = async (slug) => {
  try {
    const { data } = await api.get(`/api/client/projects/slug/${slug}`);
    return data;
  } catch (error) {
    throw error;
  }
};
