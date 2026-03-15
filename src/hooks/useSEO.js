import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSeoData } from "../service/seoService";
import { DEFAULT_SEO, SEO_API_PATHS } from "../constants/seoDefaults";
import { routeToSeoPath } from "../utils/routeToSeoPath";

export const useSEO = ({ path, staticSeo } = {}) => {
  const location = useLocation();
  const [seo, setSeo] = useState(DEFAULT_SEO);
  const [loading, setLoading] = useState(!staticSeo);

  useEffect(() => {
    // If SEO is explicitly provided (e.g. property details page), just use it
    if (staticSeo) {
      const merged = normalizeSeo(staticSeo);
      setSeo(merged);
      setLoading(false);
      return;
    }

    const seoPath = path || routeToSeoPath(location.pathname);
    const pathHasSeoOnBackend = SEO_API_PATHS.includes(seoPath);

    if (!pathHasSeoOnBackend) {
      setSeo(DEFAULT_SEO);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchSeo = async () => {
      setLoading(true);
      try {
        const data = await getSeoData(seoPath);
        if (cancelled) return;
        const merged = normalizeSeo(data || {});
        setSeo(merged);
      } catch (err) {
        if (cancelled) return;
        setSeo(DEFAULT_SEO);
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

const normalizeSeo = (raw) => {
  const base = raw || {};

  return {
    ...DEFAULT_SEO,
    ...base,
    twitter: {
      ...DEFAULT_SEO.twitter,
      ...(base.twitter || {}),
    },
    open_graph: {
      ...DEFAULT_SEO.open_graph,
      ...(base.open_graph || {}),
    },
  };
};

