import { Link, useNavigate } from 'react-router-dom';
import ListingForm from '../components/ListingForm';

export default function CreateListing() {
  const nav = useNavigate();

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
            <span className="text-gray-900 font-medium">Create Listing</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create a Listing
            </h1>
            <p className="text-gray-500">
              Fill in the details below to post your item for sale. Be descriptive to attract buyers.
            </p>
          </div>

          {/* Form */}
          <ListingForm onSuccess={() => nav('/')} />
        </div>
      </div>
    </div>
  );
}
