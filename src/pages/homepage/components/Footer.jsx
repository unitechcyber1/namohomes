import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { createPageUrl } from "../../../utils/createPageUrl";
import { useState, useEffect } from 'react';
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
        { label: "Neighborhood Info", path: "/neighborhoods" }
      ]
    },
    {
      title: "For Sellers",
      links: [
        { label: "List Your Property", path: "/list-property" },
        { label: "Home Valuation", path: "/home-valuation" },
        { label: "Seller\'s Guide", path: "/sellers-guide" },
        { label: "Market Reports", path: "/market-reports" }
      ]
    },
    {
      title: "For Agents",
      links: [
        { label: "Agent Dashboard", path: "/agent-dashboard" },
        { label: "Join Our Team", path: "/join-team" },
        { label: "Agent Resources", path: "/agent-resources" },
        { label: "Training Center", path: "/training" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact", path: "/contact" },
        { label: "Careers", path: "/careers" },
        { label: "Press", path: "/press" }
      ]
    }
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
    { name: 'Residential', slug: 'residential', description: 'Your dream home awaits', icon: 'residential', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' },
    { name: 'Commercial', slug: 'commercial', description: 'Business properties', icon: 'commercial', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
    { name: 'SCO Plots', slug: 'sco_plots', description: 'Shop-Cum-Office spaces', icon: 'sco_plots', image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80' },
    { name: 'Office Spaces', slug: 'office', description: 'Premium office solutions', icon: 'office', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80' },

  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" }
  ];

  return (
    // <footer className="bg-secondary-700 text-white">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     {/* Main Footer Content */}
    //     <div className="py-12 lg:py-16">
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
    //         {/* Company Info */}
    //         <div className="lg:col-span-2">
    //           <div className="flex items-center space-x-2 mb-4">
    //             <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
    //               <Icon name="Home" size={20} color="white" />
    //             </div>
    //             <span className="text-xl font-semibold font-heading">NAMOHOMES</span>
    //           </div>
    //           <p className="text-secondary-300 mb-6 leading-relaxed">
    //             Your trusted partner in real estate. We connect buyers, sellers, and agents 
    //             to create successful property transactions in all over Gurgaon.
    //           </p>

    //           {/* Contact Info */}
    //           <div className="space-y-2 mb-6">
    //             <div className="flex items-center space-x-2 text-secondary-300">
    //               <Icon name="Phone" size={16} />
    //               <span>+91 9873040405</span>
    //             </div>
    //             <div className="flex items-center space-x-2 text-secondary-300">
    //               <Icon name="Mail" size={16} />
    //               <span>namohomes@outlook.com</span>
    //             </div>
    //             <div className="flex items-center space-x-2 text-secondary-300">
    //               <Icon name="MapPin" size={16} />
    //               <span>Phase 1 Metro Station, Golf course road, Gurugram, Haryana 122002</span>
    //             </div>
    //           </div>

    //           {/* Social Links */}
    //           <div className="flex space-x-4">
    //             {socialLinks.map((social) => (
    //               <a
    //                 key={social.name}
    //                 href={social.url}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center
    //                          hover:bg-primary transition-all duration-200 ease-out micro-interaction"
    //                 aria-label={`Follow us on ${social.name}`}
    //               >
    //                 <Icon name={social.icon} size={18} />
    //               </a>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Footer Links */}
    //         {footerSections.map((section) => (
    //           <div key={section.title}>
    //             <h3 className="text-lg font-semibold mb-4 text-white">
    //               {section.title}
    //             </h3>
    //             <ul className="space-y-2">
    //               {section.links.map((link) => (
    //                 <li key={link.label}>
    //                   <Link
    //                     to={link.path}
    //                     className="text-secondary-300 hover:text-white transition-colors duration-200"
    //                   >
    //                     {link.label}
    //                   </Link>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         ))}
    //       </div>
    //     </div>

    //     {/* Newsletter Signup */}
    //     <div className="py-8 border-t border-secondary-600">
    //       <div className="flex flex-col lg:flex-row items-center justify-between">
    //         <div className="mb-4 lg:mb-0">
    //           <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
    //           <p className="text-secondary-300">
    //             Get the latest property listings and market insights delivered to your inbox.
    //           </p>
    //         </div>
    //         <div className="flex w-full lg:w-auto">
    //           <input
    //             type="email"
    //             placeholder="Enter your email"
    //             className="flex-1 lg:w-64 px-4 py-2 bg-secondary-600 border border-secondary-500 
    //                      rounded-l-md text-white placeholder-secondary-300
    //                      focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
    //           />
    //           <button
    //             className="px-6 py-2 bg-primary text-white rounded-r-md font-medium hover:bg-primary-700 transition-all duration-200 ease-out micro-interaction"
    //           >
    //             Subscribe
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Bottom Footer */}
    //     <div className="py-6 border-t border-secondary-600">
    //       <div className="flex flex-col md:flex-row items-center justify-between">
    //         <div className="text-secondary-300 text-sm mb-4 md:mb-0">
    //           © {currentYear} NAMOHOMES. All rights reserved.
    //         </div>
    //         <div className="flex flex-wrap items-center space-x-6 text-sm">
    //           <Link 
    //             to="/privacy" 
    //             className="text-secondary-300 hover:text-white transition-colors duration-200"
    //           >
    //             Privacy Policy
    //           </Link>
    //           <Link 
    //             to="/terms" 
    //             className="text-secondary-300 hover:text-white transition-colors duration-200"
    //           >
    //             Terms of Service
    //           </Link>
    //           <Link 
    //             to="/cookies" 
    //             className="text-secondary-300 hover:text-white transition-colors duration-200"
    //           >
    //             Cookie Policy
    //           </Link>
    //           <Link 
    //             to="/accessibility" 
    //             className="text-secondary-300 hover:text-white transition-colors duration-200"
    //           >
    //             Accessibility
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              </div>
              <span className="text-2xl font-bold text-white">NamoHomes</span>
            </Link>
            <p className="text-slate-400 mb-6">
              Your trusted partner for premium real estate across India. Verified listings, transparent deals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                {/* <Facebook className="w-5 h-5" /> */}
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                {/* <Twitter className="w-5 h-5" /> */}
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                {/* <Instagram className="w-5 h-5" /> */}
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors">
                {/* <Linkedin className="w-5 h-5" /> */}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to={createPageUrl('Home')} className="text-slate-400 hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to={createPageUrl('Listings')} className="text-slate-400 hover:text-amber-400 transition-colors">All Properties</Link></li>
              <li><Link to={createPageUrl('Blog')} className="text-slate-400 hover:text-amber-400 transition-colors">Insights & Blog</Link></li>
              <li><Link to={createPageUrl('Contact')} className="text-slate-400 hover:text-amber-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-3">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  {/* <Link
                    to={createPageUrl(`Listings?category=${cat.slug}`)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  > */}
                    {cat.name}
                  {/* </Link> */}
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
                <span className="text-slate-400">Phase 1 Metro Station, Golf course road, Gurugram, Haryana 122002</span>
              </li>
              <li>
                <a href="tel:+919873040405" className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors">
                  {/* <Phone className="w-5 h-5 text-amber-500" /> */}
                  +91 98730 40405
                </a>
              </li>
              <li>
                <a href="mailto:namohomes@outlook.com" className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors">
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
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;