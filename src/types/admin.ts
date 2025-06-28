/**
 * Category information
 */
export interface Category {
  /** Unique identifier for the category */
  id: string;
  /** Category name */
  name: string;
  /** URL-friendly slug */
  slug: string;
  /** Category description (optional) */
  description?: string;
  /** Icon identifier (optional) */
  icon?: string;
  /** Whether the category is active */
  isActive: boolean;
  /** Number of properties in this category */
  propertyCount: number;
  /** ISO date string when the category was created */
  createdAt: string;
  /** ISO date string when the category was last updated */
  updatedAt: string;
}

/**
 * Location information
 */
export interface Location {
  /** Unique identifier for the location */
  id: string;
  /** Location name */
  name: string;
  /** Location type */
  type: 'province' | 'city' | 'district' | 'subdistrict';
  /** Parent location ID (optional) */
  parentId?: string;
  /** URL-friendly slug */
  slug: string;
  /** Location description (optional) */
  description?: string;
  /** Whether the location is active */
  isActive: boolean;
  /** Number of properties in this location */
  propertyCount: number;
  /** Geographic coordinates (optional) */
  coordinates?: {
    /** Latitude */
    latitude: number;
    /** Longitude */
    longitude: number;
  };
  /** ISO date string when the location was created */
  createdAt: string;
  /** ISO date string when the location was last updated */
  updatedAt: string;
}

/**
 * Location with hierarchical information
 */
export interface LocationHierarchy extends Location {
  /** Child locations */
  children?: LocationHierarchy[];
  /** Parent location */
  parent?: Location;
}

/**
 * Property report information
 */
export interface Report {
  /** Unique identifier for the report */
  id: string;
  /** Associated property ID */
  propertyId: string;
  /** Reporter user ID */
  reporterId: string;
  /** Reporter name */
  reporterName: string;
  /** Reporter email */
  reporterEmail: string;
  /** Report type */
  type: 'spam' | 'inappropriate_content' | 'fake_listing' | 'wrong_category' | 'duplicate' | 'other';
  /** Report reason */
  reason: string;
  /** Detailed description (optional) */
  description?: string;
  /** Report status */
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  /** Report priority */
  priority: 'low' | 'medium' | 'high' | 'urgent';
  /** ISO date string when the report was created */
  createdAt: string;
  /** ISO date string when the report was last updated */
  updatedAt: string;
  /** ISO date string when the report was resolved (optional) */
  resolvedAt?: string;
  /** User ID who resolved the report (optional) */
  resolvedBy?: string;
  /** Resolution details (optional) */
  resolution?: string;
  /** Associated property information */
  property: {
    /** Property ID */
    id: string;
    /** Property title */
    title: string;
    /** Property type */
    type: string;
    /** Property purpose */
    purpose: 'jual' | 'sewa';
    /** Property price */
    price: number;
    /** Property price unit */
    priceUnit: 'juta' | 'miliar';
    /** Property location */
    location: {
      /** City name */
      city: string;
      /** Province name */
      province: string;
    };
    /** Array of property image URLs */
    images: string[];
    /** Agent information */
    agent: {
      /** Agent ID */
      id: string;
      /** Agent name */
      name: string;
      /** Agent email */
      email: string;
    };
    /** Property status */
    status: 'active' | 'inactive' | 'suspended' | 'removed';
  };
}

/**
 * Moderation action information
 */
export interface ModerationAction {
  /** Unique identifier for the moderation action */
  id: string;
  /** Associated report ID (optional) */
  reportId?: string;
  /** Associated property ID */
  propertyId: string;
  /** Admin user ID who performed the action */
  adminId: string;
  /** Admin user name who performed the action */
  adminName: string;
  /** Action type */
  action: 'approve' | 'remove' | 'suspend' | 'warn_user' | 'edit_content' | 'change_category' | 'dismiss_report';
  /** Action reason */
  reason: string;
  /** Action details (optional) */
  details?: string;
  /** Previous property status (optional) */
  previousStatus?: string;
  /** New property status (optional) */
  newStatus?: string;
  /** ISO date string when the action was created */
  createdAt: string;
  /** Associated property information */
  property: {
    /** Property ID */
    id: string;
    /** Property title */
    title: string;
    /** Agent information */
    agent: {
      /** Agent ID */
      id: string;
      /** Agent name */
      name: string;
      /** Agent email */
      email: string;
    };
  };
}

/**
 * Moderation statistics
 */
export interface ModerationStats {
  /** Total number of reports */
  totalReports: number;
  /** Number of pending reports */
  pendingReports: number;
  /** Number of resolved reports */
  resolvedReports: number;
  /** Number of dismissed reports */
  dismissedReports: number;
  /** Number of actions taken today */
  actionsToday: number;
  /** Average resolution time in hours */
  averageResolutionTime: number;
  /** Reports count by type */
  reportsByType: {
    /** Report type as key, count as value */
    [key: string]: number;
  };
  /** Reports count by priority */
  reportsByPriority: {
    /** Priority level as key, count as value */
    [key: string]: number;
  };
}

/**
 * System settings
 */
export interface SystemSettings {
  /** General settings */
  general: {
    /** Site name */
    siteName: string;
    /** Site description */
    siteDescription: string;
    /** Site URL */
    siteUrl: string;
    /** Admin email */
    adminEmail: string;
    /** Support email */
    supportEmail: string;
    /** Timezone */
    timezone: string;
    /** Language code */
    language: string;
    /** Currency code */
    currency: string;
    /** Date format */
    dateFormat: string;
    /** Time format */
    timeFormat: string;
  };
  /** Feature toggles */
  features: {
    /** Whether user registration is enabled */
    userRegistration: boolean;
    /** Whether email verification is required */
    emailVerification: boolean;
    /** Whether property approval is required */
    propertyApproval: boolean;
    /** Whether to auto-publish properties */
    autoPublish: boolean;
    /** Whether guest inquiries are allowed */
    guestInquiries: boolean;
    /** Whether social login is enabled */
    socialLogin: boolean;
    /** Whether multi-language support is enabled */
    multiLanguage: boolean;
    /** Whether dark mode is enabled */
    darkMode: boolean;
    /** Whether maintenance mode is enabled */
    maintenance: boolean;
  };
  /** System limits */
  limits: {
    /** Maximum properties per user */
    maxPropertiesPerUser: number;
    /** Maximum images per property */
    maxImagesPerProperty: number;
    /** Maximum file size in MB */
    maxFileSize: number;
    /** Session timeout in minutes */
    sessionTimeout: number;
    /** Maximum login attempts */
    maxLoginAttempts: number;
    /** Minimum password length */
    passwordMinLength: number;
    /** Maximum property title length */
    propertyTitleMaxLength: number;
    /** Maximum property description length */
    propertyDescriptionMaxLength: number;
  };
  /** Email settings */
  email: {
    /** Email provider */
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses';
    /** SMTP host (optional) */
    smtpHost?: string;
    /** SMTP port (optional) */
    smtpPort?: number;
    /** SMTP username (optional) */
    smtpUsername?: string;
    /** SMTP password (optional) */
    smtpPassword?: string;
    /** From email address */
    fromEmail: string;
    /** From name */
    fromName: string;
    /** Reply-to email address */
    replyToEmail: string;
    /** Whether email notifications are enabled */
    enableNotifications: boolean;
    /** Whether welcome email is enabled */
    enableWelcomeEmail: boolean;
    /** Whether property alerts are enabled */
    enablePropertyAlerts: boolean;
  };
  /** Security settings */
  security: {
    /** Whether two-factor authentication is enabled */
    enableTwoFactor: boolean;
    /** Whether CAPTCHA is enabled */
    enableCaptcha: boolean;
    /** CAPTCHA provider */
    captchaProvider: 'recaptcha' | 'hcaptcha';
    /** CAPTCHA site key (optional) */
    captchaSiteKey?: string;
    /** CAPTCHA secret key (optional) */
    captchaSecretKey?: string;
    /** Whether rate limiting is enabled */
    enableRateLimit: boolean;
    /** Rate limit requests count */
    rateLimitRequests: number;
    /** Rate limit window in minutes */
    rateLimitWindow: number;
    /** Whether IP blocking is enabled */
    enableIpBlocking: boolean;
    /** Array of blocked IP addresses */
    blockedIps: string[];
    /** Whether SSL is enabled */
    enableSsl: boolean;
    /** Whether HSTS is enabled */
    enableHsts: boolean;
  };
  /** Storage settings */
  storage: {
    /** Storage provider */
    provider: 'local' | 's3' | 'cloudinary' | 'gcs';
    /** S3 bucket name (optional) */
    s3Bucket?: string;
    /** S3 region (optional) */
    s3Region?: string;
    /** S3 access key (optional) */
    s3AccessKey?: string;
    /** S3 secret key (optional) */
    s3SecretKey?: string;
    /** Cloudinary cloud name (optional) */
    cloudinaryCloudName?: string;
    /** Cloudinary API key (optional) */
    cloudinaryApiKey?: string;
    /** Cloudinary API secret (optional) */
    cloudinaryApiSecret?: string;
    /** Maximum storage size in GB */
    maxStorageSize: number;
    /** Whether image optimization is enabled */
    enableImageOptimization: boolean;
    /** Whether image watermarking is enabled */
    enableImageWatermark: boolean;
    /** Watermark text (optional) */
    watermarkText?: string;
  };
  /** SEO settings */
  seo: {
    /** Whether sitemap is enabled */
    enableSitemap: boolean;
    /** Whether robots.txt is enabled */
    enableRobotsTxt: boolean;
    /** Meta title */
    metaTitle: string;
    /** Meta description */
    metaDescription: string;
    /** Meta keywords */
    metaKeywords: string;
    /** Open Graph image URL */
    ogImage: string;
    /** Whether structured data is enabled */
    enableStructuredData: boolean;
    /** Google Analytics ID (optional) */
    googleAnalyticsId?: string;
    /** Google Tag Manager ID (optional) */
    googleTagManagerId?: string;
    /** Facebook Pixel ID (optional) */
    facebookPixelId?: string;
  };
  /** Social media settings */
  social: {
    /** Facebook URL (optional) */
    facebookUrl?: string;
    /** Twitter URL (optional) */
    twitterUrl?: string;
    /** Instagram URL (optional) */
    instagramUrl?: string;
    /** LinkedIn URL (optional) */
    linkedinUrl?: string;
    /** YouTube URL (optional) */
    youtubeUrl?: string;
    /** Whether social sharing is enabled */
    enableSocialSharing: boolean;
    /** Whether social login is enabled */
    enableSocialLogin: boolean;
    /** Facebook App ID (optional) */
    facebookAppId?: string;
    /** Google Client ID (optional) */
    googleClientId?: string;
    /** Twitter API Key (optional) */
    twitterApiKey?: string;
  };
  /** Notification settings */
  notifications: {
    /** Whether email notifications are enabled */
    enableEmailNotifications: boolean;
    /** Whether SMS notifications are enabled */
    enableSmsNotifications: boolean;
    /** Whether push notifications are enabled */
    enablePushNotifications: boolean;
    /** SMS provider */
    smsProvider: 'twilio' | 'nexmo' | 'aws-sns';
    /** Twilio Account SID (optional) */
    twilioAccountSid?: string;
    /** Twilio Auth Token (optional) */
    twilioAuthToken?: string;
    /** Twilio Phone Number (optional) */
    twilioPhoneNumber?: string;
    /** Push notification provider */
    pushProvider: 'firebase' | 'onesignal';
    /** Firebase Server Key (optional) */
    firebaseServerKey?: string;
    /** OneSignal App ID (optional) */
    oneSignalAppId?: string;
    /** OneSignal API Key (optional) */
    oneSignalApiKey?: string;
  };
  /** Backup settings */
  backup: {
    /** Whether auto backup is enabled */
    enableAutoBackup: boolean;
    /** Backup frequency */
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    /** Backup retention in days */
    backupRetention: number;
    /** Backup location */
    backupLocation: 'local' | 's3' | 'gcs';
    /** Whether database backup is enabled */
    enableDatabaseBackup: boolean;
    /** Whether file backup is enabled */
    enableFileBackup: boolean;
    /** ISO date string of last backup (optional) */
    lastBackupDate?: string;
    /** ISO date string of next scheduled backup (optional) */
    nextBackupDate?: string;
  };
}

/**
 * Admin user information
 */
export interface AdminUser {
  /** Unique identifier for the admin user */
  id: string;
  /** Admin name */
  name: string;
  /** Admin email */
  email: string;
  /** Admin role */
  role: 'admin' | 'superadmin';
  /** Array of permission strings */
  permissions: string[];
  /** Whether the admin user is active */
  isActive: boolean;
  /** ISO date string of last login (optional) */
  lastLogin?: string;
  /** ISO date string when the admin user was created */
  createdAt: string;
  /** ISO date string when the admin user was last updated */
  updatedAt: string;
}

/**
 * Activity log entry
 */
export interface ActivityLog {
  /** Unique identifier for the activity log */
  id: string;
  /** User ID who performed the action */
  userId: string;
  /** User name who performed the action */
  userName: string;
  /** Action performed */
  action: string;
  /** Resource affected */
  resource: string;
  /** Resource ID affected (optional) */
  resourceId?: string;
  /** Action details (optional) */
  details?: string;
  /** IP address */
  ipAddress: string;
  /** User agent string */
  userAgent: string;
  /** ISO date string when the activity occurred */
  createdAt: string;
}