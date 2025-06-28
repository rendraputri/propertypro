import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  MapPin, 
  Flag, 
  BarChart3, 
  Settings,
  X,
  Shield,
  Tags,
  AlertTriangle,
  History,
  Crown
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Pengguna', path: '/admin/users' },
    { icon: Home, label: 'Properti', path: '/admin/properties' },
    { icon: Crown, label: 'Premium Ads', path: '/admin/premium' },
    { icon: Tags, label: 'Kategori', path: '/admin/categories' },
    { icon: MapPin, label: 'Lokasi', path: '/admin/locations' },
    { icon: Flag, label: 'Laporan', path: '/admin/reports' },
    { icon: History, label: 'Riwayat Moderasi', path: '/admin/moderation-history' },
    { icon: BarChart3, label: 'Analitik', path: '/admin/analytics' },
    { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-lg text-accent">
              Admin Panel
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-neutral-500 hover:text-neutral-700"
          >
            <X size={20} />
          </button>
        </div>
        
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
                    onClick={onClose}
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
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;