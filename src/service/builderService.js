import api from "./api";

/**
 * GET /api/client/builders
 * Response: { totalCount, totalPages, page, limit, search, builders }
 */
export const getBuilders = async (params = {}) => {
  const { data } = await api.get("/api/client/builders", {
    params: { limit: 8, page: 1, ...params, has_logo: true },
  });
  return data;
};
