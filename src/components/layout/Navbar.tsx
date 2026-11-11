import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useWishlist } from '@/features/wishlist/WishlistContext';
import {
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [userDropdownOpen]);

  const isLinkActive = (targetPath: string) => {
    // If target is anchor link on landing page (e.g. /#how-it-works)
    if (targetPath.includes('#')) {
      const hash = targetPath.split('#')[1];
      return location.pathname === '/' && location.hash === `#${hash}`;
    }

    const [targetPathname, targetQuery] = targetPath.split('?');
    if (location.pathname !== targetPathname) {
      return false;
    }

    const currentParams = new URLSearchParams(location.search);

    // If link has query parameters (e.g. ?occasion=wedding)
    if (targetQuery) {
      const targetParams = new URLSearchParams(targetQuery);
      let match = true;
      targetParams.forEach((val, key) => {
        if (currentParams.get(key) !== val) {
          match = false;
        }
      });
      return match;
    }

    // If target is base /catalog, it is active only when no specific occasion filter is active
    const currentOccasion = currentParams.get('occasion');
    return !currentOccasion || currentOccasion === 'all';
  };

  const navLinks = [
    { name: 'Collection', path: '/catalog' },
    { name: 'Weddings', path: '/catalog?occasion=wedding' },
    { name: 'Black Tie', path: '/catalog?occasion=gala' },
    { name: 'How It Works', path: '/#how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-brand-50/95 backdrop-blur-md border-b border-champagne-200/80 transition-all">
      {/* Luxury Editorial Announcement Bar */}
      <div className="bg-charcoal-950 text-champagne-200 text-[10px] sm:text-[11px] py-2 px-4 text-center tracking-[0.2em] uppercase font-medium border-b border-charcoal-800 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
        <span>Complimentary White-Glove Courier Delivery & Eco-Sanitization Included on All Couture</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-charcoal-700 hover:text-charcoal-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-center group text-center">
          <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium text-charcoal-950 group-hover:text-brand-600 transition-colors">
            RENTIQUE
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-charcoal-500 font-semibold -mt-1">
            Couture Archive
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-xs uppercase tracking-widest font-medium transition-colors hover:text-brand-600',
                  active
                    ? 'text-brand-600 font-semibold border-b border-brand-500 pb-0.5'
                    : 'text-charcoal-700'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Wishlist, Rentals, User Profile) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart className="w-5 h-5 hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Customer Rentals */}
          <Link
            to="/profile"
            className="relative p-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
            title="My Rentals"
            aria-label="My Rentals"
          >
            <ShoppingBag className="w-5 h-5 hover:scale-110 transition-transform" />
          </Link>

          {/* User Account Menu */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full transition-all focus:outline-none ring-2 ring-transparent hover:ring-champagne-300"
                aria-label="User Account Menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-300 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-luxury shadow-2xl border border-champagne-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                  {/* Active Profile Header */}
                  <div className="px-5 pb-3 border-b border-champagne-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-400 block">
                      Client Account
                    </span>
                    <p className="text-sm font-semibold text-charcoal-900 mt-0.5">{user.name}</p>
                    <p className="text-xs text-charcoal-500 truncate">{user.email}</p>
                  </div>

                  {/* Navigation Links inside Dropdown */}
                  <div className="py-2 px-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs text-charcoal-700 hover:bg-champagne-50 hover:text-charcoal-900 rounded-lg transition-colors"
                    >
                      <span>My Bookings & Rentals</span>
                      <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-xs text-charcoal-700 hover:bg-champagne-50 hover:text-charcoal-900 rounded-lg transition-colors"
                    >
                      <span>Saved Wishlist ({wishlistCount})</span>
                      <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
                    </Link>
                  </div>

                  <div className="border-t border-champagne-100 pt-2 px-2">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest font-semibold text-charcoal-800 hover:text-brand-600 transition-colors py-1.5 px-3 rounded-lg border border-champagne-300 hover:border-brand-400 bg-white shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-champagne-200 bg-brand-50 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block text-sm uppercase tracking-wider font-medium py-2 transition-colors',
                  active
                    ? 'text-brand-700 font-bold'
                    : 'text-charcoal-800 hover:text-brand-600'
                )}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-champagne-200 space-y-2">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm py-1.5 text-charcoal-800"
            >
              <span>Wishlist</span>
              <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm py-1.5 text-charcoal-800"
            >
              My Rentals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
