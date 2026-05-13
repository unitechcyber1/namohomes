import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSEO } from "../hooks/useSEO";
import { DEFAULT_SEO } from "../constants/seoDefaults";

function pickFirstString(...candidates) {
  for (const c of candidates) {
    if (c == null) continue;
    const s = String(c).trim();
    if (s) return s;
  }
  return "";
}

const SEO = ({ path, staticSeo }) => {
  const { seo, loading } = useSEO({ path, staticSeo });

  useEffect(() => {
    if (!seo?.script) return;

    const scriptContent = String(seo.script).trim();
    if (!scriptContent) return;

    const scriptEl = document.createElement("script");

    // Try to be schema-friendly; fall back to default if needed
    scriptEl.type = "application/ld+json";

    // If backend already sends full <script> tag, extract inner content
    const match = scriptContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const inner = match ? match[1] : scriptContent;

    scriptEl.innerHTML = inner;
    document.head.appendChild(scriptEl);

    return () => {
      if (scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [seo?.script]);

  if (loading && !seo) {
    return null;
  }

  const title =
    pickFirstString(
      seo?.title,
      seo?.page_title,
      seo?.pageTitle,
      seo?.meta_title,
      seo?.metaTitle,
      seo?.open_graph?.title,
      seo?.twitter?.title
    ) || DEFAULT_SEO.title;
  const description =
    pickFirstString(
      seo?.description,
      seo?.header_description,
      seo?.open_graph?.description,
      seo?.twitter?.description,
      seo?.meta_description,
      seo?.metaDescription
    ) || DEFAULT_SEO.description;
  const robots =
    seo?.robots || (seo?.index === false ? "noindex,nofollow" : "index,follow");
  const keywords = seo?.keywords || "";
  const canonical = seo?.url || "";

  const ogTitle = pickFirstString(seo?.open_graph?.title, title);
  const ogDescription = pickFirstString(seo?.open_graph?.description, description);

  const twitterTitle = pickFirstString(seo?.twitter?.title, title);
  const twitterDescription = pickFirstString(seo?.twitter?.description, description);

  return (
    <Helmet prioritizeSeoTags>
      {title && <title>{title}</title>}

      {description && (
        <meta name="description" content={description} />
      )}

      {robots && <meta name="robots" content={robots} />}

      {keywords && <meta name="keywords" content={keywords} />}

      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && (
        <meta property="og:description" content={ogDescription} />
      )}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      {twitterTitle && (
        <meta name="twitter:title" content={twitterTitle} />
      )}
      {twitterDescription && (
        <meta name="twitter:description" content={twitterDescription} />
      )}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;

