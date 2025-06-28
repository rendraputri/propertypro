import { AnalyticsData } from '../types/analytics';

// Generate mock analytics data
const generateDateRange = (days: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const generateRandomData = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mockAnalyticsData: AnalyticsData = {
  overview: {
    totalListings: 8921,
    activeListings: 7834,
    totalUsers: 12543,
    totalAgents: 1247,
    totalViews: 156789,
    totalInquiries: 8934,
    conversionRate: 5.7,
    averagePrice: 2.8, // in billions
  },
  
  listingsByType: {
    'rumah': 3456,
    'apartemen': 2134,
    'ruko': 1245,
    'tanah': 987,
    'kondominium': 654,
    'gedung-komersial': 321,
    'ruang-industri': 124,
  },
  
  listingsByLocation: [
    { province: 'DKI Jakarta', count: 2845, percentage: 31.9 },
    { province: 'Jawa Barat', count: 1987, percentage: 22.3 },
    { province: 'Jawa Timur', count: 1234, percentage: 13.8 },
    { province: 'Banten', count: 987, percentage: 11.1 },
    { province: 'Jawa Tengah', count: 765, percentage: 8.6 },
    { province: 'Bali', count: 543, percentage: 6.1 },
    { province: 'Sumatera Utara', count: 321, percentage: 3.6 },
    { province: 'Lainnya', count: 239, percentage: 2.7 },
  ],
  
  listingsByPurpose: {
    jual: 6234,
    sewa: 2687,
  },
  
  activeListingsToday: 45,
  activeListingsThisWeek: 287,
  
  userRegistrations: generateDateRange(30).map((date, index) => ({
    date,
    count: generateRandomData(15, 85),
    cumulative: 12000 + (index * 18),
  })),
  
  popularLocations: [
    { name: 'Jakarta Selatan', type: 'city', count: 1245, growth: 12.5 },
    { name: 'Bandung', type: 'city', count: 987, growth: 8.3 },
    { name: 'Surabaya', type: 'city', count: 765, growth: 15.2 },
    { name: 'Tangerang Selatan', type: 'city', count: 654, growth: 22.1 },
    { name: 'Bekasi', type: 'city', count: 543, growth: 6.7 },
    { name: 'Depok', type: 'city', count: 432, growth: 9.4 },
    { name: 'Bogor', type: 'city', count: 321, growth: 4.8 },
    { name: 'Jakarta Pusat', type: 'city', count: 298, growth: 7.2 },
  ],
  
  popularCategories: [
    { name: 'Rumah', count: 3456, percentage: 38.7, growth: 8.5 },
    { name: 'Apartemen', count: 2134, percentage: 23.9, growth: 12.3 },
    { name: 'Ruko', count: 1245, percentage: 14.0, growth: 5.7 },
    { name: 'Tanah', count: 987, percentage: 11.1, growth: 15.2 },
    { name: 'Kondominium', count: 654, percentage: 7.3, growth: 18.9 },
    { name: 'Gedung Komersial', count: 321, percentage: 3.6, growth: 3.4 },
    { name: 'Ruang Industri', count: 124, percentage: 1.4, growth: 7.8 },
  ],
  
  priceAnalysis: {
    averageByType: {
      'rumah': 2.8,
      'apartemen': 1.9,
      'ruko': 4.2,
      'tanah': 3.5,
      'kondominium': 5.1,
      'gedung-komersial': 12.5,
      'ruang-industri': 8.7,
    },
    priceRanges: [
      { range: '< 500 Juta', count: 2134, percentage: 23.9 },
      { range: '500 Juta - 1 Miliar', count: 2987, percentage: 33.5 },
      { range: '1 - 2 Miliar', count: 1876, percentage: 21.0 },
      { range: '2 - 5 Miliar', count: 1234, percentage: 13.8 },
      { range: '5 - 10 Miliar', count: 456, percentage: 5.1 },
      { range: '> 10 Miliar', count: 234, percentage: 2.6 },
    ],
  },
  
  performanceMetrics: generateDateRange(30).map((date) => ({
    date,
    views: generateRandomData(3000, 8000),
    inquiries: generateRandomData(200, 600),
    newListings: generateRandomData(20, 80),
    newUsers: generateRandomData(15, 50),
  })),
  
  agentPerformance: [
    {
      agentId: 'a1',
      agentName: 'Budi Santoso',
      totalListings: 45,
      activeListings: 38,
      totalViews: 12456,
      totalInquiries: 567,
      conversionRate: 4.6,
    },
    {
      agentId: 'a2',
      agentName: 'Sinta Dewi',
      totalListings: 38,
      activeListings: 32,
      totalViews: 9876,
      totalInquiries: 432,
      conversionRate: 4.4,
    },
    {
      agentId: 'a3',
      agentName: 'Anton Wijaya',
      totalListings: 52,
      activeListings: 41,
      totalViews: 15234,
      totalInquiries: 678,
      conversionRate: 4.5,
    },
    {
      agentId: 'a4',
      agentName: 'Diana Putri',
      totalListings: 29,
      activeListings: 25,
      totalViews: 8765,
      totalInquiries: 398,
      conversionRate: 4.5,
    },
    {
      agentId: 'a5',
      agentName: 'Hendro Wijaya',
      totalListings: 33,
      activeListings: 28,
      totalViews: 10234,
      totalInquiries: 456,
      conversionRate: 4.5,
    },
  ],
};