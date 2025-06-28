import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authMessages } from '../utils/authMessages';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword, clearError } = useAuth();
  const { showError, showSuccess, showInfo } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(
        authMessages.register.invalidEmail.title,
        authMessages.register.invalidEmail.message
      );
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      showSuccess(
        authMessages.passwordReset.emailSent.title,
        authMessages.passwordReset.emailSent.message
      );
    } catch (error: any) {
      if (error.message.includes('user not found')) {
        showError(
          authMessages.passwordReset.emailNotFound.title,
          authMessages.passwordReset.emailNotFound.message
        );
      } else {
        showError('Reset Failed', error.message || 'Failed to send reset link. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resetPassword(email);
      showSuccess(
        'Reset Link Sent Again',
        'We\'ve sent another password reset link to your email address.'
      );
    } catch (error: any) {
      showError(
        'Failed to Resend',
        error.message || 'Failed to resend reset link. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <Helmet>
          <title>Email Terkirim | Properti Pro</title>
          <meta name="description" content="Email reset password telah dikirim ke alamat email Anda." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-success-500" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-4">
                  Email Terkirim!
                </h1>
                
                <p className="text-neutral-600 mb-6">
                  Kami telah mengirimkan link reset password ke alamat email:
                </p>
                
                <div className="bg-neutral-50 p-3 rounded-lg mb-6">
                  <p className="font-medium text-accent">{email}</p>
                </div>
                
                <div className="text-sm text-neutral-600 mb-6">
                  <p className="mb-2">
                    Silakan periksa inbox email Anda dan klik link yang diberikan untuk mereset password.
                  </p>
                  <p>
                    Link akan kedaluwarsa dalam 24 jam.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Resend email"
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Ulang Email'}
                  </button>
                  
                  <Link
                    to="/login"
                    className="w-full btn-secondary flex items-center justify-center"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Kembali ke Halaman Masuk
                  </Link>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500">
                    Tidak menerima email?{' '}
                    <button
                      onClick={() => {
                        showInfo(
                          'Check Your Spam Folder',
                          'The reset link email might be in your spam or junk folder. If you still can\'t find it, click "Resend Email".'
                        );
                      }}
                      className="text-primary hover:underline"
                      aria-label="Check spam folder instructions"
                    >
                      Periksa folder spam
                    </button>
                  </p>
                </div>
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
        <title>Lupa Password | Properti Pro</title>
        <meta name="description" content="Reset password akun Properti Pro Anda dengan mudah dan aman." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-primary" />
                </div>
                
                <h1 className="font-heading font-bold text-2xl text-accent mb-2">
                  Lupa Password?
                </h1>
                
                <p className="text-neutral-600">
                  Masukkan alamat email Anda dan kami akan mengirimkan link untuk mereset password
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                </button>
              </form>
              
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
                <p className="text-neutral-600 text-sm">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;