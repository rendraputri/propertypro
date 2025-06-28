/**
 * Listing information from database
 */
export interface Listing {
  /** Unique identifier for the listing */
  id: string;
  /** User ID who created the listing */
  user_id: string;
  /** Listing title */
  title: string;
  /** Detailed description */
  description: string;
  /** Numeric price value */
  price: number;
  /** Price unit */
  price_unit: 'juta' | 'miliar';
  /** Property type */
  property_type: 'rumah' | 'apartemen' | 'kondominium' | 'ruko' | 'gedung_komersial' | 'ruang_industri' | 'tanah' | 'lainnya';
  /** Listing purpose */
  purpose: 'jual' | 'sewa';
  /** Number of bedrooms (optional) */
  bedrooms: number | null;
  /** Number of bathrooms (optional) */
  bathrooms: number | null;
  /** Building size in square meters (optional) */
  building_size: number | null;
  /** Land size in square meters (optional) */
  land_size: number | null;
  /** Province ID (optional) */
  province_id: string | null;
  /** City ID (optional) */
  city_id: string | null;
  /** District ID (optional) */
  district_id: string | null;
  /** Full address (optional) */
  address: string | null;
  /** Postal code (optional) */
  postal_code: string | null;
  /** Array of property features (optional) */
  features: string[] | null;
  /** Listing status */
  status: 'active' | 'draft' | 'inactive' | 'pending' | 'rejected' | 'rented' | 'sold';
  /** Number of views */
  views: number;
  /** Number of inquiries */
  inquiries: number;
  /** Whether the listing is promoted */
  is_promoted: boolean;
  /** ISO date string when the listing was created */
  created_at: string;
  /** ISO date string when the listing was last updated */
  updated_at: string;
}

/**
 * Property media information
 */
export interface PropertyMedia {
  /** Unique identifier for the media */
  id: string;
  /** Associated listing ID */
  listing_id: string;
  /** Media URL */
  media_url: string;
  /** Media type */
  media_type: string;
  /** Whether this is the primary media */
  is_primary: boolean;
  /** ISO date string when the media was created */
  created_at: string;
  /** ISO date string when the media was last updated */
  updated_at: string;
}

/**
 * Listing form data for create/edit
 */
export interface ListingFormData {
  /** Listing title */
  title: string;
  /** Detailed description */
  description: string;
  /** Property type */
  propertyType: 'rumah' | 'apartemen' | 'ruko' | 'tanah' | 'gedung_komersial' | 'ruang_industri' | 'kondominium' | 'lainnya';
  /** Listing purpose */
  purpose: 'jual' | 'sewa';
  /** Numeric price value */
  price: number;
  /** Price unit */
  priceUnit: 'juta' | 'miliar';
  /** Number of bedrooms */
  bedrooms: number;
  /** Number of bathrooms */
  bathrooms: number;
  /** Building size in square meters */
  buildingSize: number;
  /** Land size in square meters */
  landSize: number;
  /** Province ID */
  province: string;
  /** City ID */
  city: string;
  /** District ID */
  district: string;
  /** Full address */
  address: string;
  /** Array of property features */
  features: string[];
  /** Array of image URLs */
  images: string[];
  /** Whether to make the listing premium */
  makePremium: boolean;
}

/**
 * User listing with additional frontend data
 */
export interface UserListing {
  /** Unique identifier for the listing */
  id: string;
  /** Listing title */
  title: string;
  /** Property type */
  type: string;
  /** Listing purpose */
  purpose: 'jual' | 'sewa';
  /** Numeric price value */
  price: number;
  /** Price unit */
  priceUnit: 'juta' | 'miliar';
  /** Listing status */
  status: 'active' | 'inactive' | 'expired' | 'pending';
  /** Whether the listing is premium */
  isPremium: boolean;
  /** ISO date string when premium expires (optional) */
  premiumExpiresAt?: string;
  /** Number of views */
  views: number;
  /** ISO date string when the listing was created */
  createdAt: string;
  /** Primary image URL */
  image: string;
  /** Location information */
  location: {
    /** City name */
    city: string;
    /** Province name */
    province: string;
  };
}

/**
 * Listing filter options
 */
export interface ListingFilters {
  /** Status filter */
  status: string;
  /** Property type filter */
  type: string;
  /** Purpose filter */
  purpose: string;
  /** Price range filter */
  priceRange: [number, number] | null;
  /** Bedrooms filter */
  bedrooms: number | null;
  /** Bathrooms filter */
  bathrooms: number | null;
  /** Location filter */
  location: {
    /** Province ID */
    province?: string;
    /** City ID */
    city?: string;
    /** District ID */
    district?: string;
  };
  /** Sort option */
  sortBy: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'views' | 'premium';
}