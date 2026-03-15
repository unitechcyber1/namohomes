import React from "react";
import { useLocation } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const FooterSeoContent = () => {
  const location = useLocation();
  const { seo } = useSEO();

  // Skip on property details page
  if (location.pathname.startsWith("/property-details")) {
    return null;
  }

  const footerTitle = seo?.footer_title;
  const footerDescription = seo?.footer_description;

  if (!footerTitle && !footerDescription) {
    return null;
  }

  return (
    <section className="bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {footerTitle && (
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            {footerTitle}
          </h2>
        )}
        {footerDescription && (
          <div
            className="prose prose-sm md:prose-base max-w-none text-gray-700"
            // Content is authored in a trusted CMS, so we render the HTML it provides.
            dangerouslySetInnerHTML={{ __html: footerDescription }}
          />
        )}
      </div>
    </section>
  );
};

export default FooterSeoContent;

