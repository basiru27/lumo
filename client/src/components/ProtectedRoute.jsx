import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from './ui';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  return user ? <Outlet /> : <Navigate to='/login' replace />;
}
