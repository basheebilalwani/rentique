import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { UserRole } from '@/types/user.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Verifying Credentials..." />
      </div>
    );
  }

  // Not logged in -> redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role mismatch (e.g. customer trying to access admin dashboard)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" state={{ from: location, roleMismatch: true }} replace />;
  }

  return <>{children}</>;
};
