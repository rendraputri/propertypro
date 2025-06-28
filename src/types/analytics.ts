/**
 * Complete analytics data structure
 */
export interface AnalyticsData {
  /** Overview statistics */
  overview: {
    /** Total number of listings */
    totalListings: number;
    /** Number of active listings */
    activeListings: number;
    /** Total number of users */
    totalUsers: number;
    /** Total number of agents */
    totalAgents: number;
    /** Total number of views */
    totalViews: number;
    /** Total number of inquiries */
    totalInquiries: number;
    /** Conversion rate percentage */
    conversionRate: number;
    /** Average property price */
    averagePrice: number;
  };
  
  /** Listings count by property type */
  listingsByType: {
    /** Property type as key, count as value */
    [key: string]: number;
  };
  
  /** Listings by location */
  listingsByLocation: Array<{
    /** Province name */
    province: string;
    /** Number of listings in this province */
    count: number;
    /** Percentage of total listings */
    percentage: number;
  }>;
  
  /** Listings by purpose */
  listingsByPurpose: {
    /** Number of listings for sale */
    jual: number;
    /** Number of listings for rent */
    sewa: number;
  };
  
  /** Number of active listings today */
  activeListingsToday: number;
  /** Number of active listings this week */
  activeListingsThisWeek: number;
  
  /** User registration data over time */
  userRegistrations: Array<{
    /** Date in YYYY-MM-DD format */
    date: string;
    /** Number of registrations on this date */
    count: number;
    /** Cumulative number of registrations */
    cumulative: number;
  }>;
  
  /** Popular locations data */
  popularLocations: Array<{
    /** Location name */
    name: string;
    /** Location type */
    type: 'province' | 'city' | 'district';
    /** Number of listings in this location */
    count: number;
    /** Growth percentage */
    growth: number;
  }>;
  
  /** Popular categories data */
  popularCategories: Array<{
    /** Category name */
    name: string;
    /** Number of listings in this category */
    count: number;
    /** Percentage of total listings */
    percentage: number;
    /** Growth percentage */
    growth: number;
  }>;
  
  /** Price analysis data */
  priceAnalysis: {
    /** Average price by property type */
    averageByType: {
      /** Property type as key, average price as value */
      [key: string]: number;
    };
    /** Distribution of listings by price range */
    priceRanges: Array<{
      /** Price range label */
      range: string;
      /** Number of listings in this price range */
      count: number;
      /** Percentage of total listings */
      percentage: number;
    }>;
  };
  
  /** Performance metrics over time */
  performanceMetrics: Array<{
    /** Date in YYYY-MM-DD format */
    date: string;
    /** Number of views on this date */
    views: number;
    /** Number of inquiries on this date */
    inquiries: number;
    /** Number of new listings on this date */
    newListings: number;
    /** Number of new users on this date */
    newUsers: number;
  }>;
  
  /** Agent performance data */
  agentPerformance: Array<{
    /** Agent ID */
    agentId: string;
    /** Agent name */
    agentName: string;
    /** Total number of listings by this agent */
    totalListings: number;
    /** Number of active listings by this agent */
    activeListings: number;
    /** Total number of views for this agent's listings */
    totalViews: number;
    /** Total number of inquiries for this agent's listings */
    totalInquiries: number;
    /** Conversion rate percentage */
    conversionRate: number;
  }>;
}

/**
 * Data point for chart visualization
 */
export interface ChartDataPoint {
  /** Label for the data point */
  label: string;
  /** Numeric value */
  value: number;
  /** Optional color for the data point */
  color?: string;
}

/**
 * Time series data point for charts
 */
export interface TimeSeriesData {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Numeric value */
  value: number;
  /** Optional label for the data point */
  label?: string;
}