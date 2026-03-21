import { useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';

export default function CreateListing() {
  const nav = useNavigate();
  return (
    <div className='p-4 max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6 text-primary'>Create Listing</h1>
      <ListingForm onSuccess={() => nav('/')} />
    </div>
  );
}
