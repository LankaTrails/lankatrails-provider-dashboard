import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  if (!isAuthenticated || user?.role !== 'ROLE_PROVIDER') {
    return <Navigate to="/login" replace />;
  }

  return children;
}