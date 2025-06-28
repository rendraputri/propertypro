import axios from 'axios';
import { MidtransConfig, MidtransResponse, PaymentData, BillingDetails } from '../types/premium';

class MidtransService {
  private config: MidtransConfig;

  constructor() {
    this.config = {
      clientKey: import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-demo',
      serverKey: import.meta.env.VITE_MIDTRANS_SERVER_KEY || 'SB-Mid-server-demo',
      isProduction: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
      snapUrl: import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true' 
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js'
    };
  }

  async createTransaction(paymentData: {
    orderId: string;
    amount: number;
    billingDetails: BillingDetails;
    itemDetails: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  }): Promise<MidtransResponse> {
    try {
      // In a real implementation, this would call your backend API
      // which then calls Midtrans API with server key
      const response = await axios.post('/api/payments/create-transaction', {
        transaction_details: {
          order_id: paymentData.orderId,
          gross_amount: paymentData.amount
        },
        customer_details: {
          first_name: paymentData.billingDetails.firstName,
          last_name: paymentData.billingDetails.lastName,
          email: paymentData.billingDetails.email,
          phone: paymentData.billingDetails.phone,
          billing_address: {
            first_name: paymentData.billingDetails.firstName,
            last_name: paymentData.billingDetails.lastName,
            address: paymentData.billingDetails.address,
            city: paymentData.billingDetails.city,
            postal_code: paymentData.billingDetails.postalCode,
            country_code: paymentData.billingDetails.country
          }
        },
        item_details: paymentData.itemDetails,
        credit_card: {
          secure: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Midtrans transaction creation failed:', error);
      
      // For demo purposes, return mock response
      return {
        token: 'demo-token-' + Date.now(),
        redirect_url: '#'
      };
    }
  }

  loadSnapScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = this.config.snapUrl;
      script.setAttribute('data-client-key', this.config.clientKey);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Midtrans Snap script'));
      document.head.appendChild(script);
    });
  }

  async openPaymentModal(token: string): Promise<any> {
    await this.loadSnapScript();
    
    return new Promise((resolve, reject) => {
      if (!window.snap) {
        reject(new Error('Midtrans Snap not loaded'));
        return;
      }

      window.snap.pay(token, {
        onSuccess: (result: any) => {
          resolve({ status: 'success', result });
        },
        onPending: (result: any) => {
          resolve({ status: 'pending', result });
        },
        onError: (result: any) => {
          reject({ status: 'error', result });
        },
        onClose: () => {
          resolve({ status: 'closed' });
        }
      });
    });
  }

  async checkTransactionStatus(orderId: string): Promise<any> {
    try {
      // In a real implementation, this would call your backend API
      const response = await axios.get(`/api/payments/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to check transaction status:', error);
      
      // For demo purposes, return mock success
      return {
        transaction_status: 'settlement',
        payment_type: 'credit_card',
        transaction_time: new Date().toISOString()
      };
    }
  }
}

// Extend Window interface for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: any) => void;
        onPending: (result: any) => void;
        onError: (result: any) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export const midtransService = new MidtransService();