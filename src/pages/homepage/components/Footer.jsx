import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { createPageUrl } from "../../../utils/createPageUrl";
import { useState, useEffect } from "react";
import logo from "../../../assets/namohomes-logo.svg"
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);
  const footerSections = [
    {
      title: "For Buyers",
      links: [
        { label: "Search Properties", path: "/property-listings" },
        { label: "Mortgage Calculator", path: "/mortgage-calculator" },
        { label: "Buyer\'s Guide", path: "/buyers-guide" },
        { label: "Neighborhood Info", path: "/neighborhoods" },
      ],
    },
    {
      title: "For Sellers",
      links: [
        { label: "List Your Property", path: "/list-property" },
        { label: "Home Valuation", path: "/home-valuation" },
        { label: "Seller\'s Guide", path: "/sellers-guide" },
        { label: "Market Reports", path: "/market-reports" },
      ],
    },
    {
      title: "For Agents",
      links: [
        { label: "Agent Dashboard", path: "/agent-dashboard" },
        { label: "Join Our Team", path: "/join-team" },
        { label: "Agent Resources", path: "/agent-resources" },
        { label: "Training Center", path: "/training" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact", path: "/contact-us" },
        { label: "Careers", path: "/careers" },
        { label: "Press", path: "/press" },
      ],
    },
  ];
  useEffect(() => {
    const loadCategories = async () => {
      //   const data = await base44.entities.Category.filter({ status: 'active' }, 'display_order', 10);
      const data = [];
      if (data.length > 0) {
        setCategories(data);
      } else {
        setCategories(defaultCategories);
      }
    };
    loadCategories();
  }, []);

  const defaultCategories = [
    //   { name: 'Coworking', slug: 'coworking', description: 'Modern shared workspaces', icon: 'coworking', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
    {
      name: "Residential",
      slug: "residential",
      description: "Your dream home awaits",
      icon: "residential",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    },
    {
      name: "Commercial",
      slug: "commercial",
      description: "Business properties",
      icon: "commercial",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    },
    {
      name: "SCO Plots",
      slug: "sco_plots",
      description: "Shop-Cum-Office spaces",
      icon: "sco_plots",
      image:
        "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80",
    },
    {
      name: "Office Spaces",
      slug: "office",
      description: "Premium office solutions",
      icon: "office",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" },
  ];

  return (
  
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-4 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div >
            <Link
                          to="/"
                          className="flex items-center micro-interaction"
                          aria-label="NAMOHOMES - Go to homepage"
                        >
                          <img
                            src={logo}
                            alt="NamoHomes"
                            className="h-10 space-y-4 mb-5 filter brightness-0 invert"
                          />
                        </Link>
            <p className="text-slate-400 mb-6">
              Your trusted partner for premium real estate across India.
              Verified listings, transparent deals.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/property-listings"
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  to={createPageUrl("Blog")}
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Insights & Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-slate-400 hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-3">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={createPageUrl(`Listings/${cat.slug}`)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                {/* <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />*/}
                <span className="text-slate-400">
                  Phase 1 Metro Station, Golf course road, Gurugram, Haryana
                  122002
                </span>
              </li>
              <li>
                <a
                  href="tel:+919873040405"
                  className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {/* <Phone className="w-5 h-5 text-amber-500" /> */}
                  +91 98730 40405
                </a>
              </li>
              <li>
                <a
                  href="mailto:namohomes@outlook.com"
                  className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {/* <Mail className="w-5 h-5 text-amber-500" /> */}
                  namohomes@outlook.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} NamoHomes. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-slate-500 hover:text-amber-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-amber-400 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-amber-400 transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
