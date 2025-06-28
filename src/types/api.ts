/**
 * API response structure
 */
export interface ApiResponse<T> {
  /** Success status */
  success: boolean;
  /** Response data */
  data: T;
  /** Error message (if any) */
  error?: string;
  /** Error code (if any) */
  code?: string;
  /** Pagination information (if applicable) */
  pagination?: PaginationInfo;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code: string;
  /** HTTP status code */
  status: number;
  /** Additional error details (optional) */
  details?: any;
}

/**
 * API request parameters
 */
export interface ApiRequestParams {
  /** Pagination parameters (optional) */
  pagination?: {
    /** Page number */
    page?: number;
    /** Number of items per page */
    pageSize?: number;
  };
  /** Sorting parameters (optional) */
  sort?: {
    /** Field to sort by */
    field: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
  };
  /** Filter parameters (optional) */
  filters?: {
    /** Field to filter by */
    [key: string]: any;
  };
  /** Search parameters (optional) */
  search?: {
    /** Search query */
    query: string;
    /** Fields to search in */
    fields?: string[];
  };
}

/**
 * API authentication headers
 */
export interface ApiAuthHeaders {
  /** Authorization header */
  Authorization: string;
  /** Content type header */
  'Content-Type': string;
}

/**
 * API endpoint configuration
 */
export interface ApiEndpoint {
  /** Endpoint URL */
  url: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Whether authentication is required */
  requiresAuth: boolean;
  /** Rate limit in requests per minute (optional) */
  rateLimit?: number;
  /** Cache time in seconds (optional) */
  cacheTime?: number;
}