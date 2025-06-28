import React from 'react';
import { Crown, Star } from 'lucide-react';

interface PremiumBadgeProps {
  variant?: 'crown' | 'star' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ 
  variant = 'crown', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  if (variant === 'text') {
    return (
      <span className={`
        inline-flex items-center font-semibold rounded-full
        bg-gradient-to-r from-yellow-400 to-yellow-600 text-white
        ${sizeClasses[size]} ${className}
      `}>
        <Crown size={iconSizes[size]} className="mr-1" />
        Premium
      </span>
    );
  }

  if (variant === 'star') {
    return (
      <div className={`
        inline-flex items-center justify-center rounded-full
        bg-gradient-to-r from-yellow-400 to-yellow-600 text-white
        w-8 h-8 ${className}
      `}>
        <Star size={iconSizes[size]} fill="currentColor" />
      </div>
    );
  }

  return (
    <div className={`
      inline-flex items-center justify-center rounded-full
      bg-gradient-to-r from-yellow-400 to-yellow-600 text-white
      w-8 h-8 ${className}
    `}>
      <Crown size={iconSizes[size]} />
    </div>
  );
};

export default PremiumBadge;