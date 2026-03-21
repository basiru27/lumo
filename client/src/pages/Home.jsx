import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import ListingCard from '../components/ListingCard';
import SearchBar from '../components/SearchBar';
import { GAMBIAN_REGIONS, CATEGORIES } from '../constants/regions';
import { Link } from 'react-router-dom';

export default function Home() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [cat, setCat] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['listings', q, region, cat],
    queryFn: () => axios.get('/api/listings', {
      params: { q, region, category: cat }
    }).then(r => r.data)
  });

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold text-primary'>Gambia Marketplace</h1>
        <Link to='/listings/new' className='bg-accent text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-orange-500 transition'>
          Post
        </Link>
      </div>
      <SearchBar value={q} onChange={setQ} />
      {/* Region + Category filters */}
      <div className='flex gap-2 mt-2 mb-4'>
        <select value={region} onChange={e => setRegion(e.target.value)}
          className='border border-gray-300 rounded px-2 py-2 text-sm flex-1 bg-white focus:outline-none focus:border-primary'>
          <option value=''>All Regions</option>
          {GAMBIAN_REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={cat} onChange={e => setCat(e.target.value)}
          className='border border-gray-300 rounded px-2 py-2 text-sm flex-1 bg-white focus:outline-none focus:border-primary'>
          <option value=''>All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {isLoading && <p className='text-gray-500 py-4 text-center'>Loading listings...</p>}
      <div className='grid gap-4 sm:grid-cols-2'>
        {data?.map(l => <ListingCard key={l.id} listing={l} />)}
        {data?.length === 0 && <p className='text-gray-500 py-4 col-span-2 text-center'>No listings found.</p>}
      </div>
    </div>
  );
}
