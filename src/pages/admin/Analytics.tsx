import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  MapPin,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AnalyticsData } from '../../types/analytics';
import { analyticsService } from '../../services/analyticsService';
import MetricCard from '../../components/admin/charts/MetricCard';
import BarChart from '../../components/admin/charts/BarChart';
import LineChart from '../../components/admin/charts/LineChart';
import PieChart from '../../components/admin/charts/PieChart';
import DataTable, { Column } from '../../components/admin/DataTable';
import { useToast } from '../../contexts/ToastContext';

const Analytics: React.FC = () => {
  const { showError } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getAnalyticsData(dateRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      showError('Error', 'Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = () => {
    if (!analyticsData) return;
    
    // Export analytics data as JSON
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && !analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-red-800">Failed to load analytics data</h2>
        <p className="text-red-700 mb-4">There was an error loading the analytics data.</p>
        <button 
          onClick={handleRefresh}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Prepare data for charts
  const listingsByTypeData = Object.entries(analyticsData.listingsByType).map(([type, count]) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
  }));

  const listingsByLocationData = analyticsData.listingsByLocation.slice(0, 6).map(item => ({
    label: item.province,
    value: item.count,
  }));

  const userRegistrationData = analyticsData.userRegistrations.slice(-14); // Last 14 days

  const priceRangeData = analyticsData.priceAnalysis.priceRanges.map(item => ({
    label: item.range,
    value: item.count,
  }));

  // Agent performance table columns
  const agentColumns: Column<typeof analyticsData.agentPerformance[0]>[] = [
    {
      key: 'agentName',
      title: 'Nama Agen',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-primary">
              {record.agentName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'totalListings',
      title: 'Total Listing',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'activeListings',
      title: 'Listing Aktif',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'totalViews',
      title: 'Total Views',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'totalInquiries',
      title: 'Total Inquiry',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'conversionRate',
      title: 'Conversion Rate',
      sortable: true,
      render: (value) => `${value}%`,
    },
  ];

  return (
    <div>
      <Helmet>
        <title>Analytics | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Analytics</h1>
            <p className="text-neutral-600">Analisis performa dan insights platform</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-2 text-sm ${
                    dateRange === range 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {range === '7d' ? '7 Hari' :
                   range === '30d' ? '30 Hari' :
                   range === '90d' ? '90 Hari' : '1 Tahun'}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            
            <button
              onClick={handleExport}
              className="btn-primary flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Listing"
          value={analyticsData.overview.totalListings.toLocaleString()}
          change={8.5}
          changeLabel="vs bulan lalu"
          icon={<Home size={24} />}
          color="bg-blue-500"
        />
        
        <MetricCard
          title="Total Pengguna"
          value={analyticsData.overview.totalUsers.toLocaleString()}
          change={12.3}
          changeLabel="vs bulan lalu"
          icon={<Users size={24} />}
          color="bg-green-500"
        />
        
        <MetricCard
          title="Total Views"
          value={analyticsData.overview.totalViews.toLocaleString()}
          change={15.7}
          changeLabel="vs bulan lalu"
          icon={<Eye size={24} />}
          color="bg-primary"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={`${analyticsData.overview.conversionRate}%`}
          change={2.1}
          changeLabel="vs bulan lalu"
          icon={<TrendingUp size={24} />}
          color="bg-purple-500"
        />
      </div>

      {/* Active Listings Today/Week */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MetricCard
          title="Listing Aktif Hari Ini"
          value={analyticsData.activeListingsToday.toLocaleString()}
          change={5.2}
          changeLabel="vs kemarin"
          icon={<Calendar size={24} />}
          color="bg-yellow-500"
        />
        
        <MetricCard
          title="Listing Aktif Minggu Ini"
          value={analyticsData.activeListingsThisWeek.toLocaleString()}
          change={8.9}
          changeLabel="vs minggu lalu"
          icon={<Calendar size={24} />}
          color="bg-indigo-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Listings by Type */}
        <BarChart
          data={listingsByTypeData}
          title="Listing Berdasarkan Tipe"
          height={300}
          formatValue={(value) => value.toLocaleString()}
        />
        
        {/* Listings by Location */}
        <PieChart
          data={listingsByLocationData}
          title="Listing Berdasarkan Lokasi"
          size={250}
          showPercentages={true}
        />
      </div>

      {/* User Registrations Over Time */}
      <div className="mb-8">
        <LineChart
          data={userRegistrationData.map(item => ({
            date: item.date,
            value: item.count,
          }))}
          title="Registrasi Pengguna (14 Hari Terakhir)"
          height={300}
          color="#10B981"
          formatValue={(value) => (value !== undefined && value !== null ? value.toLocaleString() : 'N/A')}
        />
      </div>

      {/* Price Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Price Ranges */}
        <BarChart
          data={priceRangeData}
          title="Distribusi Harga Properti"
          height={300}
          formatValue={(value) => value.toLocaleString()}
        />
        
        {/* Average Price by Type */}
        <BarChart
          data={Object.entries(analyticsData.priceAnalysis.averageByType).map(([type, price]) => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            value: price,
          }))}
          title="Harga Rata-rata Berdasarkan Tipe"
          height={300}
          formatValue={(value) => `${value} M`}
        />
      </div>

      {/* Popular Locations */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Lokasi Populer</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.popularLocations.slice(0, 8).map((location, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-neutral-900">{location.name}</h4>
                  <MapPin size={16} className="text-neutral-400" />
                </div>
                <p className="text-2xl font-bold text-primary mb-1">
                  {location.count.toLocaleString()}
                </p>
                <div className="flex items-center text-sm">
                  <TrendingUp size={12} className="text-green-500 mr-1" />
                  <span className="text-green-600">+{location.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Kategori Populer</h3>
          
          <div className="space-y-4">
            {analyticsData.popularCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Home size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900">{category.name}</h4>
                    <p className="text-sm text-neutral-500">{category.percentage}% dari total</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900">
                    {category.count.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingUp size={12} className="text-green-500 mr-1" />
                    <span className="text-green-600">+{category.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Performa Agen</h3>
          </div>
          
          <DataTable
            data={analyticsData.agentPerformance}
            columns={agentColumns}
            pagination={false}
            searchable={false}
          />
        </div>
      </div>

      {/* Performance Metrics Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={analyticsData.performanceMetrics.slice(-14).map(item => ({
            date: item.date,
            value: item.views,
          }))}
          title="Views Harian (14 Hari Terakhir)"
          height={250}
          color="#3B82F6"
          formatValue={(value) => (value !== undefined && value !== null ? value.toLocaleString() : 'N/A')}
        />
        
        <LineChart
          data={analyticsData.performanceMetrics.slice(-14).map(item => ({
            date: item.date,
            value: item.inquiries,
          }))}
          title="Inquiries Harian (14 Hari Terakhir)"
          height={250}
          color="#10B981"
          formatValue={(value) => (value !== undefined && value !== null ? value.toLocaleString() : 'N/A')}
        />
      </div>
    </div>
  );
};

export default Analytics;