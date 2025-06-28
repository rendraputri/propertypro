/**
 * User profile information
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string;
  /** Full name */
  full_name: string;
  /** Email address */
  email: string;
  /** Phone number (optional) */
  phone: string | null;
  /** User role */
  role: 'user' | 'agent' | 'admin' | 'superadmin';
  /** User status */
  status: 'active' | 'inactive' | 'suspended';
  /** Avatar URL (optional) */
  avatar_url: string | null;
  /** Company name (optional) */
  company: string | null;
  /** ISO date string when the profile was created */
  created_at: string;
  /** ISO date string when the profile was last updated */
  updated_at: string;
}

/**
 * User registration form data
 */
export interface UserRegistrationData {
  /** Full name */
  fullName: string;
  /** Email address */
  email: string;
  /** Phone number (optional) */
  phone?: string;
  /** Password */
  password: string;
  /** Password confirmation */
  confirmPassword: string;
  /** User role */
  role: 'user' | 'agent';
  /** Whether terms are agreed to */
  agreeTerms: boolean;
}

/**
 * User login form data
 */
export interface UserLoginData {
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** Whether to remember the user */
  rememberMe: boolean;
}

/**
 * Password reset form data
 */
export interface PasswordResetData {
  /** Current password */
  currentPassword: string;
  /** New password */
  newPassword: string;
  /** New password confirmation */
  confirmPassword: string;
}

/**
 * User dashboard statistics
 */
export interface UserDashboardStats {
  /** Total number of properties */
  totalProperties: number;
  /** Number of active properties */
  activeProperties: number;
  /** Number of premium properties */
  premiumProperties: number;
  /** Number of expired properties */
  expiredProperties: number;
  /** Total number of views */
  totalViews: number;
  /** Recent activity */
  recentActivity: Array<{
    /** Activity ID */
    id: string;
    /** Activity type */
    type: 'listing_created' | 'listing_expired' | 'premium_upgraded';
    /** Activity message */
    message: string;
    /** ISO date string when the activity occurred */
    date: string;
  }>;
}

/**
 * User notification
 */
export interface UserNotification {
  /** Notification ID */
  id: string;
  /** Notification type */
  type: 'system' | 'property' | 'message' | 'payment';
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Whether the notification is read */
  isRead: boolean;
  /** ISO date string when the notification was created */
  createdAt: string;
  /** Related entity ID (optional) */
  entityId?: string;
  /** Related entity type (optional) */
  entityType?: string;
  /** Action URL (optional) */
  actionUrl?: string;
}

/**
 * User favorite property
 */
export interface UserFavorite {
  /** Favorite ID */
  id: string;
  /** User ID */
  userId: string;
  /** Property ID */
  propertyId: string;
  /** ISO date string when the favorite was created */
  createdAt: string;
  /** Property information */
  property?: {
    /** Property title */
    title: string;
    /** Property price */
    price: number;
    /** Property price unit */
    priceUnit: 'juta' | 'miliar';
    /** Property image URL */
    imageUrl: string;
    /** Property location */
    location: string;
  };
}

/**
 * User inquiry
 */
export interface UserInquiry {
  /** Inquiry ID */
  id: string;
  /** User ID who made the inquiry */
  userId: string;
  /** Property ID */
  propertyId: string;
  /** Agent ID who received the inquiry */
  agentId: string;
  /** Inquiry message */
  message: string;
  /** Inquiry status */
  status: 'pending' | 'responded' | 'closed';
  /** ISO date string when the inquiry was created */
  createdAt: string;
  /** ISO date string when the inquiry was last updated */
  updatedAt: string;
  /** Property information */
  property?: {
    /** Property title */
    title: string;
    /** Property image URL */
    imageUrl: string;
  };
  /** Agent information */
  agent?: {
    /** Agent name */
    name: string;
    /** Agent avatar URL */
    avatarUrl: string | null;
  };
  /** Array of responses */
  responses?: Array<{
    /** Response ID */
    id: string;
    /** User ID who sent the response */
    userId: string;
    /** Response message */
    message: string;
    /** ISO date string when the response was created */
    createdAt: string;
  }>;
}