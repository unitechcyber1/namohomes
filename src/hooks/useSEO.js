import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSeoData } from "../service/seoService";
import { DEFAULT_SEO } from "../constants/seoDefaults";
import { routeToSeoPath } from "../utils/routeToSeoPath";
import { buildCanonicalUrl } from "../utils/canonicalUrl";

/** Self-referencing canonical for the active route (overrides CMS default homepage URL). */
const withSelfCanonical = (seoLike, pathname) => ({
  ...seoLike,
  url: buildCanonicalUrl(pathname),
});

/** First non-empty string among candidates. */
function pickFirstString(...candidates) {
  for (const c of candidates) {
    if (c == null) continue;
    const s = String(c).trim();
    if (s) return s;
  }
  return "";
}

/**
 * Flatten API SEO payloads and align `title` / `description` for {@link SEO} meta tags.
 * Supports: title, description, page_title, meta_title, nested `seo: { title, description }`, etc.
 */
const normalizeSeo = (raw) => {
  const base = raw && typeof raw === "object" ? raw : {};
  const nested = base.seo && typeof base.seo === "object" ? base.seo : {};
  const merged = { ...DEFAULT_SEO, ...nested, ...base };

  const title =
    pickFirstString(
      merged.title,
      merged.page_title,
      merged.pageTitle,
      merged.meta_title,
      merged.metaTitle,
      merged.open_graph?.title,
      merged.twitter?.title,
      DEFAULT_SEO.title
    ) || DEFAULT_SEO.title;

  const description =
    pickFirstString(
      merged.description,
      merged.header_description,
      merged.open_graph?.description,
      merged.twitter?.description,
      merged.meta_description,
      merged.metaDescription,
      DEFAULT_SEO.description
    ) || DEFAULT_SEO.description;

  return {
    ...merged,
    title,
    page_title: title,
    description,
    twitter: {
      ...DEFAULT_SEO.twitter,
      ...(merged.twitter || {}),
      title: pickFirstString(merged.twitter?.title, title) || title,
      description:
        pickFirstString(merged.twitter?.description, description) || description,
    },
    open_graph: {
      ...DEFAULT_SEO.open_graph,
      ...(merged.open_graph || {}),
      title: pickFirstString(merged.open_graph?.title, title) || title,
      description:
        pickFirstString(merged.open_graph?.description, description) || description,
    },
  };
};

export const useSEO = ({ path, staticSeo } = {}) => {
  const location = useLocation();
  const [seo, setSeo] = useState(() =>
    withSelfCanonical(normalizeSeo({}), location.pathname)
  );
  const [loading, setLoading] = useState(!staticSeo);

  useEffect(() => {
    const pathname = location.pathname;

    // If SEO is explicitly provided (e.g. property details page), just use it
    if (staticSeo) {
      const merged = normalizeSeo(staticSeo);
      setSeo(withSelfCanonical(merged, pathname));
      setLoading(false);
      return;
    }

    const seoPath = path || routeToSeoPath(pathname);

    let cancelled = false;

    const fetchSeo = async () => {
      setLoading(true);
      try {
        const data = await getSeoData(seoPath);
        if (cancelled) return;
        const merged = normalizeSeo(data || {});
        setSeo(withSelfCanonical(merged, pathname));
      } catch {
        if (cancelled) return;
        setSeo(withSelfCanonical(normalizeSeo({}), pathname));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSeo();

    return () => {
      cancelled = true;
    };
    // We intentionally ignore `path` identity changes and only care about its value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, path, staticSeo]);

  return { seo, loading };
};

