import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children, requireVerified = true }: {
  children: ReactNode; requireVerified?: boolean;
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireVerified && !user?.isVerified) return <Navigate to="/verify-email" replace />;

  return <>{children}</>;
}
