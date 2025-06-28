import React from 'react';
import { Home, Clock, CheckCircle, Eye, XCircle, TrendingUp } from 'lucide-react';

interface PropertyStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    published: number;
    rejected: number;
    totalViews: number;
    totalInquiries: number;
  };
}

const PropertyStats: React.FC<PropertyStatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Properti',
      value: stats.total.toLocaleString(),
      icon: Home,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Menunggu Review',
      value: stats.pending.toLocaleString(),
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Disetujui',
      value: stats.approved.toLocaleString(),
      icon: CheckCircle,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Dipublikasi',
      value: stats.published.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ditolak',
      value: stats.rejected.toLocaleString(),
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-primary',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">{item.title}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon size={24} className={item.textColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PropertyStats;