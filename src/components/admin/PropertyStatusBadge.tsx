import React from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface PropertyStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished';
  size?: 'sm' | 'md' | 'lg';
}

const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({ status, size = 'md' }) => {
  const statusConfig = {
    pending: { 
      label: 'Menunggu Review', 
      className: 'bg-yellow-100 text-yellow-800', 
      icon: Clock 
    },
    approved: { 
      label: 'Disetujui', 
      className: 'bg-blue-100 text-blue-800', 
      icon: CheckCircle 
    },
    rejected: { 
      label: 'Ditolak', 
      className: 'bg-red-100 text-red-800', 
      icon: XCircle 
    },
    published: { 
      label: 'Dipublikasi', 
      className: 'bg-green-100 text-green-800', 
      icon: Eye 
    },
    unpublished: { 
      label: 'Tidak Dipublikasi', 
      className: 'bg-gray-100 text-gray-800', 
      icon: XCircle 
    },
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };
  
  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${config.className} ${sizeClasses[size]}`}>
      <Icon size={iconSizes[size]} className="mr-1" />
      {config.label}
    </span>
  );
};

export default PropertyStatusBadge;