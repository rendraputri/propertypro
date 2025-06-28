import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Move } from 'lucide-react';
import { Property } from '../../types';
import { formatPrice } from '../../utils/formatter';
import { premiumService } from '../../services/premiumService';
import PremiumPropertyCard from '../premium/PremiumPropertyCard';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Check if this property has premium listing
  const premiumListing = premiumService.getPremiumListing(property.id);

  const handleAnalyticsUpdate = (type: 'view' | 'inquiry' | 'favorite') => {
    if (premiumListing) {
      premiumService.updateAnalytics(property.id, type);
    }
  };

  // If property has premium listing, use PremiumPropertyCard
  if (premiumListing) {
    return (
      <PremiumPropertyCard 
        property={property} 
        premiumListing={premiumListing}
        onAnalyticsUpdate={handleAnalyticsUpdate}
      />
    );
  }

  // Standard property card
  const {
    id,
    title,
    price,
    priceUnit,
    purpose,
    type,
    location,
    bedrooms,
    bathrooms,
    buildingSize,
    images,
  } = property;

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <Link to={`/properti/${id}`}>
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-2 right-2 z-10">
          <button 
            className="bg-white p-1.5 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors duration-300"
            aria-label="Simpan properti ini"
          >
            <Heart size={18} />
          </button>
        </div>
        <div className="absolute top-2 left-2 z-10">
          <span className={`text-xs font-medium px-2 py-1 rounded-md uppercase ${purpose === 'jual' ? 'bg-primary text-white' : 'bg-success-500 text-white'}`}>
            {purpose === 'jual' ? 'Dijual' : 'Disewa'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-neutral-500 uppercase">
            {type === 'rumah' ? 'Rumah' : 
             type === 'apartemen' ? 'Apartemen' : 
             type === 'ruko' ? 'Ruko' : 
             type === 'tanah' ? 'Tanah' : 'Properti'}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-lg mb-1 truncate">
          <Link to={`/properti/${id}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        <p className="text-primary font-heading font-bold text-lg mb-3">
          {formatPrice(price, priceUnit)}
          {purpose === 'sewa' && <span className="text-sm font-normal text-neutral-500">/bulan</span>}
        </p>

        <div className="flex items-center text-neutral-500 text-sm mb-3">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {location.district}, {location.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex justify-between text-neutral-700 border-t border-neutral-200 pt-3">
          {bedrooms !== undefined && (
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span className="text-sm">{bedrooms}</span>
            </div>
          )}
          
          {bathrooms !== undefined && (
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span className="text-sm">{bathrooms}</span>
            </div>
          )}
          
          {buildingSize !== undefined && (
            <div className="flex items-center">
              <Move size={16} className="mr-1" />
              <span className="text-sm">{buildingSize} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;