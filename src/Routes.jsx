// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Test from "./pages/test";
// import ErrorBoundary from "components/ErrorBoundary";

// Page imports
import Homepage from "./pages/homepage";
import PropertyListings from "./pages/property-listings";
import { PropertyListingsByMicrolocationRoute } from "./pages/property-listings";
import NewLaunchProjects from "./pages/new-launch-projects";
import PropertyDetails from "./pages/property-details";
import AuthPage from "./pages/login";
// import AgentDashboard from "pages/agent-dashboard";
// import UserProfileSettings from "pages/user-profile-settings";
import NotFound from "./pages/NotFound";
import Listingcategory from "./pages/homepage/components/Listingcategory";
import ContactUsPage from "./pages/contact-us";

const Routes = () => {
  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */}
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<Homepage />} />
        <Route path="/property-listings" element={<PropertyListings />} />
        <Route path="/residential-properties-in-gurgaon" element={<PropertyListings projectType="residential" />} />
        <Route path="/commercial-properties-in-gurgaon" element={<PropertyListings projectType="commercial" />} />
        <Route path="/sco-plots-in-gurgaon" element={<PropertyListings plansType="sco" />} />
        <Route path="/new-launch-projects" element={<NewLaunchProjects />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/listings/:category" element={<Listingcategory />} />
        <Route path="/test" element={<Test />} />

        {/* Dynamic microlocation pages: /golf-course-road, /sohna-road, etc. */}
        <Route path="/:microlocationSlug" element={<PropertyListingsByMicrolocationRoute />} />

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  );
};

export default Routes;