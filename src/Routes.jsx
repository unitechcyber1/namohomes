// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useParams } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Test from "./pages/test";
// import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import Homepage from "./pages/homepage";
import PropertyListings from "./pages/property-listings";
import NewLaunchProjects from "./pages/new-launch-projects";
import PropertyDetails from "./pages/property-details";
import AuthPage from "./pages/login";
// import AgentDashboard from "pages/agent-dashboard";
// import UserProfileSettings from "pages/user-profile-settings";
import NotFound from "./pages/NotFound";
import Listingcategory from "./pages/homepage/components/Listingcategory";
import ContactUsPage from "./pages/contact-us";
import { getPropertyListingsPath, DEFAULT_CITY_SLUG } from "./constants/routes";

function RedirectMicrolocationToCity() {
  const { microlocationSlug } = useParams();
  return <Navigate to={`/property-listings/${DEFAULT_CITY_SLUG}/${microlocationSlug}`} replace />;
}

const Routes = () => {
  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */}
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Homepage />} />
        <Route path="/property-listings" element={<Navigate to={getPropertyListingsPath()} replace />} />
        <Route path="/property-listings/:citySlug/:microlocationSlug" element={<PropertyListings />} />
        <Route path="/property-listings/:citySlug" element={<PropertyListings />} />
        <Route path="/residential-properties-in-gurgaon" element={<PropertyListings projectType="residential" />} />
        <Route path="/commercial-properties-in-gurgaon" element={<PropertyListings projectType="commercial" />} />
        <Route path="/sco-plots-in-gurgaon" element={<PropertyListings plansType="sco" />} />
        <Route path="/new-launch-projects" element={<NewLaunchProjects />} />
        <Route path="/property-details/:slug" element={<PropertyDetails />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/listings/:category" element={<Listingcategory />} />
        <Route path="/test" element={<Test />} />

        {/* Legacy: redirect /dwarka-expressway → /property-listings/gurugram/dwarka-expressway */}
        <Route path="/:microlocationSlug" element={<RedirectMicrolocationToCity />} />

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;