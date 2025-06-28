import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false 
}) => {
  const { isAuthenticated, loading, isAdmin, isSuperAdmin, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // For admin routes, redirect to admin login
    if (requireAdmin || requireSuperAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    // For user dashboard routes, redirect to regular login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin()) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // Check if user account is suspended
  if (user?.status === 'suspended') {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;