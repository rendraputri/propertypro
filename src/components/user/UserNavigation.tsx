import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Home, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserNavigation: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/user/dashboard',
      description: 'Overview and analytics'
    },
    { 
      icon: Home, 
      label: 'My Properties', 
      path: '/user/properties',
      description: 'Manage your listings'
    },
    { 
      icon: User, 
      label: 'Profile', 
      path: '/user/profile',
      description: 'Personal information'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/user/settings',
      description: 'Account preferences'
    }
  ];
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
                }
              `}
            >
              <Icon size={20} className="mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className={`text-xs ${isActive(item.path) ? 'text-white/80' : 'text-neutral-500'}`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} className="mr-3 flex-shrink-0" />
          <div>
            <div className="font-medium">Logout</div>
            <div className="text-xs text-red-500">Sign out of your account</div>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default UserNavigation;