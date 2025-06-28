/**
 * Ad placement configuration
 */
export interface AdPlacement {
  /** Unique identifier for the placement */
  id: string;
  /** Name of the placement */
  name: string;
  /** Description of the placement (optional) */
  description?: string;
  /** Location identifier where the ad will be displayed */
  location: string;
  /** Dimensions of the ad placement */
  dimensions: {
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
  };
  /** Maximum file size in KB */
  max_file_size: number;
  /** Array of allowed file formats */
  allowed_formats: string[];
  /** Base price for the placement */
  base_price: number;
  /** Whether the placement is active */
  is_active: boolean;
  /** ISO date string when the placement was created */
  created_at: string;
  /** ISO date string when the placement was last updated */
  updated_at: string;
}

/**
 * Advertiser account information
 */
export interface AdvertiserAccount {
  /** Unique identifier for the advertiser account */
  id: string;
  /** Associated user ID */
  user_id: string;
  /** Company name */
  company_name: string;
  /** Contact email */
  contact_email: string;
  /** Contact phone (optional) */
  contact_phone?: string;
  /** Billing address information */
  billing_address?: any;
  /** Payment method information */
  payment_method?: any;
  /** Credit balance amount */
  credit_balance: number;
  /** Account status */
  status: string;
  /** ISO date string when the account was created */
  created_at: string;
  /** ISO date string when the account was last updated */
  updated_at: string;
}

/**
 * Ad campaign information
 */
export interface AdCampaign {
  /** Unique identifier for the campaign */
  id: string;
  /** Associated advertiser account ID */
  advertiser_id: string;
  /** Campaign name */
  name: string;
  /** Campaign description (optional) */
  description?: string;
  /** Total campaign budget */
  budget: number;
  /** Daily budget limit (optional) */
  daily_budget?: number;
  /** ISO date string for campaign start date */
  start_date: string;
  /** ISO date string for campaign end date */
  end_date: string;
  /** Targeting options for the campaign */
  targeting_options?: {
    /** Demographic targeting */
    demographics?: {
      /** Age range [min, max] */
      age_range?: [number, number];
      /** Target genders */
      gender?: string[];
      /** Target interests */
      interests?: string[];
    };
    /** Geographic targeting */
    geographic?: {
      /** Target countries */
      countries?: string[];
      /** Target cities */
      cities?: string[];
      /** Target radius in km */
      radius?: number;
    };
    /** Behavioral targeting */
    behavioral?: {
      /** Target property types */
      property_types?: string[];
      /** Target price ranges */
      price_ranges?: string[];
      /** Whether to use search history for targeting */
      search_history?: boolean;
    };
  };
  /** Campaign status */
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  /** Total amount spent on the campaign */
  total_spent: number;
  /** ISO date string when the campaign was created */
  created_at: string;
  /** ISO date string when the campaign was last updated */
  updated_at: string;
}

/**
 * Advertisement information
 */
export interface Advertisement {
  /** Unique identifier for the advertisement */
  id: string;
  /** Associated campaign ID */
  campaign_id: string;
  /** Associated placement ID */
  placement_id: string;
  /** Advertisement title */
  title: string;
  /** Advertisement description (optional) */
  description?: string;
  /** URL to the advertisement image (optional) */
  image_url?: string;
  /** URL to the advertisement video (optional) */
  video_url?: string;
  /** URL to redirect to when clicked */
  click_url: string;
  /** Alternative text for the advertisement (optional) */
  alt_text?: string;
  /** Type of advertisement */
  ad_type: 'banner' | 'sidebar' | 'in_content' | 'footer' | 'popup' | 'video';
  /** Additional content for the advertisement (optional) */
  content?: any;
  /** Advertisement status */
  status: 'draft' | 'pending' | 'active' | 'paused' | 'expired' | 'rejected';
  /** Priority level for the advertisement */
  priority: number;
  /** Weight for the advertisement */
  weight: number;
  /** Number of impressions */
  impressions_count: number;
  /** Number of clicks */
  clicks_count: number;
  /** ISO date string when the advertisement was created */
  created_at: string;
  /** ISO date string when the advertisement was last updated */
  updated_at: string;
  /** Associated campaign information (optional) */
  campaign?: AdCampaign;
  /** Associated placement information (optional) */
  placement?: AdPlacement;
}

/**
 * Ad impression tracking information
 */
export interface AdImpression {
  /** Unique identifier for the impression */
  id: string;
  /** Associated advertisement ID */
  ad_id: string;
  /** Associated user ID (optional) */
  user_id?: string;
  /** Session identifier (optional) */
  session_id?: string;
  /** IP address (optional) */
  ip_address?: string;
  /** User agent string (optional) */
  user_agent?: string;
  /** Page URL where impression occurred (optional) */
  page_url?: string;
  /** Referrer URL (optional) */
  referrer?: string;
  /** Device type (optional) */
  device_type?: string;
  /** Browser name (optional) */
  browser?: string;
  /** Location information (optional) */
  location?: any;
  /** ISO date string when the impression was created */
  created_at: string;
}

/**
 * Ad click tracking information
 */
export interface AdClick {
  /** Unique identifier for the click */
  id: string;
  /** Associated advertisement ID */
  ad_id: string;
  /** Associated impression ID (optional) */
  impression_id?: string;
  /** Associated user ID (optional) */
  user_id?: string;
  /** Session identifier (optional) */
  session_id?: string;
  /** IP address (optional) */
  ip_address?: string;
  /** User agent string (optional) */
  user_agent?: string;
  /** Page URL where click occurred (optional) */
  page_url?: string;
  /** Referrer URL (optional) */
  referrer?: string;
  /** Device type (optional) */
  device_type?: string;
  /** Browser name (optional) */
  browser?: string;
  /** Location information (optional) */
  location?: any;
  /** ISO date string when the click was created */
  created_at: string;
}

/**
 * Ad payment information
 */
export interface AdPayment {
  /** Unique identifier for the payment */
  id: string;
  /** Associated advertiser account ID */
  advertiser_id: string;
  /** Associated campaign ID (optional) */
  campaign_id?: string;
  /** Payment amount */
  amount: number;
  /** Currency code */
  currency: string;
  /** Payment method (optional) */
  payment_method?: string;
  /** Transaction identifier (optional) */
  transaction_id?: string;
  /** Payment status */
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  /** ISO date string when the payment was made (optional) */
  payment_date?: string;
  /** ISO date string when the payment record was created */
  created_at: string;
  /** ISO date string when the payment record was last updated */
  updated_at: string;
}

/**
 * Ad analytics information
 */
export interface AdAnalytics {
  /** Number of impressions */
  impressions: number;
  /** Number of clicks */
  clicks: number;
  /** Click-through rate percentage */
  ctr: number;
  /** Total cost */
  cost: number;
  /** Cost per thousand impressions */
  cpm: number;
  /** Cost per click */
  cpc: number;
  /** Number of conversions (optional) */
  conversions?: number;
  /** Total revenue (optional) */
  revenue?: number;
  /** Return on investment percentage (optional) */
  roi?: number;
}

/**
 * Ad targeting configuration
 */
export interface AdTargeting {
  /** Demographic targeting options */
  demographics?: {
    /** Age range [min, max] */
    age_range?: [number, number];
    /** Target genders */
    gender?: ('male' | 'female' | 'other')[];
    /** Target interests */
    interests?: string[];
    /** Income range [min, max] */
    income_range?: [number, number];
  };
  /** Geographic targeting options */
  geographic?: {
    /** Target countries */
    countries?: string[];
    /** Target regions */
    regions?: string[];
    /** Target cities */
    cities?: string[];
    /** Target postal codes */
    postal_codes?: string[];
    /** Target radius in km */
    radius?: number;
    /** Target coordinates */
    coordinates?: {
      /** Latitude */
      lat: number;
      /** Longitude */
      lng: number;
    };
  };
  /** Behavioral targeting options */
  behavioral?: {
    /** Target property types */
    property_types?: string[];
    /** Target price ranges */
    price_ranges?: string[];
    /** Whether to use search history for targeting */
    search_history?: boolean;
    /** Whether to use previous interactions for targeting */
    previous_interactions?: boolean;
    /** Target device types */
    device_types?: string[];
    /** Target browsers */
    browsers?: string[];
  };
  /** Temporal targeting options */
  temporal?: {
    /** Target days of week (0-6, where 0 is Sunday) */
    days_of_week?: number[];
    /** Target hours of day (0-23) */
    hours_of_day?: number[];
    /** Target time zones */
    time_zones?: string[];
  };
}