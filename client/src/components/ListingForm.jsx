import { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { resizeImage } from '../lib/imageResize';
import { enqueue } from '../lib/offlineQueue';
import { GAMBIAN_REGIONS, CATEGORIES } from '../constants/regions';
import { Button, Input, Textarea, Select, useToast } from './ui';
import axios from 'axios';

export default function ListingForm({ initial = {}, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    region: '',
    category: '',
    contact: '',
    ...initial
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [pendingSync, setPending] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const isEditing = !!initial.id;

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function validate() {
    const newErrors = {};
    if (!form.title || form.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!form.price || parseFloat(form.price) < 0) newErrors.price = 'Please enter a valid price';
    if (!form.region) newErrors.region = 'Please select a region';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.contact || form.contact.length < 5) newErrors.contact = 'Please enter valid contact information';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function uploadImage(file) {
    const resized = await resizeImage(file);
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}.webp`;
    const { error } = await supabase.storage
      .from('listing-images').upload(path, resized, { contentType: 'image/webp' });
    if (error) throw error;
    return supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Get session first to ensure user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('Authentication required', 'Please log in again to post a listing.');
        setLoading(false);
        return;
      }

      let image_url = form.image_url || null;
      
      // Only upload if there's a new file selected
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      // Handle offline
      if (!navigator.onLine) {
        await enqueue({ ...form, image_url, token });
        setPending(true);
        setLoading(false);
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('sync-listings');
        }
        return;
      }

      const listingData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        region: form.region,
        category: form.category,
        contact: form.contact,
      };
      
      // Only include image_url if we have a valid URL
      if (image_url) {
        listingData.image_url = image_url;
      }

      await axios(isEditing ? {
        method: 'PUT',
        url: `/api/listings/${initial.id}`,
        data: listingData,
        headers: { Authorization: `Bearer ${token}` }
      } : {
        method: 'POST',
        url: '/api/listings',
        data: listingData,
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(
        isEditing ? 'Listing updated!' : 'Listing created!',
        isEditing ? 'Your changes have been saved.' : 'Your listing is now live.'
      );
      onSuccess?.();
    } catch (err) {
      const errorData = err.response?.data?.error;
      let errorMessage = err.message;
      
      // Handle Zod validation errors from backend
      if (errorData && typeof errorData === 'object') {
        if (errorData.fieldErrors) {
          // Extract first field error
          const firstField = Object.keys(errorData.fieldErrors)[0];
          if (firstField && errorData.fieldErrors[firstField]?.[0]) {
            errorMessage = `${firstField}: ${errorData.fieldErrors[firstField][0]}`;
          }
        } else if (errorData.formErrors?.length) {
          errorMessage = errorData.formErrors[0];
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
      
      toast.error('Something went wrong', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (pendingSync) {
    return (
      <div className="bg-warning-50 border border-warning-200 rounded-xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-warning-800 mb-2">Queued for Upload</h3>
        <p className="text-warning-700">
          Your listing has been saved and will be posted automatically when you're back online.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Photos
        </label>
        
        {imagePreview ? (
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100">
          Basic Information
        </h2>
        
        <Input
          label="Title"
          placeholder="e.g., iPhone 14 Pro Max - Like New"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          error={errors.title}
          required
          maxLength={100}
        />

        <Textarea
          label="Description"
          placeholder="Describe your item in detail. Include condition, features, reason for selling, etc."
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          error={errors.description}
          required
          rows={5}
          maxLength={2000}
        />

        <div className="relative">
          <Input
            label="Price"
            type="number"
            placeholder="0"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            error={errors.price}
            required
            min={0}
            leftIcon={<span className="text-gray-500 font-medium">GMD</span>}
            className="pl-14"
          />
        </div>
      </div>

      {/* Category & Location */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100">
          Category & Location
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-5">
          <Select
            label="Category"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            options={CATEGORIES}
            placeholder="Select a category"
            error={errors.category}
            required
          />

          <Select
            label="Region"
            value={form.region}
            onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
            options={GAMBIAN_REGIONS}
            placeholder="Select your region"
            error={errors.region}
            required
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100">
          Contact Information
        </h2>
        
        <Input
          label="Contact"
          placeholder="Phone number or email address"
          value={form.contact}
          onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
          error={errors.contact}
          required
          helperText="This will be visible to logged-in users only"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="flex-1"
        >
          {isEditing ? 'Save Changes' : 'Publish Listing'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
