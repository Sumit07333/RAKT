import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import Button from '../common/Button';
import raktNaviLogo from '../../assets/RaktNavi Logo.png';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Blood', path: '/find-blood' },
    { name: 'Emergency Request', path: '/emergency-request' },
    { name: 'Track Request', path: '/track-request' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Official Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#C41315] rounded-lg p-0.5"
            aria-label="RaktNavi Home"
          >
            <img
              src={raktNaviLogo}
              alt="RaktNavi logo"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-[#C41315] bg-red-50/70'
                    : 'text-[#273741] hover:text-[#C41315] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/operator/login"
              className="text-xs font-semibold text-slate-600 hover:text-[#273741] px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Operator</span>
            </Link>
            <Link to="/find-blood">
              <Button size="sm" variant="primary" icon={Search}>
                Find Blood
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-[#273741] hover:text-[#C41315] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#C41315]"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#E2E8EC] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg" id="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
                isActive(link.path)
                  ? 'text-[#C41315] bg-red-50'
                  : 'text-[#273741] hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/find-blood" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full" icon={Search}>
                Find Blood Availability
              </Button>
            </Link>
            <Link to="/operator/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full" icon={User}>
                Operator Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
