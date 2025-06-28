import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import UserNavigation from './UserNavigation';
import { useAuth } from '../../contexts/AuthContext';

const UserLayout: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs = [
      { path: '/', label: 'Home' },
      { path: '/user', label: 'User Area' }
    ];
    
    pathnames.forEach((value, index) => {
      if (value === 'user') return; // Skip 'user' as it's already included
      
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      let label = value.charAt(0).toUpperCase() + value.slice(1);
      
      // Replace with more user-friendly names
      if (value === 'properties') label = 'My Properties';
      if (value === 'dashboard') label = 'Dashboard';
      
      breadcrumbs.push({ path, label });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Access Denied</h2>
          <p className="text-neutral-600 mb-6">You need to be logged in to access this area.</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex text-sm mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <ChevronRight size={16} className="mx-2 text-neutral-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-neutral-600 font-medium">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="text-primary hover:underline">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserNavigation />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;