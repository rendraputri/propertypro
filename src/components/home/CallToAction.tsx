import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Heart } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
            Siap Menemukan Properti Impian Anda?
          </h2>
          <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
            Properti Pro membantu Anda menemukan properti ideal dengan ribuan pilihan properti dari seluruh Indonesia
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jual" className="btn-primary py-3 px-6 flex items-center justify-center">
              <Search size={20} className="mr-2" />
              Cari Properti
            </Link>
            <Link 
              to="/dashboard/listings/new" 
              className="btn-secondary py-3 px-6 flex items-center justify-center bg-white text-accent hover:bg-neutral-100"
              aria-label="Pasang Iklan Properti"
            >
              <Home size={20} className="mr-2" />
              Pasang Iklan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;