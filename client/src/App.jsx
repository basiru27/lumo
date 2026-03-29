import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ui';
import { useOfflineSync } from './hooks/useOfflineSync';

const qc = new QueryClient({
  defaultOptions: { 
    queries: { 
      staleTime: 1000 * 60 * 5,
      retry: 1,
    } 
  }
});

function AppContent() {
  useOfflineSync();
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/listings/:id' element={<ListingDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/listings/new' element={<CreateListing />} />
          <Route path='/listings/:id/edit' element={<EditListing />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
