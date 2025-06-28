import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Akses Ditolak | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-red-600" />
          </div>
          
          <h1 className="font-heading font-bold text-2xl text-accent mb-4">
            Akses Ditolak
          </h1>
          
          <p className="text-neutral-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
          
          <div className="space-y-3">
            <Link to="/admin/dashboard" className="w-full btn-primary flex items-center justify-center">
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Dashboard
            </Link>
            
            <Link to="/" className="w-full btn-secondary flex items-center justify-center">
              Ke Website Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;