import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PremiumAnalyticsDashboard from '../components/premium/PremiumAnalyticsDashboard';
import { Crown, Calendar, CreditCard, Download, RefreshCw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PremiumListing, PaymentData } from '../types/premium';
import { premiumService } from '../services/premiumService';
import { format } from 'date-fns';

const PremiumDashboardPage: React.FC = () => {
  const [premiumListings, setPremiumListings] = useState<PremiumListing[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [selectedListing, setSelectedListing] = useState<PremiumListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // In a real app, get current user ID from auth context
      const userId = 'current-user-id';
      const userListings = premiumService.getUserPremiumListings(userId);
      const userPayments = premiumService.getUserPayments(userId);
      
      setPremiumListings(userListings);
      setPayments(userPayments);
      
      if (userListings.length > 0) {
        setSelectedListing(userListings[0]);
      }
    } catch (error) {
      console.error('Failed to load premium data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewListing = (listingId: string) => {
    // Navigate to renewal payment page
    window.location.href = `/premium/upgrade?propertyId=${listingId}&renewal=true`;
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // Generate and download receipt
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      const receiptData = {
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        date: payment.createdAt,
        status: payment.status
      };
      
      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${payment.orderId}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading your premium dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (premiumListings.length === 0) {
    return (
      <Layout>
        <Helmet>
          <title>Premium Dashboard | Properti Pro</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Crown size={64} className="mx-auto text-neutral-300 mb-6" />
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">No Premium Listings</h1>
            <p className="text-neutral-600 mb-8">
              You don't have any premium listings yet. Upgrade your property listings to access detailed analytics and enhanced visibility.
            </p>
            <button
              onClick={() => window.location.href = '/premium/upgrade'}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Premium Dashboard | Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 mb-2 flex items-center">
                  <Crown size={32} className="mr-3 text-yellow-600" />
                  Premium Dashboard
                </h1>
                <p className="text-neutral-600">
                  Manage your premium listings and track performance
                </p>
              </div>
              <button
                onClick={loadData}
                className="btn-secondary flex items-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Listings Selector */}
          {premiumListings.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-neutral-800 mb-3">Select Premium Listing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumListings.map((listing) => (
                  <button
                    key={listing.id}
                    onClick={() => setSelectedListing(listing)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedListing?.id === listing.id
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-neutral-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className="font-medium text-neutral-800 mb-1">
                      Property #{listing.propertyId}
                    </div>
                    <div className="text-sm text-neutral-600 mb-2">
                      {listing.plan.name} - ${listing.plan.price}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' :
                      listing.status === 'expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Dashboard */}
          {selectedListing && (
            <div className="mb-8">
              <PremiumAnalyticsDashboard premiumListing={selectedListing} />
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Payment History
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-neutral-50">
                      <td className="py-3 px-4 font-mono text-sm">{payment.orderId}</td>
                      <td className="py-3 px-4">
                        {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${payment.amount} {payment.currency}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'success' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDownloadReceipt(payment.id)}
                          className="text-yellow-600 hover:text-yellow-800 flex items-center text-sm"
                        >
                          <Download size={16} className="mr-1" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {payments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-neutral-500">No payment history available</p>
              </div>
            )}
          </div>

          {/* Renewal Section */}
          {selectedListing && selectedListing.status === 'active' && (
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Renewal Available
                  </h3>
                  <p className="text-yellow-700">
                    Your premium listing expires on {format(new Date(selectedListing.endDate), 'MMMM dd, yyyy')}. 
                    Renew now to maintain your enhanced visibility.
                  </p>
                </div>
                <button
                  onClick={() => handleRenewListing(selectedListing.propertyId)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center"
                >
                  <Calendar size={20} className="mr-2" />
                  Renew Premium
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PremiumDashboardPage;