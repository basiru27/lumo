import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ListingForm from '../components/ListingForm';

export default function EditListing() {
  const { id } = useParams();
  const nav = useNavigate();
  
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => axios.get(`/api/listings/${id}`).then(r => r.data)
  });

  if (isLoading) return <div className='p-4 text-center'>Loading...</div>;
  if (!listing) return <div className='p-4 text-center'>Listing not found</div>;

  const initial = {
    ...listing,
    region: listing.regions?.name,
    category: listing.categories?.name
  };

  return (
    <div className='p-4 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-primary'>Edit Listing</h1>
      <ListingForm initial={initial} onSuccess={() => nav(`/listings/${id}`)} />
    </div>
  );
}
