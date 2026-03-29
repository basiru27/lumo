import Navbar from './Navbar';
import OfflineBanner from './OfflineBanner';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <OfflineBanner />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container-app py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Lumo</span>
          </div>
          <p className="text-sm text-gray-500">
            The Gambia's premier marketplace. Buy and sell locally.
          </p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lumo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
