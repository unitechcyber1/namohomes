import api from "./api";

/**
 * Resolve the SEO document from axios response.data (flat or { data | result | seo }).
 * @param {unknown} top
 */
function resolveSeoDocument(top) {
  if (!top || typeof top !== "object") return top;
  const candidates = [top.data, top.result, top.seo, top.payload].filter(
    (x) => x && typeof x === "object"
  );
  for (const doc of candidates) {
    if (
      doc.title != null ||
      doc.description != null ||
      doc.page_title != null ||
      doc.open_graph != null ||
      doc.twitter != null
    ) {
      return doc;
    }
  }
  return top;
}

export const getSeoData = async (path) => {
  if (!path) {
    throw new Error("SEO path is required");
  }

  const response = await api.get(
    `/api/client/seos-data/${encodeURIComponent(String(path).trim())}`
  );

  const raw =
    response?.data?.data ??
    response?.data?.result ??
    response?.data?.seo ??
    response?.data ??
    response;

  const doc = resolveSeoDocument(raw);
  return doc || null;
};
