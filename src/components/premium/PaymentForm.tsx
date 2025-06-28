import React, { useState } from 'react';
import { CreditCard, Lock, User, Mail, Phone, MapPin } from 'lucide-react';
import { BillingDetails } from '../../types/premium';

interface PaymentFormProps {
  onSubmit: (billingDetails: BillingDetails) => void;
  isLoading?: boolean;
  amount: number;
  currency: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  amount, 
  currency 
}) => {
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'ID'
  });

  const [errors, setErrors] = useState<Partial<BillingDetails>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BillingDetails> = {};

    if (!billingDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!billingDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!billingDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!billingDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!billingDetails.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!billingDetails.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!billingDetails.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(billingDetails);
    }
  };

  const handleInputChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
              <p className="text-yellow-100">Secure payment powered by Midtrans</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${amount}</div>
              <div className="text-yellow-100">Premium Listing</div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 p-4 m-6 rounded-lg">
          <div className="flex items-center">
            <Lock size={20} className="text-green-600 mr-3" />
            <div>
              <h3 className="font-semibold text-green-800">Secure Payment</h3>
              <p className="text-green-700 text-sm">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Personal Information
              </h3>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.firstName ? 'border-red-500' : 'border-neutral-300'
                }`}
                value={billingDetails.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                required
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.lastName ? 'border-red-500' : 'border-neutral-300'
                }`}
                value={billingDetails.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                required
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                aria-invalid={errors.lastName ? "true" : "false"}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  id="email"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.email ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  value={billingDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                <input
                  type="tel"
                  id="phone"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.phone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  value={billingDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+62 812 3456 7890"
                  required
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Billing Address */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                <MapPin size={20} className="mr-2" />
                Billing Address
              </h3>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.address ? 'border-red-500' : 'border-neutral-300'
                }`}
                value={billingDetails.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your street address"
                required
                aria-describedby={errors.address ? "address-error" : undefined}
                aria-invalid={errors.address ? "true" : "false"}
              />
              {errors.address && (
                <p id="address-error" className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.city ? 'border-red-500' : 'border-neutral-300'
                }`}
                value={billingDetails.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                required
                aria-describedby={errors.city ? "city-error" : undefined}
                aria-invalid={errors.city ? "true" : "false"}
              />
              {errors.city && (
                <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-neutral-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                }`}
                value={billingDetails.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="12345"
                required
                aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
                aria-invalid={errors.postalCode ? "true" : "false"}
              />
              {errors.postalCode && (
                <p id="postalCode-error" className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                Country
              </label>
              <select
                id="country"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={billingDetails.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="ID">Indonesia</option>
                <option value="MY">Malaysia</option>
                <option value="SG">Singapore</option>
                <option value="TH">Thailand</option>
              </select>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Premium Listing (30 days)</span>
                <span className="font-semibold">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Processing Fee</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-yellow-600">${amount}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isLoading ? "Processing payment" : `Pay $${amount} now`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              ) : (
                <CreditCard size={20} className="mr-3" />
              )}
              {isLoading ? 'Processing...' : `Pay $${amount} Now`}
            </button>
          </div>

          {/* Security Footer */}
          <div className="mt-6 text-center text-sm text-neutral-500">
            <p>
              By proceeding, you agree to our{' '}
              <a href="#" className="text-yellow-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-yellow-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;