import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PremiumComparisonTable from '../components/premium/PremiumComparisonTable';
import PaymentForm from '../components/premium/PaymentForm';
import { Crown, CheckCircle, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BillingDetails } from '../types/premium';
import { premiumService } from '../services/premiumService';
import { midtransService } from '../services/midtrans';

const PremiumUpgradePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  
  const [currentStep, setCurrentStep] = useState<'comparison' | 'payment' | 'processing' | 'success'>('comparison');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const premiumPlan = premiumService.getPremiumPlans()[0];

  const handleUpgradeClick = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (billingDetails: BillingDetails) => {
    if (!propertyId) {
      alert('Property ID is required');
      return;
    }

    setIsLoading(true);
    setCurrentStep('processing');

    try {
      // Create payment record
      const orderId = `premium-${propertyId}-${Date.now()}`;
      const payment = await premiumService.createPayment({
        orderId,
        amount: premiumPlan.price,
        currency: premiumPlan.currency,
        billingDetails
      });

      // Create Midtrans transaction
      const midtransResponse = await midtransService.createTransaction({
        orderId,
        amount: premiumPlan.price,
        billingDetails,
        itemDetails: [{
          id: premiumPlan.id,
          name: premiumPlan.name,
          price: premiumPlan.price,
          quantity: 1
        }]
      });

      // Open payment modal
      const paymentResult = await midtransService.openPaymentModal(midtransResponse.token);

      if (paymentResult.status === 'success') {
        // Update payment status
        await premiumService.updatePaymentStatus(payment.id, 'success', paymentResult.result.transaction_id);

        // Create premium listing
        await premiumService.createPremiumListing({
          propertyId,
          userId: 'current-user-id', // In real app, get from auth context
          planId: premiumPlan.id,
          paymentId: payment.id
        });

        setPaymentData(paymentResult.result);
        setCurrentStep('success');
      } else if (paymentResult.status === 'pending') {
        await premiumService.updatePaymentStatus(payment.id, 'pending');
        alert('Payment is being processed. You will receive a confirmation email shortly.');
        navigate('/dashboard/premium');
      } else {
        await premiumService.updatePaymentStatus(payment.id, 'failed');
        alert('Payment failed. Please try again.');
        setCurrentStep('payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
      setCurrentStep('payment');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'comparison':
        return (
          <div className="space-y-8">
            <PremiumComparisonTable />
            <div className="text-center">
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center mx-auto text-lg"
              >
                <Crown size={24} className="mr-3" />
                Upgrade to Premium - ${premiumPlan.price}
              </button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <button
                onClick={() => setCurrentStep('comparison')}
                className="inline-flex items-center text-neutral-600 hover:text-neutral-800 mb-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Comparison
              </button>
            </div>
            <PaymentForm
              onSubmit={handlePaymentSubmit}
              isLoading={isLoading}
              amount={premiumPlan.price}
              currency={premiumPlan.currency}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Processing Your Payment</h2>
            <p className="text-neutral-600">
              Please wait while we process your payment. Do not close this window.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              Welcome to Premium!
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Your property listing has been upgraded successfully. Your premium features are now active.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Your listing is now featured at the top of search results</li>
                <li>• Premium badge and golden border are active</li>
                <li>• Analytics dashboard is available</li>
                <li>• You can upload up to 20 images</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate(`/dashboard/premium`)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 mr-4"
              >
                View Analytics Dashboard
              </button>
              <button
                onClick={() => navigate(`/properti/${propertyId}`)}
                className="btn-secondary"
              >
                View Your Listing
              </button>
            </div>

            {paymentData && (
              <div className="mt-8 p-4 bg-neutral-50 rounded-lg max-w-md mx-auto">
                <h4 className="font-semibold text-neutral-800 mb-2">Payment Details</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>Transaction ID: {paymentData.transaction_id}</p>
                  <p>Amount: ${premiumPlan.price}</p>
                  <p>Status: Completed</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Upgrade to Premium | Properti Pro</title>
        <meta name="description" content="Upgrade your property listing to premium and get 3x more visibility, detailed analytics, and priority placement." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          {/* Progress Indicator */}
          {currentStep !== 'success' && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${
                  currentStep === 'comparison' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 'comparison' ? 'bg-yellow-100 border-2 border-yellow-600' : 'bg-green-100'
                  }`}>
                    {currentStep === 'comparison' ? '1' : <CheckCircle size={20} />}
                  </div>
                  <span className="ml-2 font-medium">Choose Plan</span>
                </div>
                
                <div className={`w-16 h-0.5 ${
                  ['payment', 'processing'].includes(currentStep) ? 'bg-yellow-600' : 'bg-neutral-300'
                }`}></div>
                
                <div className={`flex items-center ${
                  ['payment', 'processing'].includes(currentStep) ? 'text-yellow-600' : 'text-neutral-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['payment', 'processing'].includes(currentStep) ? 'bg-yellow-100 border-2 border-yellow-600' : 'bg-neutral-100'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumUpgradePage;