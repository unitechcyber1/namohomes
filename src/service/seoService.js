import api from "./api";

export const getSeoData = async (path) => {
  if (!path) {
    throw new Error("SEO path is required");
  }

  const response = await api.get(`/api/client/seos-data/${path}`);

  // Support a few common API response shapes
  const data =
    response?.data?.data ??
    response?.data?.seo ??
    response?.data ??
    response;

  return data || null;
};

