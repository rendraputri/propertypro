import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Crown, 
  Calendar, 
  Eye, 
  Plus, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  premiumListings: number;
  expiredListings: number;
  totalViews: number;
  recentActivity: {
    id: string;
    type: 'listing_created' | 'listing_expired' | 'premium_upgraded';
    message: string;
    date: string;
  }[];
}

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    premiumListings: 0,
    expiredListings: 0,
    totalViews: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user stats
    setTimeout(() => {
      setStats({
        totalListings: 12,
        activeListings: 8,
        premiumListings: 2,
        expiredListings: 4,
        totalViews: 1247,
        recentActivity: [
          {
            id: '1',
            type: 'listing_created',
            message: 'Iklan "Rumah Minimalis Jakarta" berhasil dipublikasi',
            date: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            type: 'premium_upgraded',
            message: 'Iklan "Apartemen Kemang" ditingkatkan ke Premium',
            date: '2024-01-14T15:20:00Z'
          },
          {
            id: '3',
            type: 'listing_expired',
            message: 'Iklan "Ruko Bandung" telah kedaluwarsa',
            date: '2024-01-13T09:15:00Z'
          }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Iklan',
      value: stats.totalListings,
      icon: Home,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Iklan Aktif',
      value: stats.activeListings,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Iklan Premium',
      value: stats.premiumListings,
      icon: Crown,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Iklan Kedaluwarsa',
      value: stats.expiredListings,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard | Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Selamat Datang, {user?.full_name}!
        </h1>
        <p className="text-neutral-600">
          Kelola iklan properti Anda dan pantau performa dengan mudah.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className={card.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/dashboard/listings/new"
              className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Plus size={24} className="text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-900">Tambah Iklan</span>
            </Link>
            <Link
              to="/dashboard/listings"
              className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Home size={24} className="text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-900">Kelola Iklan</span>
            </Link>
            <Link
              to="/dashboard/premium"
              className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <Crown size={24} className="text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-900">Premium</span>
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <TrendingUp size={24} className="text-primary mb-2" />
              <span className="text-sm font-medium text-neutral-900">Profil</span>
            </Link>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Performa Iklan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye size={20} className="text-neutral-500 mr-3" />
                <span className="text-neutral-700">Total Kunjungan</span>
              </div>
              <span className="font-semibold text-neutral-900">{stats.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar size={20} className="text-neutral-500 mr-3" />
                <span className="text-neutral-700">Rata-rata per Iklan</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {stats.activeListings > 0 ? Math.round(stats.totalViews / stats.activeListings) : 0}
              </span>
            </div>
            <div className="pt-4 border-t border-neutral-200">
              <Link
                to="/dashboard/premium"
                className="text-sm text-primary hover:underline"
              >
                Lihat analitik lengkap →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'listing_created' ? 'bg-green-100' :
                activity.type === 'premium_upgraded' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                {activity.type === 'listing_created' && <CheckCircle size={16} className="text-green-600" />}
                {activity.type === 'premium_upgraded' && <Crown size={16} className="text-yellow-600" />}
                {activity.type === 'listing_expired' && <AlertCircle size={16} className="text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900">{activity.message}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(activity.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {stats.recentActivity.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-500">Belum ada aktivitas terbaru</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;