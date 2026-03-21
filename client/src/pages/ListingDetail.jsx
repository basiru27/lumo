import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();
  
  const { data: listing, isLoading } = useQuery({
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
      qc.invalidateQueries(['listings']); 
      nav('/'); 
    }
  });

  if (isLoading) return <div className='p-4 max-w-2xl mx-auto text-center'>Loading...</div>;
  if (!listing) return <div className='p-4 max-w-2xl mx-auto text-center'>Listing not found.</div>;

  const isOwner = user?.id === listing.user_id;

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Link to='/' className='text-primary hover:underline mb-4 inline-block font-medium'>&larr; Back to Listings</Link>
      <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
        {listing.image_url && 
          <img src={listing.image_url} alt={listing.title} 
               className='w-full h-80 object-cover border-b border-gray-100' />}
        <div className='p-6 md:p-8'>
          <h1 className='text-3xl font-bold text-gray-800 tracking-tight'>{listing.title}</h1>
          <p className='text-primary text-4xl font-extrabold my-4'>
            GMD {Number(listing.price).toLocaleString()}
          </p>
          <div className='bg-gray-50 p-5 rounded-lg mb-6 shadow-sm border border-gray-100'>
            <p className='text-gray-700 whitespace-pre-wrap leading-relaxed'>{listing.description}</p>
          </div>
          <div className='flex gap-3 mb-6 text-sm font-medium text-gray-600'>
            <span className='bg-gray-100 px-4 py-1.5 rounded-full'>{listing.regions?.name}</span>
            <span className='bg-gray-100 px-4 py-1.5 rounded-full'>{listing.categories?.name}</span>
          </div>
          {user && (
            <div className='mt-8 p-5 border-l-4 border-accent bg-orange-50 rounded-r-lg'>
              <p className='font-semibold text-orange-900 mb-1'>Contact Information:</p>
              <p className='text-orange-800 text-xl font-medium'>{listing.contact}</p>
            </div>
          )}
          {!user && (
            <div className='mt-8 p-5 bg-gray-50 rounded-lg text-center border border-gray-100'>
              <p className='text-gray-600'>
                <Link to='/login' className='text-primary font-semibold hover:underline'>Log in</Link> to view contact information.
              </p>
            </div>
          )}

          {isOwner && (
            <div className='flex gap-4 mt-8 pt-6 border-t border-gray-100'>
              <button onClick={() => nav(`/listings/${id}/edit`)}
                className='flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg py-3 font-semibold'>
                Edit Listing
              </button>
              <button onClick={() => { if(window.confirm('Are you sure you want to delete this listing?')) deleteMutation.mutate() }}
                className='flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-lg py-3 font-semibold shadow-sm'>
                Delete Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
