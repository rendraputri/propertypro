import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authMessages } from '../utils/authMessages';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { updatePassword, loading, error, clearError, session } = useAuth();
  const { showError, showSuccess, showWarning } = useToast();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      showError('Password Reset Failed', error);
    }
  }, [error, showError]);

  useEffect(() => {
    if (!session) {
      showWarning(
        authMessages.passwordReset.invalidToken.title,
        authMessages.passwordReset.invalidToken.message
      );
    }
  }, [session, showWarning]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      showError(
        authMessages.register.passwordTooShort.title,
        authMessages.register.passwordTooShort.message
      );
      return false;
    }
    
    // You can add more password validation rules here
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      showError(
        authMessages.register.passwordMismatch.title,
        authMessages.register.passwordMismatch.message
      );
      return;
    }

    try {
      await updatePassword(password);
      setIsSuccess(true);
      showSuccess(
        authMessages.passwordReset.resetSuccess.title,
        authMessages.passwordReset.resetSuccess.message
      );
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      showError('Password Reset Failed', error.message || 'An error occurred while resetting your password.');
    }
  };

  // Check if user has a valid session (from reset link)
  if (!session) {
    return (
      <Layout>
        <Helmet>
          <title>Link Tidak Valid | Properti Pro</title>
          <meta name="description" content="Link reset password tidak valid atau telah kedaluwarsa." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-yellow-600" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-4">
                  Link Tidak Valid
                </h1>
                
                <p className="text-neutral-600 mb-6">
                  Link reset password tidak valid atau telah kedaluwarsa. Silakan minta link reset password yang baru.
                </p>
                
                <div className="space-y-3">
                  <Link to="/forgot-password" className="w-full btn-primary block">
                    Minta Link Baru
                  </Link>
                  
                  <Link to="/login" className="w-full btn-secondary block">
                    Kembali ke Halaman Masuk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <Layout>
        <Helmet>
          <title>Password Berhasil Direset | Properti Pro</title>
          <meta name="description" content="Password Anda berhasil direset. Silakan masuk dengan password baru." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-success-500" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-4">
                  Password Berhasil Direset!
                </h1>
                
                <p className="text-neutral-600 mb-6">
                  Password Anda telah berhasil direset. Anda akan dialihkan ke halaman masuk dalam beberapa detik.
                </p>
                
                <Link to="/login" className="w-full btn-primary block">
                  Masuk Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Reset Password | Properti Pro</title>
        <meta name="description" content="Buat password baru untuk akun Properti Pro Anda." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} className="text-primary" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-2">
                  Reset Password
                </h1>
                
                <p className="text-neutral-600">
                  Masukkan password baru untuk akun Anda
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Masukkan password baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={loading}
                      aria-describedby="password-requirements"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div id="password-requirements" className="mt-2 text-xs text-neutral-500">
                    <p>Password harus mengandung:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Minimal 8 karakter</li>
                      <li>Huruf besar dan kecil</li>
                      <li>Minimal 1 angka</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Konfirmasi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      aria-describedby="confirm-password-error"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Reset Password'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link to="/login" className="text-primary hover:underline">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;