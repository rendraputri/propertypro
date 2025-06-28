import React from 'react';
import { Eye, MessageSquare, Heart, TrendingUp, Calendar, Users, MapPin, Clock } from 'lucide-react';
import { PremiumListing } from '../../types/premium';
import { format, subDays } from 'date-fns';

interface PremiumAnalyticsDashboardProps {
  premiumListing: PremiumListing;
}

const PremiumAnalyticsDashboard: React.FC<PremiumAnalyticsDashboardProps> = ({ 
  premiumListing 
}) => {
  const { analytics, endDate } = premiumListing;
  const daysRemaining = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  // Generate last 7 days data for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayData = analytics.dailyViews.find(d => d.date === date);
    return {
      date: format(subDays(new Date(), 6 - i), 'MMM dd'),
      views: dayData?.views || 0
    };
  });

  const maxViews = Math.max(...last7Days.map(d => d.views), 1);

  const stats = [
    {
      title: 'Total Views',
      value: analytics.views.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      title: 'Inquiries',
      value: analytics.inquiries.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: 'Favorites',
      value: analytics.favorites.toLocaleString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Heart,
      color: 'bg-red-500'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Premium Analytics Dashboard</h2>
            <p className="text-yellow-100">Track your premium listing performance</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-yellow-100 mb-2">
              <Clock size={20} className="mr-2" />
              <span>Premium Status</span>
            </div>
            <div className="text-2xl font-bold">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    {stat.change} from last week
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Daily Views (Last 7 Days)</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-full space-x-2">
              {last7Days.map((day, index) => {
                const height = (day.views / maxViews) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="relative flex-1 flex items-end w-full">
                      <div
                        className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t transition-all duration-300 hover:opacity-80 min-h-[4px]"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={`${day.views} views`}
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-neutral-600">
                        {day.views}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-neutral-600 text-center">
                      {day.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Traffic Sources</h3>
          <div className="space-y-4">
            {analytics.topSources.length > 0 ? (
              analytics.topSources.map((source, index) => {
                const percentage = (source.count / analytics.views) * 100;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-neutral-700 capitalize">{source.source}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-neutral-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-neutral-600 w-12 text-right">
                        {source.count}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <MapPin size={48} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500">No traffic data available yet</p>
                <p className="text-sm text-neutral-400">Data will appear as visitors view your listing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">3.2x</div>
            <div className="text-sm text-blue-700">More views than standard listings</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">2.1x</div>
            <div className="text-sm text-green-700">Higher inquiry rate</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-2">85%</div>
            <div className="text-sm text-yellow-700">Above average performance</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <TrendingUp size={20} className="text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Optimize Your Photos</h4>
              <p className="text-sm text-blue-700">
                Add more high-quality images to increase engagement. Premium listings with 15+ photos get 40% more views.
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <MessageSquare size={20} className="text-green-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Respond Quickly</h4>
              <p className="text-sm text-green-700">
                Your current response time is excellent! Keep responding to inquiries within 2 hours to maintain high conversion rates.
              </p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
            <Calendar size={20} className="text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Renewal Reminder</h4>
              <p className="text-sm text-yellow-700">
                Your premium listing expires in {daysRemaining} days. Renew now to maintain your enhanced visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumAnalyticsDashboard;