import React from 'react';
import SearchBox from '../common/SearchBox';

const HeroSection: React.FC = () => {
  return (
    <section className="relative">
      {/* Hero Image */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-white text-3xl md:text-4xl lg:text-5xl mb-4">
              Temukan Rumah Impian Anda di <span className="text-primary">Properti Pro</span>
            </h1>
            <p className="text-white text-lg md:text-xl mb-8 max-w-2xl">
              Platform jual beli dan sewa properti terpercaya dengan ribuan pilihan properti di seluruh Indonesia
            </p>
            
            <div className="w-full lg:max-w-3xl">
              <SearchBox variant="hero" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-primary">10,000+</p>
              <p className="text-neutral-600 text-sm">Properti Tersedia</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-primary">34</p>
              <p className="text-neutral-600 text-sm">Provinsi</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-primary">500+</p>
              <p className="text-neutral-600 text-sm">Agen Terpercaya</p>
            </div>
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-primary">15,000+</p>
              <p className="text-neutral-600 text-sm">Klien Puas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;