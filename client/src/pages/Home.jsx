import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { GAMBIAN_REGIONS, CATEGORIES } from '../constants/regions';
import { Button, Select, EmptyState, SkeletonListingGrid } from '../components/ui';

export default function Home() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['listings', q, region, cat, page],
    queryFn: () => axios.get('/api/listings', {
      params: { q, region, category: cat, page, limit }
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const listings = data || [];
  const hasMore = listings.length === limit;
  const hasFilters = q || region || cat;

  const clearFilters = () => {
    setQ('');
    setRegion('');
    setCat('');
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-app py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Buy & Sell in
              <span className="block text-accent-400">The Gambia</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-xl">
              The trusted marketplace for Gambians. Find great deals in your region or post your items to sell locally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/listings/new">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Post Free Ad
                </Button>
              </Link>
              <a href="#listings">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Browse Listings
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="container-app pb-8">
          <div className="grid grid-cols-3 gap-4 max-w-lg">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">8</div>
              <div className="text-sm text-primary-200">Regions</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-2xl md:text-3xl font-bold text-white">8</div>
              <div className="text-sm text-primary-200">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">Free</div>
              <div className="text-sm text-primary-200">To Post</div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section id="listings" className="container-app py-12">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar value={q} onChange={(val) => { setQ(val); setPage(1); }} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
              <Select
                value={region}
                onChange={e => { setRegion(e.target.value); setPage(1); }}
                options={GAMBIAN_REGIONS}
                placeholder="All Regions"
                containerClassName="sm:w-44"
              />
              <Select
                value={cat}
                onChange={e => { setCat(e.target.value); setPage(1); }}
                options={CATEGORIES}
                placeholder="All Categories"
                containerClassName="sm:w-44"
              />
            </div>
          </div>
          
          {/* Active Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filters:</span>
              <div className="flex flex-wrap gap-2">
                {q && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    "{q}"
                    <button onClick={() => setQ('')} className="hover:text-primary-900">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {region && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {region}
                    <button onClick={() => setRegion('')} className="hover:text-primary-900">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {cat && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {cat}
                    <button onClick={() => setCat('')} className="hover:text-primary-900">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {hasFilters ? 'Search Results' : 'Latest Listings'}
            </h2>
            {!isLoading && listings.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Showing {listings.length} listing{listings.length !== 1 ? 's' : ''}
                {page > 1 && ` (page ${page})`}
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <SkeletonListingGrid count={6} />}

        {/* Error State */}
        {isError && (
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Failed to load listings"
            description="Something went wrong while fetching listings. Please try again."
            action={refetch}
            actionLabel="Try Again"
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && listings.length === 0 && (
          <EmptyState
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title={hasFilters ? "No listings found" : "No listings yet"}
            description={
              hasFilters 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Be the first to post a listing and reach buyers in your area."
            }
            action={hasFilters ? clearFilters : () => window.location.href = '/listings/new'}
            actionLabel={hasFilters ? "Clear Filters" : "Post First Listing"}
          />
        )}

        {/* Listings Grid */}
        {!isLoading && !isError && listings.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>
              <span className="text-sm text-gray-500 px-4">
                Page {page}
              </span>
              <Button
                variant="secondary"
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
              >
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="container-app py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to sell?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Post your listing for free and reach thousands of potential buyers across The Gambia.
          </p>
          <Link to="/listings/new">
            <Button variant="accent" size="lg">
              Post Your Listing Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
