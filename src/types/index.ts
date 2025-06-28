/**
 * Core property interface representing a real estate listing
 */
export interface Property {
  /** Unique identifier for the property */
  id: string;
  /** Property listing title */
  title: string;
  /** Detailed description of the property */
  description: string;
  /** Numeric price value */
  price: number;
  /** Unit of the price (millions or billions) */
  priceUnit: 'juta' | 'miliar';
  /** Type of property */
  type: PropertyType;
  /** Whether the property is for sale or rent */
  purpose: 'jual' | 'sewa';
  /** Number of bedrooms (optional) */
  bedrooms?: number;
  /** Number of bathrooms (optional) */
  bathrooms?: number;
  /** Size of the building in square meters (optional) */
  buildingSize?: number;
  /** Size of the land in square meters (optional) */
  landSize?: number;
  /** Location details of the property */
  location: Location;
  /** Array of image URLs for the property */
  images: string[];
  /** Array of property features/amenities */
  features: string[];
  /** Information about the property agent */
  agent: Agent;
  /** ISO date string when the property was created */
  createdAt: string;
  /** Whether the property is promoted/featured */
  isPromoted: boolean;
  /** Current status of the property listing */
  status?: ListingStatus;
  /** Number of views the property has received */
  views?: number;
  /** Number of inquiries the property has received */
  inquiries?: number;
}

/**
 * Enum for property types matching database schema
 */
export type PropertyType = 
  | 'rumah' 
  | 'apartemen' 
  | 'kondominium' 
  | 'ruko' 
  | 'gedung_komersial' 
  | 'ruang_industri' 
  | 'tanah' 
  | 'lainnya';

/**
 * Enum for listing status matching database schema
 */
export type ListingStatus = 
  | 'active' 
  | 'draft' 
  | 'inactive' 
  | 'pending' 
  | 'rejected' 
  | 'rented' 
  | 'sold';

/**
 * Location information for a property
 */
export interface Location {
  /** Province name */
  province: string;
  /** City name */
  city: string;
  /** District name */
  district: string;
  /** Sub-district name (optional) */
  subDistrict?: string;
  /** Village name (optional) */
  village?: string;
  /** Full address */
  address: string;
  /** Postal code (optional) */
  postalCode?: string;
  /** Latitude coordinate (optional) */
  latitude?: number;
  /** Longitude coordinate (optional) */
  longitude?: number;
}

/**
 * Agent information for a property
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string;
  /** Full name of the agent */
  name: string;
  /** Contact phone number */
  phone: string;
  /** Contact email address */
  email: string;
  /** URL to agent's avatar image (optional) */
  avatar?: string;
  /** Agent's company name (optional) */
  company?: string;
}

/**
 * User information
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
  /** Email address */
  email: string;
  /** Contact phone number (optional) */
  phone?: string;
  /** URL to user's avatar image (optional) */
  avatar?: string;
  /** User role */
  role: 'user' | 'agent' | 'admin' | 'superadmin';
  /** Array of saved property IDs */
  savedProperties?: string[];
  /** User status */
  status?: 'active' | 'inactive' | 'suspended';
  /** Last login timestamp */
  lastLogin?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  /** Current authenticated user or null */
  user: User | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether authentication is in progress */
  loading: boolean;
  /** Error message if authentication failed */
  error: string | null;
}