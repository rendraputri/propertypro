import React from 'react';
import { Users, Home, TrendingUp, AlertTriangle, Eye, Plus } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Pengguna',
      value: '12,543',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Properti Aktif',
      value: '8,921',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Home,
      color: 'bg-green-500',
    },
    {
      title: 'Transaksi Bulan Ini',
      value: '1,234',
      change: '+23%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-primary',
    },
    {
      title: 'Laporan Pending',
      value: '45',
      change: '-5%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'Pengguna baru mendaftar: John Doe',
      time: '5 menit yang lalu',
      icon: Users,
    },
    {
      id: 2,
      type: 'property_added',
      message: 'Properti baru ditambahkan: Rumah Minimalis Jakarta',
      time: '15 menit yang lalu',
      icon: Home,
    },
    {
      id: 3,
      type: 'report_submitted',
      message: 'Laporan baru diterima untuk properti #1234',
      time: '1 jam yang lalu',
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard Admin | Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Selamat datang di panel administrasi Properti Pro</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} dari bulan lalu
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Aktivitas Terbaru</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900">{activity.message}</p>
                      <p className="text-xs text-neutral-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <button className="text-sm text-primary hover:underline flex items-center">
                <Eye size={16} className="mr-1" />
                Lihat semua aktivitas
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900">Aksi Cepat</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <Plus size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">Tambah Pengguna</p>
              </button>
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <Home size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">Kelola Properti</p>
              </button>
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <AlertTriangle size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">Review Laporan</p>
              </button>
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <TrendingUp size={24} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-900">Lihat Analitik</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;