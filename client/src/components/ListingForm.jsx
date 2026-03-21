import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { resizeImage } from '../lib/imageResize';
import { enqueue } from '../lib/offlineQueue';
import { GAMBIAN_REGIONS, CATEGORIES } from '../constants/regions';
import axios from 'axios';

export default function ListingForm({ initial = {}, onSuccess }) {
  const [form, setForm] = useState({
    title:'', description:'', price:'', region:'', category:'', contact:'', ...initial
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingSync, setPending] = useState(false);

  async function uploadImage(file) {
    const resized = await resizeImage(file);
    const path = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
    const { error } = await supabase.storage
      .from('listing-images').upload(path, resized, { contentType: 'image/webp' });
    if (error) throw error;
    return supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!navigator.onLine) {
        await enqueue({ ...form, image_url, token });
        setPending(true);
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-listings');
        }
        return;
      }

      await axios(initial.id ? {
        method: 'PUT',
        url: `/api/listings/${initial.id}`,
        data: { ...form, image_url, price: parseFloat(form.price) },
        headers: { Authorization: `Bearer ${token}` }
      } : {
        method: 'POST',
        url: '/api/listings',
        data: { ...form, image_url, price: parseFloat(form.price) },
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  }

  if (pendingSync) return (
    <div className='p-4 text-yellow-700 bg-yellow-50 rounded border border-yellow-200'>
      Your listing is queued and will be posted automatically when you're back online.
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className='space-y-4 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <input required minLength={3} maxLength={100} placeholder='Title'
        value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
        className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary' />
      
      <textarea required minLength={10} maxLength={2000} placeholder='Description'
        value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
        className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary' rows={4} />
      
      <div className='relative'>
        <span className='absolute left-4 top-3.5 text-gray-500 font-medium'>GMD</span>
        <input type='number' min={0} required placeholder='Price'
          value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
          className='w-full border border-gray-300 rounded-lg p-3 pl-14 focus:outline-none focus:border-primary' />
      </div>

      <div className='flex gap-2'>
        <select required value={form.region}
          onChange={e => setForm(f => ({...f, region: e.target.value}))}
          className='w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-primary'>
          <option value=''>Select Region</option>
          {GAMBIAN_REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select required value={form.category}
          onChange={e => setForm(f => ({...f, category: e.target.value}))}
          className='w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-primary'>
          <option value=''>Select Category</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <input required placeholder='Contact (phone or email)'
        value={form.contact} onChange={e => setForm(f => ({...f, contact: e.target.value}))}
        className='w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-primary' />

      <input type='file' accept='image/*'
        onChange={e => setImageFile(e.target.files[0])} 
        className='w-full border border-gray-300 rounded-lg p-2 bg-gray-50 focus:outline-none focus:border-primary' />

      {error && <p className='text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100'>{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
      
      <button type='submit' disabled={loading}
        className='w-full bg-primary text-white rounded-lg py-3 mt-4 font-semibold hover:bg-opacity-90 transition disabled:opacity-50'>
        {loading ? 'Saving...' : 'Save Listing'}
      </button>
    </form>
  );
}
