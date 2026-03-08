import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import logo from '../../assets/namohomes-logo.svg';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // Mock user data - in real app this would come from context/props
  const user = {
    isAuthenticated: true,
    role: 'agent', // 'buyer', 'seller', 'agent'
    name: 'John Smith',
    avatar: '/assets/images/avatar.jpg'
  };

  const navigationItems = [
    {
      label: 'Search Properties',
      path: '/property-listings',
      icon: 'Search',
      roles: ['all']
    },
    {
      label: 'New Launch Projects',
      path: '/new-launch-projects',
      icon: 'LayoutDashboard',
      roles: ['agent']
    },
    {
      label: 'Best Projects',
      path: '/best-projects',
      icon: 'LayoutDashboard',
      roles: ['agent']
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const shouldShowNavItem = (roles) => {
    return roles.includes('all') || roles.includes(user.role);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center micro-interaction"
              aria-label="NAMOHOMES - Go to homepage"
            >
              <img
                src={logo}
                alt="NamoHomes"
                className="h-8 w-auto md:h-10 lg:h-12"
              />
            </Link>
          </div>

          {/* Desktop Navigation + Contact Us */}
          <nav className="hidden md:flex items-center flex-1 justify-end gap-6">
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                shouldShowNavItem(item.roles) && (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium 
                             transition-all duration-200 ease-out micro-interaction
                             ${isActiveRoute(item.path)
                        ? 'bg-primary-100 text-primary border border-primary-500' : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                      }`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/#contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-700 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 ease-out border border-primary hover:border-primary-700"
              >
                <Icon name="MessageCircle" size={18} />
                <span>Contact Us</span>
              </Link>
            </div>
          </nav>

          {/* Mobile menu button (hamburger) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md text-text-primary hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <Icon name="X" size={24} />
            ) : (
              <Icon name="Menu" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-surface border-t border-border z-mobile-menu"
        >
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              shouldShowNavItem(item.roles) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium 
                           transition-all duration-200 ease-out
                           ${isActiveRoute(item.path)
                      ? 'bg-primary-100 text-primary border border-primary-500' : 'text-text-secondary hover:text-text-primary hover:bg-secondary-100'
                    }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
            <div className="pt-3 mt-3 border-t border-border space-y-2">
              <Link
                to="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-base font-semibold text-white bg-primary hover:bg-primary-700 shadow-elevation-1 active:scale-[0.98] transition-all duration-200"
              >
                <Icon name="MessageCircle" size={20} />
                <span>Contact Us</span>
              </Link>
              <a
                href="tel:+919873040405"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-primary hover:text-primary-700"
              >
                <Icon name="Phone" size={18} />
                <span>+91 98730 40405</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;