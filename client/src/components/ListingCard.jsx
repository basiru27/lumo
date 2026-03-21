import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <Link to={`/listings/${listing.id}`}
      className='block border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white'>
      {listing.image_url && (
        <img src={listing.image_url} alt={listing.title}
          className='w-full h-40 object-cover' loading='lazy' />
      )}
      <div className='p-3'>
        <h2 className='font-semibold text-base truncate text-gray-800'>{listing.title}</h2>
        <p className='text-primary font-bold'>
          GMD {Number(listing.price).toLocaleString()}
        </p>
        <p className='text-xs text-gray-500 mt-1'>
          {listing.regions?.name} · {listing.categories?.name}
        </p>
      </div>
    </Link>
  );
}
