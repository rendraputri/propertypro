import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  List, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Crown,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Beranda', path: '/dashboard' },
    { icon: List, label: 'Iklan Saya', path: '/dashboard/listings' },
    { icon: Plus, label: 'Tambah Iklan', path: '/dashboard/listings/new' },
    { icon: User, label: 'Profil', path: '/dashboard/profile' },
  ];

  // Add premium dashboard for users with premium listings
  if (user?.role === 'user' || user?.role === 'agent') {
    menuItems.splice(-1, 0, { 
      icon: Crown, 
      label: 'Premium Dashboard', 
      path: '/dashboard/premium' 
    });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-accent">
              <span className="text-primary">Properti</span> Pro
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-500 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-3">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User size={24} className="text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-neutral-900">{user?.full_name}</h3>
              <p className="text-sm text-neutral-500">
                {user?.role === 'agent' ? 'Agen Properti' : 'Pengguna'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-6 mb-4">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Menu Utama
            </h3>
          </div>
          
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-3 mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Keluar
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-neutral-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-500 hover:text-neutral-700"
            >
              <Menu size={20} />
            </button>
            
            <h1 className="text-lg font-semibold text-neutral-800">
              Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard/profile"
                className="text-neutral-500 hover:text-neutral-700"
                title="Pengaturan Profil"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;