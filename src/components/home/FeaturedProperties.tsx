import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PropertyCard from '../common/PropertyCard';
import { properties } from '../../data/properties';

const FeaturedProperties: React.FC = () => {
  // Get featured/promoted properties
  const featuredProperties = properties.filter(property => property.isPromoted).slice(0, 6);

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-accent mb-2">
              Properti Unggulan
            </h2>
            <p className="text-neutral-600">
              Temukan properti terbaik dan terbaru dari seluruh Indonesia
            </p>
          </div>
          <Link
            to="/jual"
            className="flex items-center text-primary font-medium mt-4 md:mt-0 hover:underline"
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;