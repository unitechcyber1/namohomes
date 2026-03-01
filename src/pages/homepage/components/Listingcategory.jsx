import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../../components/ui/Header";
import Icon from "../../../components/AppIcon";
import PropertyCard from "../../../components/cards/PropertyCard";
import { getProjectsByCategory } from "../../../service/projectService";

const Listingcategory = () => {
  const { category } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjectsByCategory(category);

      console.log("Filtered Category Data:", data);

      setProjects(data?.projects || []);
    } catch (error) {
      console.error("Error loading category projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      loadProjects();
    }
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-18">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="text-text-secondary hover:text-text-primary"
              >
                Home
              </Link>

              <Icon
                name="ChevronRight"
                size={14}
                className="text-text-secondary"
              />

              <span className="text-text-primary font-medium capitalize">
                {category}
              </span>
            </nav>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold text-text-primary capitalize">
              {category} Properties
            </h1>
            <p className="text-text-secondary mt-1">
              {loading
                ? "Loading..."
                : `${projects.length} properties found`}
            </p>
          </div>
        </div>

        {/* Property Grid */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card p-4">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-secondary-200 rounded-md mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                      <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                      <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                name="Search"
                size={48}
                className="text-secondary mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No properties found
              </h3>
              <p className="text-text-secondary">
                No projects available in this category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <PropertyCard
                  key={project._id}
                  property={project}   // ✅ important: use "property"
                  variant="card"
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Listingcategory;