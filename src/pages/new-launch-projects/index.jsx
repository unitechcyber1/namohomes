import React from "react";
import PropertyListings from "../property-listings";

/**
 * New Launch Projects page – reuses property-listings UI
 * and filters by project_status: "New Launch"
 */
const NewLaunchProjects = () => {
  return <PropertyListings projectStatus="New Launch" />;
};

export default NewLaunchProjects;
