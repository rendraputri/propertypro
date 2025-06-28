import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, Home, MessageSquare, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardData {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  totalInquiries: number;
  favoriteCount: number;
  recentActivity: {
    id: string;
    type: string;
    message: string;
    date: string;
  }[];
  propertyPerformance: {
    id: string;
    title: string;
    views: number;
    inquiries: number;
    favorites: number;
  }[];
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: DashboardData = {
        totalProperties: 12,
        activeProperties: 8,
        totalViews: 1247,
        totalInquiries: 34,
        favoriteCount: 56,
        recentActivity: [
          {
            id: '1',
            type: 'view',
            message: 'Someone viewed your property "Modern Apartment in Jakarta"',
            date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
          },
          {
            id: '2',
            type: 'inquiry',
            message: 'New inquiry received for "Family House in Bandung"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
          },
          {
            id: '3',
            type: 'favorite',
            message: 'Your property "Luxury Villa in Bali" was added to favorites',
            date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
          },
          {
            id: '4',
            type: 'view',
            message: 'Someone viewed your property "Office Space in Jakarta"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
          }
        ],
        propertyPerformance: [
          {
            id: '1',
            title: 'Modern Apartment in Jakarta',
            views: 423,
            inquiries: 12,
            favorites: 18
          },
          {
            id: '2',
            title: 'Family House in Bandung',
            views: 287,
            inquiries: 8,
            favorites: 15
          },
          {
            id: '3',
            title: 'Luxury Villa in Bali',
            views: 356,
            inquiries: 9,
            favorites: 21
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalytics = async () => {
    // This would be implemented to get more detailed analytics
    console.log('Getting detailed analytics...');
  };

  const getNotifications = async () => {
    // This would be implemented to get user notifications
    console.log('Getting notifications...');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle size={24} className="mr-2" />
          <h2 className="text-xl font-semibold">Error</h2>
        </div>
        <p className="text-neutral-700">{error}</p>
        <button 
          onClick={getDashboardData}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | User Area</title>
        <meta name="description" content="View your property dashboard and analytics" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-neutral-600">
            Here's an overview of your property performance and recent activities.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Properties</p>
                <p className="text-2xl font-bold text-neutral-900">{dashboardData.totalProperties}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Home size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Active Listings</p>
                <p className="text-2xl font-bold text-neutral-900">{dashboardData.activeProperties}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Home size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Total Views</p>
                <p className="text-2xl font-bold text-neutral-900">{dashboardData.totalViews}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Inquiries</p>
                <p className="text-2xl font-bold text-neutral-900">{dashboardData.totalInquiries}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <MessageSquare size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Favorites</p>
                <p className="text-2xl font-bold text-neutral-900">{dashboardData.favoriteCount}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-neutral-700">Property</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-700">Views</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-700">Inquiries</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-700">Favorites</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-700">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.propertyPerformance.map((property) => {
                  const conversionRate = property.views > 0 
                    ? ((property.inquiries / property.views) * 100).toFixed(1) 
                    : '0.0';
                    
                  return (
                    <tr key={property.id} className="border-b hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-neutral-900">{property.title}</div>
                      </td>
                      <td className="py-3 px-4 text-center">{property.views}</td>
                      <td className="py-3 px-4 text-center">{property.inquiries}</td>
                      <td className="py-3 px-4 text-center">{property.favorites}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <TrendingUp size={16} className="mr-1 text-green-600" />
                          <span>{conversionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => {
              const getIcon = () => {
                switch (activity.type) {
                  case 'view':
                    return <Eye size={16} className="text-blue-600" />;
                  case 'inquiry':
                    return <MessageSquare size={16} className="text-yellow-600" />;
                  case 'favorite':
                    return <Heart size={16} className="text-red-600" />;
                  default:
                    return <AlertCircle size={16} className="text-neutral-600" />;
                }
              };
              
              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.round(diffMs / (1000 * 60));
                const diffHours = Math.round(diffMs / (1000 * 60 * 60));
                const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                
                if (diffMins < 60) {
                  return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
                } else if (diffHours < 24) {
                  return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else {
                  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                }
              };
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {getIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900">{activity.message}</p>
                    <p className="text-xs text-neutral-500">{formatDate(activity.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {dashboardData.recentActivity.length === 0 && (
            <div className="text-center py-8">
              <p className="text-neutral-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;