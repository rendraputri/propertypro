import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface LocationCardProps {
  name: string;
  province: string;
  image: string;
  propertyCount: number;
  slug: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  name, 
  province, 
  image, 
  propertyCount, 
  slug 
}) => {
  return (
    <Link 
      to={`/lokasi/${slug}`} 
      className="relative overflow-hidden rounded-2xl group h-60"
      aria-label={`Lihat properti di ${name}, ${province}`}
    >
      <img 
        src={image} 
        alt={`Properti di ${name}`} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300 flex flex-col justify-end p-5">
        <h3 className="font-heading text-white font-semibold text-xl mb-1 transform group-hover:translate-y-0 transition-transform duration-300">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-200 text-sm">{province}</p>
            <p className="text-white text-sm">{propertyCount} properti</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-0 translate-x-4">
            <ArrowRight className="text-primary" size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};

const PopularLocations: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-accent mb-2">
            Lokasi Populer
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Jelajahi properti di lokasi-lokasi strategis dan berkembang di seluruh Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 lg:row-span-2">
            <LocationCard 
              name="Jakarta Selatan"
              province="DKI Jakarta"
              image="https://images.pexels.com/photos/2437856/pexels-photo-2437856.jpeg"
              propertyCount={1254}
              slug="jakarta-selatan"
            />
          </div>
          <div>
            <LocationCard 
              name="Bandung"
              province="Jawa Barat"
              image="https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg"
              propertyCount={823}
              slug="bandung"
            />
          </div>
          <div>
            <LocationCard 
              name="Surabaya"
              province="Jawa Timur"
              image="https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg"
              propertyCount={645}
              slug="surabaya"
            />
          </div>
          <div>
            <LocationCard 
              name="Bali"
              province="Bali"
              image="https://images.pexels.com/photos/4112236/pexels-photo-4112236.jpeg"
              propertyCount={489}
              slug="bali"
            />
          </div>
          <div>
            <LocationCard 
              name="Yogyakarta"
              province="DI Yogyakarta"
              image="https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg"
              propertyCount={378}
              slug="yogyakarta"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;