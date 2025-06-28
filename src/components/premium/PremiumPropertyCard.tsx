import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Move, Eye, TrendingUp } from 'lucide-react';
import { Property } from '../../types';
import { PremiumListing } from '../../types/premium';
import { formatPrice } from '../../utils/formatter';
import PremiumBadge from './PremiumBadge';

interface PremiumPropertyCardProps {
  property: Property;
  premiumListing?: PremiumListing;
  onAnalyticsUpdate?: (type: 'view' | 'inquiry' | 'favorite') => void;
}

const PremiumPropertyCard: React.FC<PremiumPropertyCardProps> = ({ 
  property, 
  premiumListing,
  onAnalyticsUpdate 
}) => {
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

  const isPremium = !!premiumListing;

  const handleCardClick = () => {
    if (onAnalyticsUpdate) {
      onAnalyticsUpdate('view');
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAnalyticsUpdate) {
      onAnalyticsUpdate('favorite');
    }
  };

  return (
    <div className={`
      card group relative overflow-hidden
      ${isPremium ? 'ring-2 ring-yellow-400 shadow-xl' : ''}
      ${isPremium ? 'transform hover:scale-105' : ''}
      transition-all duration-300
    `}>
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-2 left-2 z-20">
          <PremiumBadge variant="crown" size="sm" />
        </div>
      )}

      {/* Premium Glow Effect */}
      {isPremium && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 pointer-events-none" />
      )}

      {/* Image */}
      <div className={`relative overflow-hidden ${isPremium ? 'h-64' : 'h-48'}`}>
        <Link to={`/properti/${id}`} onClick={handleCardClick}>
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
            onClick={handleFavoriteClick}
          >
            <Heart size={18} />
          </button>
        </div>
        
        <div className="absolute top-2 right-12 z-10">
          <span className={`text-xs font-medium px-2 py-1 rounded-md uppercase ${
            purpose === 'jual' ? 'bg-primary text-white' : 'bg-success-500 text-white'
          }`}>
            {purpose === 'jual' ? 'Dijual' : 'Disewa'}
          </span>
        </div>

        {/* Premium Analytics Preview */}
        {isPremium && premiumListing && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs rounded p-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  <span>{premiumListing.analytics.views}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp size={12} className="mr-1" />
                  <span>{premiumListing.analytics.inquiries}</span>
                </div>
              </div>
              <div className="text-yellow-400 font-semibold">
                {premiumListing.analytics.conversionRate.toFixed(1)}%
              </div>
            </div>
          </div>
        )}
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
        
        <h3 className={`font-heading font-semibold mb-1 truncate ${
          isPremium ? 'text-lg' : 'text-base'
        }`}>
          <Link 
            to={`/properti/${id}`} 
            className="hover:text-primary transition-colors"
            onClick={handleCardClick}
          >
            {title}
          </Link>
        </h3>
        
        <p className={`text-primary font-heading font-bold mb-3 ${
          isPremium ? 'text-xl' : 'text-lg'
        }`}>
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

        {/* Premium Features Indicator */}
        {isPremium && (
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <div className="flex items-center justify-between text-xs text-yellow-700">
              <span className="font-medium">Premium Features Active</span>
              <span className="bg-yellow-100 px-2 py-1 rounded">
                {Math.ceil((new Date(premiumListing!.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumPropertyCard;