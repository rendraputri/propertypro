import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, DollarSign, Calendar, Eye, Users, BarChart, Download } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DataTable, { Column } from '../../components/admin/DataTable';
import { PremiumListing, PaymentData } from '../../types/premium';
import { premiumService } from '../../services/premiumService';
import { format } from 'date-fns';

const PremiumManagement: React.FC = () => {
  const [premiumListings, setPremiumListings] = useState<PremiumListing[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [selectedListing, setSelectedListing] = useState<PremiumListing | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPremiumData();
  }, []);

  const loadPremiumData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from API
      // For demo, we'll use mock data
      const mockListings: PremiumListing[] = [
        {
          id: 'premium-1',
          propertyId: '1',
          userId: 'user-1',
          plan: {
            id: 'premium-monthly',
            name: 'Premium Listing',
            price: 29.99,
            currency: 'USD',
            duration: 30,
            description: 'Premium listing with enhanced features',
            features: ['Featured placement', 'Analytics', 'Extended gallery']
          },
          status: 'active',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          paymentId: 'payment-1',
          features: [],
          analytics: {
            views: 1250,
            inquiries: 45,
            favorites: 23,
            conversionRate: 3.6,
            dailyViews: [],
            topSources: []
          },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'premium-2',
          propertyId: '2',
          userId: 'user-2',
          plan: {
            id: 'premium-monthly',
            name: 'Premium Listing',
            price: 29.99,
            currency: 'USD',
            duration: 30,
            description: 'Premium listing with enhanced features',
            features: ['Featured placement', 'Analytics', 'Extended gallery']
          },
          status: 'expired',
          startDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          paymentId: 'payment-2',
          features: [],
          analytics: {
            views: 890,
            inquiries: 32,
            favorites: 18,
            conversionRate: 3.6,
            dailyViews: [],
            topSources: []
          },
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const mockPayments: PaymentData[] = [
        {
          id: 'payment-1',
          orderId: 'ORD-001',
          amount: 29.99,
          currency: 'USD',
          status: 'success',
          paymentMethod: 'credit_card',
          transactionId: 'TXN-001',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          billingDetails: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            address: '123 Main St',
            city: 'New York',
            postalCode: '10001',
            country: 'US'
          }
        },
        {
          id: 'payment-2',
          orderId: 'ORD-002',
          amount: 29.99,
          currency: 'USD',
          status: 'success',
          paymentMethod: 'bank_transfer',
          transactionId: 'TXN-002',
          createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          billingDetails: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+1234567891',
            address: '456 Oak Ave',
            city: 'Los Angeles',
            postalCode: '90001',
            country: 'US'
          }
        }
      ];

      setPremiumListings(mockListings);
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load premium data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (listing: PremiumListing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: PremiumListing['status']) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      expired: { label: 'Expired', className: 'bg-red-100 text-red-800' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredListings = premiumListings.filter(listing => {
    if (filterStatus === 'all') return true;
    return listing.status === filterStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeListings = premiumListings.filter(l => l.status === 'active').length;
  const totalViews = premiumListings.reduce((sum, l) => sum + l.analytics.views, 0);
  const avgConversion = premiumListings.reduce((sum, l) => sum + l.analytics.conversionRate, 0) / premiumListings.length;

  const columns: Column<PremiumListing>[] = [
    {
      key: 'propertyId',
      title: 'Property ID',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'plan.name',
      title: 'Plan',
      render: (value, record) => (
        <div className="flex items-center">
          <Crown size={16} className="text-yellow-500 mr-2" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-neutral-500">${record.plan.price}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'analytics.views',
      title: 'Views',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'analytics.inquiries',
      title: 'Inquiries',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'analytics.conversionRate',
      title: 'Conversion',
      sortable: true,
      render: (value) => `${value.toFixed(1)}%`,
    },
    {
      key: 'startDate',
      title: 'Start Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
    {
      key: 'endDate',
      title: 'End Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const renderActions = (listing: PremiumListing) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetails(listing);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="View Details"
      >
        <Eye size={16} />
      </button>
    </div>
  );

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
        <title>Premium Management | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
              <Crown size={28} className="mr-3 text-yellow-600" />
              Premium Management
            </h1>
            <p className="text-neutral-600">Manage premium listings and track performance</p>
          </div>
          <button className="btn-primary flex items-center">
            <Download size={18} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Active Listings</p>
              <p className="text-2xl font-bold text-blue-600">{activeListings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Crown size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-1">Avg Conversion</p>
              <p className="text-2xl font-bold text-yellow-600">{avgConversion.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Premium Listings Table */}
      <DataTable
        data={filteredListings}
        columns={columns}
        actions={renderActions}
        searchable
        pagination
        pageSize={10}
        onRowClick={(listing) => handleViewDetails(listing)}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedListing && (
        <PremiumDetailModal
          listing={selectedListing}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

// Premium Detail Modal Component
interface PremiumDetailModalProps {
  listing: PremiumListing;
  onClose: () => void;
}

const PremiumDetailModal: React.FC<PremiumDetailModalProps> = ({ 
  listing, 
  onClose 
}) => {
  const daysRemaining = Math.ceil((new Date(listing.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <Crown size={24} className="mr-2 text-yellow-600" />
              Premium Listing Details
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Listing Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Listing Information</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Property ID:</span>
                  <span className="font-mono">{listing.propertyId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Plan:</span>
                  <span className="font-medium">{listing.plan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Price:</span>
                  <span className="font-medium">${listing.plan.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status:</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800' :
                    listing.status === 'expired' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Start Date:</span>
                  <span>{format(new Date(listing.startDate), 'MMM dd, yyyy')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">End Date:</span>
                  <span>{format(new Date(listing.endDate), 'MMM dd, yyyy')}</span>
                </div>
                
                {listing.status === 'active' && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Days Remaining:</span>
                    <span className="font-medium text-yellow-600">{daysRemaining} days</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Analytics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{listing.analytics.views.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Total Views</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{listing.analytics.inquiries}</div>
                  <div className="text-sm text-green-700">Inquiries</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{listing.analytics.favorites}</div>
                  <div className="text-sm text-purple-700">Favorites</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{listing.analytics.conversionRate.toFixed(1)}%</div>
                  <div className="text-sm text-yellow-700">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Plan Features */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {listing.plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumManagement;