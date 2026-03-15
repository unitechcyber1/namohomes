import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSEO } from "../hooks/useSEO";

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

  const title = seo?.title || seo?.page_title || "";
  const description = seo?.description || "";
  const robots =
    seo?.robots || (seo?.index === false ? "noindex,nofollow" : "index,follow");
  const keywords = seo?.keywords || "";
  const canonical = seo?.url || "";

  const ogTitle = seo?.open_graph?.title || title;
  const ogDescription = seo?.open_graph?.description || description;

  const twitterTitle = seo?.twitter?.title || title;
  const twitterDescription = seo?.twitter?.description || description;

  return (
    <Helmet>
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

