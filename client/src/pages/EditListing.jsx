import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ListingForm from '../components/ListingForm';
import { LoadingScreen } from '../components/ui';

export default function EditListing() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => axios.get(`/api/listings/${id}`).then(r => r.data)
  });

  if (isLoading) {
    return <LoadingScreen message="Loading listing..." />;
  }

  if (isError || !listing) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing not found</h2>
        <p className="text-gray-500 mb-6">This listing may have been removed.</p>
        <Link to="/" className="text-primary-600 font-medium hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const initial = {
    ...listing,
    region: listing.regions?.name,
    category: listing.categories?.name
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-app py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to={`/listings/${id}`} className="text-gray-500 hover:text-gray-700 transition-colors truncate max-w-xs">
              {listing.title}
            </Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Edit</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Listing
            </h1>
            <p className="text-gray-500">
              Update your listing details below. Changes will be visible immediately.
            </p>
          </div>

          {/* Form */}
          <ListingForm initial={initial} onSuccess={() => nav(`/listings/${id}`)} />
        </div>
      </div>
    </div>
  );
}
