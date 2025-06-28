/**
 * Premium listing information
 */
export interface PremiumListing {
  /** Unique identifier for the premium listing */
  id: string;
  /** Associated property ID */
  propertyId: string;
  /** Associated user ID */
  userId: string;
  /** Premium plan details */
  plan: PremiumPlan;
  /** Premium listing status */
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  /** ISO date string for when the premium listing starts */
  startDate: string;
  /** ISO date string for when the premium listing ends */
  endDate: string;
  /** Associated payment ID */
  paymentId: string;
  /** Enabled premium features */
  features: PremiumFeature[];
  /** Analytics data for the premium listing */
  analytics: PremiumAnalytics;
  /** ISO date string when the premium listing was created */
  createdAt: string;
  /** ISO date string when the premium listing was last updated */
  updatedAt: string;
}

/**
 * Premium plan configuration
 */
export interface PremiumPlan {
  /** Unique identifier for the plan */
  id: string;
  /** Plan name */
  name: string;
  /** Plan price */
  price: number;
  /** Currency code */
  currency: string;
  /** Duration in days */
  duration: number;
  /** Array of feature descriptions */
  features: string[];
  /** Plan description */
  description: string;
}

/**
 * Premium feature configuration
 */
export interface PremiumFeature {
  /** Unique identifier for the feature */
  id: string;
  /** Feature name */
  name: string;
  /** Feature description */
  description: string;
  /** Icon identifier */
  icon: string;
  /** Whether the feature is enabled */
  enabled: boolean;
}

/**
 * Premium listing analytics data
 */
export interface PremiumAnalytics {
  /** Number of views */
  views: number;
  /** Number of inquiries */
  inquiries: number;
  /** Number of favorites */
  favorites: number;
  /** Conversion rate percentage */
  conversionRate: number;
  /** Daily view statistics */
  dailyViews: { 
    /** Date in YYYY-MM-DD format */
    date: string; 
    /** Number of views for that date */
    views: number 
  }[];
  /** Top traffic sources */
  topSources: { 
    /** Source name */
    source: string; 
    /** Number of views from that source */
    count: number 
  }[];
}

/**
 * Payment data
 */
export interface PaymentData {
  /** Unique identifier for the payment */
  id: string;
  /** Order identifier */
  orderId: string;
  /** Payment amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Payment status */
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  /** Payment method used */
  paymentMethod: string;
  /** Transaction identifier (optional) */
  transactionId?: string;
  /** Midtrans token (optional) */
  midtransToken?: string;
  /** ISO date string when the payment was created */
  createdAt: string;
  /** ISO date string when the payment was last updated */
  updatedAt: string;
  /** Billing details */
  billingDetails: BillingDetails;
}

/**
 * Billing details for payments
 */
export interface BillingDetails {
  /** First name */
  firstName: string;
  /** Last name */
  lastName: string;
  /** Email address */
  email: string;
  /** Phone number */
  phone: string;
  /** Street address */
  address: string;
  /** City */
  city: string;
  /** Postal code */
  postalCode: string;
  /** Country code */
  country: string;
}

/**
 * Midtrans configuration
 */
export interface MidtransConfig {
  /** Client key for Midtrans */
  clientKey: string;
  /** Server key for Midtrans */
  serverKey: string;
  /** Whether to use production environment */
  isProduction: boolean;
  /** URL to Midtrans Snap.js */
  snapUrl: string;
}

/**
 * Midtrans API response
 */
export interface MidtransResponse {
  /** Transaction token */
  token: string;
  /** Redirect URL */
  redirect_url: string;
}

/**
 * Payment notification from Midtrans
 */
export interface PaymentNotification {
  /** ISO date string for transaction time */
  transaction_time: string;
  /** Transaction status */
  transaction_status: string;
  /** Transaction identifier */
  transaction_id: string;
  /** Status message */
  status_message: string;
  /** Status code */
  status_code: string;
  /** Signature key */
  signature_key: string;
  /** Payment type */
  payment_type: string;
  /** Order identifier */
  order_id: string;
  /** Merchant identifier */
  merchant_id: string;
  /** Gross amount */
  gross_amount: string;
  /** Fraud status */
  fraud_status: string;
  /** Currency code */
  currency: string;
}