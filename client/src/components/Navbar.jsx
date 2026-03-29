import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-safe">
      <nav className="container-app">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              Lumo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Browse
            </Link>
            {user && (
              <Link
                to="/listings/new"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/listings/new') 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sell
              </Link>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <Link to="/listings/new" className="hidden sm:block">
                  <Button variant="accent" size="sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post Listing
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg py-2 mt-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500">Logged in</p>
                      </div>
                      <button
                        onClick={signOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Browse Listings
              </Link>
              {user && (
                <Link
                  to="/listings/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/listings/new') 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Post a Listing
                </Link>
              )}
              {!user && (
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
