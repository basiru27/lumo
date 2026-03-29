import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Button, Badge, Skeleton, useToast } from '../components/ui';

export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();
  
  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => axios.get(`/api/listings/${id}`).then(r => r.data)
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return axios.delete(`/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    },
    onSuccess: () => { 
      toast.success('Listing deleted', 'Your listing has been removed.');
      qc.invalidateQueries(['listings']); 
      nav('/'); 
    },
    onError: (error) => {
      toast.error('Delete failed', error.response?.data?.error || 'Could not delete listing.');
    }
  });

  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23e4e4e7'%3E%3Crect width='800' height='600'/%3E%3Cpath d='M350 280h100v40h-100z' fill='%23a1a1aa'/%3E%3Ccircle cx='400' cy='260' r='30' fill='%23a1a1aa'/%3E%3C/svg%3E`;

  if (isLoading) return <ListingDetailSkeleton />;
  
  if (isError || !listing) {
    return (
      <div className="container-app py-16 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-500 mb-6">This listing may have been removed or doesn't exist.</p>
          <Link to="/">
            <Button variant="primary">Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.user_id;

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
            <span className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              <img 
                src={listing.image_url || placeholderImage} 
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = placeholderImage; }}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant="default" size="lg" className="bg-white/95 backdrop-blur-sm shadow-sm">
                  {listing.categories?.name || 'Other'}
                </Badge>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{listing.regions?.name}</p>
                  <p className="text-sm text-gray-500">The Gambia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h1>
              <p className="text-3xl font-extrabold text-primary-600 mb-6">
                GMD {Number(listing.price).toLocaleString()}
              </p>

              {/* Contact Section */}
              {user ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-accent-50 to-orange-50 border border-accent-100">
                    <p className="text-sm font-medium text-accent-800 mb-1">Contact Seller</p>
                    <p className="text-lg font-semibold text-accent-900">{listing.contact}</p>
                  </div>
                  <Button variant="accent" size="lg" className="w-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Message Seller
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      Sign in to view contact information
                    </p>
                  </div>
                  <Link to="/login" className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Sign In to Contact
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-medium hover:underline">
                      Register
                    </Link>
                  </p>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Manage Listing
                  </p>
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="w-full"
                    onClick={() => nav(`/listings/${id}/edit`)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Listing
                  </Button>
                  <Button 
                    variant="danger-outline" 
                    size="md" 
                    className="w-full"
                    loading={deleteMutation.isPending}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
                        deleteMutation.mutate();
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Listing
                  </Button>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-warning-50 rounded-xl border border-warning-200 p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-warning-800 mb-1">Safety Tips</p>
                  <ul className="text-sm text-warning-700 space-y-1">
                    <li>• Meet in a public place</li>
                    <li>• Don't pay in advance</li>
                    <li>• Inspect the item before buying</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingDetailSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="bg-white border-b border-gray-200">
        <div className="container-app py-4">
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="container-app py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-10 w-1/2 mb-6" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
