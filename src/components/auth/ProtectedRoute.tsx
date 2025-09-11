import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'staff' | 'admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/auth'
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && profile.role !== requiredRole) {
    // Staff trying to access admin routes
    if (profile.role === 'staff' && requiredRole === 'admin') {
      return <Navigate to="/staff" replace />;
    }
    // Customer trying to access staff/admin routes
    if (profile.role === 'customer' && (requiredRole === 'staff' || requiredRole === 'admin')) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;