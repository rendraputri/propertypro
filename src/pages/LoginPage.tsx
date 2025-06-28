import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authMessages } from '../utils/authMessages';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { signIn, isAuthenticated, loading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      // Handle specific error messages
      if (error.includes('Invalid login credentials')) {
        showError(
          authMessages.login.invalidCredentials.title,
          authMessages.login.invalidCredentials.message
        );
      } else if (error.includes('user not found')) {
        showError(
          authMessages.login.userNotFound.title,
          authMessages.login.userNotFound.message
        );
      } else if (error.includes('locked')) {
        showError(
          authMessages.login.accountLocked.title,
          authMessages.login.accountLocked.message
        );
      } else if (error.includes('suspended')) {
        showError(
          authMessages.login.accountSuspended.title,
          authMessages.login.accountSuspended.message
        );
      } else if (error.includes('too many requests') || error.includes('rate limit')) {
        showError(
          authMessages.login.tooManyAttempts.title,
          authMessages.login.tooManyAttempts.message
        );
      } else if (error.includes('network') || error.includes('connection')) {
        showError(
          authMessages.login.serverError.title,
          authMessages.login.serverError.message
        );
      } else {
        // Generic error
        showError('Login Failed', error);
      }
    }
  }, [error, showError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password) {
      showError(
        authMessages.login.emptyFields.title,
        authMessages.login.emptyFields.message
      );
      return;
    }
    
    try {
      await signIn(email, password);
      showSuccess(
        authMessages.login.success.title,
        authMessages.login.success.message
      );
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is handled by the useEffect above
      console.error('Login failed:', error);
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'superadmin') => {
    if (type === 'admin') {
      setEmail('admin@propertipro.id');
      setPassword('admin123');
    } else {
      setEmail('superadmin@propertipro.id');
      setPassword('admin123');
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Masuk | Properti Pro</title>
        <meta name="description" content="Masuk ke akun Properti Pro Anda untuk mengakses fitur-fitur eksklusif." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="font-heading font-bold text-2xl text-accent mb-6 text-center">
                Masuk ke <span className="text-primary">Properti Pro</span>
              </h1>
              
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-neutral-700">
                      Ingat saya
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Lupa password?
                  </Link>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-neutral-600">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Daftar sekarang
                  </Link>
                </p>
              </div>

              {/* Demo credentials for testing */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="bg-neutral-50 p-3 rounded-lg">
                  <p className="text-xs text-neutral-600 mb-3">Demo Credentials (Click to fill):</p>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('admin')}
                      className="w-full text-left text-xs bg-white border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50 transition-colors"
                      disabled={loading}
                    >
                      <strong>Admin:</strong> admin@propertipro.id / admin123
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('superadmin')}
                      className="w-full text-left text-xs bg-white border border-neutral-200 rounded px-2 py-1 hover:bg-neutral-50 transition-colors"
                      disabled={loading}
                    >
                      <strong>Super Admin:</strong> superadmin@propertipro.id / admin123
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;