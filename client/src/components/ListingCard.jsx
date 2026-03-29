import { Link } from 'react-router-dom';
import { Badge } from './ui';

export default function ListingCard({ listing }) {
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23e4e4e7'%3E%3Crect width='400' height='300'/%3E%3Cpath d='M160 130h80v40h-80z' fill='%23a1a1aa'/%3E%3Ccircle cx='200' cy='115' r='20' fill='%23a1a1aa'/%3E%3C/svg%3E`;
  
  return (
    <Link 
      to={`/listings/${listing.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={listing.image_url || placeholderImage} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm shadow-sm">
            {listing.categories?.name || 'Other'}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
          {listing.title}
        </h3>
        
        {/* Price */}
        <p className="text-xl font-bold text-primary-600 mt-1">
          GMD {Number(listing.price).toLocaleString()}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{listing.regions?.name || 'Unknown'}</span>
        </div>
      </div>
    </Link>
  );
}
