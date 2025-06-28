import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, Heart, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Properti Pro Logo" className="h-10" />
            <span className="font-heading font-bold text-2xl text-accent">
              <span className="text-primary">Properti</span> Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link to="/jual" className="font-medium hover:text-primary transition-colors">
              Jual
            </Link>
            <Link to="/sewa" className="font-medium hover:text-primary transition-colors">
              Sewa
            </Link>
            <Link to="/agen" className="font-medium hover:text-primary transition-colors">
              Agen
            </Link>
            <Link to="/premium/features" className="font-medium hover:text-primary transition-colors">
              Premium
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/favorit" className="text-neutral-700 hover:text-primary transition-colors">
                  <Heart size={20} />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-neutral-700 hover:text-primary transition-colors">
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                    <span>{user?.full_name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/user/profile" 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Profil Saya
                    </Link>
                    <Link 
                      to="/user/properties" 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Properti Saya
                    </Link>
                    <Link 
                      to="/user/dashboard" 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Dashboard
                    </Link>
                    {user?.role === 'admin' || user?.role === 'superadmin' ? (
                      <Link 
                        to="/admin/dashboard" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        Admin Panel
                      </Link>
                    ) : null}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-neutral-800 hover:text-primary transition-colors">
                  Masuk
                </Link>
                <Link to="/register" className="btn-primary">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <Home size={20} />
              <span>Beranda</span>
            </Link>
            <Link to="/jual" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Jual</span>
            </Link>
            <Link to="/sewa" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Sewa</span>
            </Link>
            <Link to="/agen" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Agen</span>
            </Link>
            <Link to="/premium/features" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
              <span>Premium</span>
            </Link>
            
            <hr className="border-neutral-200" />
            
            {isAuthenticated ? (
              <>
                <Link to="/favorit" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <Heart size={20} />
                  <span>Favorit</span>
                </Link>
                <Link to="/user/profile" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <User size={20} />
                  <span>Profil ({user?.full_name})</span>
                </Link>
                <Link to="/user/dashboard" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <span>Dashboard</span>
                </Link>
                <Link to="/user/properties" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <span>Properti Saya</span>
                </Link>
                {user?.role === 'admin' || user?.role === 'superadmin' ? (
                  <Link to="/admin/dashboard" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                    <span>Admin Panel</span>
                  </Link>
                ) : null}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center space-x-2 py-2 text-red-600"
                >
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-2 py-2" onClick={toggleMenu}>
                  <LogIn size={20} />
                  <span>Masuk</span>
                </Link>
                <Link to="/register" className="btn-primary text-center" onClick={toggleMenu}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;