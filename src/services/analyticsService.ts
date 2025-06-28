import { supabase } from '../lib/supabase';
import { AnalyticsData } from '../types/analytics';
import { format, subDays } from 'date-fns';

class AnalyticsService {
  /**
   * Get complete analytics data
   */
  async getAnalyticsData(dateRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<AnalyticsData> {
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case '7d':
          startDate = subDays(endDate, 7);
          break;
        case '30d':
          startDate = subDays(endDate, 30);
          break;
        case '90d':
          startDate = subDays(endDate, 90);
          break;
        case '1y':
          startDate = subDays(endDate, 365);
          break;
        default:
          startDate = subDays(endDate, 30);
      }
      
      // Get overview statistics
      const overview = await this.getOverviewStats();
      
      // Get listings by type
      const listingsByType = await this.getListingsByType();
      
      // Get listings by location
      const listingsByLocation = await this.getListingsByLocation();
      
      // Get listings by purpose
      const listingsByPurpose = await this.getListingsByPurpose();
      
      // Get active listings today and this week
      const activeListingsToday = await this.getActiveListingsCount(1);
      const activeListingsThisWeek = await this.getActiveListingsCount(7);
      
      // Get user registrations over time
      const userRegistrations = await this.getUserRegistrationsOverTime(startDate, endDate);
      
      // Get popular locations
      const popularLocations = await this.getPopularLocations();
      
      // Get popular categories
      const popularCategories = await this.getPopularCategories();
      
      // Get price analysis
      const priceAnalysis = await this.getPriceAnalysis();
      
      // Get performance metrics
      const performanceMetrics = await this.getPerformanceMetrics(startDate, endDate);
      
      // Get agent performance
      const agentPerformance = await this.getAgentPerformance();
      
      return {
        overview,
        listingsByType,
        listingsByLocation,
        listingsByPurpose,
        activeListingsToday,
        activeListingsThisWeek,
        userRegistrations,
        popularLocations,
        popularCategories,
        priceAnalysis,
        performanceMetrics,
        agentPerformance,
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      
      // Return mock data as fallback
      return this.getMockAnalyticsData();
    }
  }

  /**
   * Get overview statistics
   */
  private async getOverviewStats(): Promise<AnalyticsData['overview']> {
    try {
      // Get total listings count
      const { count: totalListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true });
      
      // Get active listings count
      const { count: activeListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get total agents count
      const { count: totalAgents } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'agent');
      
      // Get total views
      const { data: viewsData } = await supabase
        .from('listings')
        .select('views');
      
      const totalViews = viewsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
      
      // Get total inquiries
      const { data: inquiriesData } = await supabase
        .from('listings')
        .select('inquiries');
      
      const totalInquiries = inquiriesData?.reduce((sum, item) => sum + (item.inquiries || 0), 0) || 0;
      
      // Calculate conversion rate
      const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;
      
      // Get average price
      const { data: priceData } = await supabase
        .from('listings')
        .select('price, price_unit');
      
      let totalPrice = 0;
      let count = 0;
      
      if (priceData) {
        priceData.forEach(item => {
          // Convert to billions for consistent calculation
          const priceInBillions = item.price_unit === 'miliar' ? item.price : item.price / 1000;
          totalPrice += priceInBillions;
          count++;
        });
      }
      
      const averagePrice = count > 0 ? totalPrice / count : 0;
      
      return {
        totalListings: totalListings || 0,
        activeListings: activeListings || 0,
        totalUsers: totalUsers || 0,
        totalAgents: totalAgents || 0,
        totalViews,
        totalInquiries,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        averagePrice: parseFloat(averagePrice.toFixed(1)),
      };
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      return {
        totalListings: 0,
        activeListings: 0,
        totalUsers: 0,
        totalAgents: 0,
        totalViews: 0,
        totalInquiries: 0,
        conversionRate: 0,
        averagePrice: 0,
      };
    }
  }

  /**
   * Get listings by type
   */
  private async getListingsByType(): Promise<{ [key: string]: number }> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('property_type, count')
        .select('property_type')
        .order('property_type');
      
      if (error) throw error;
      
      const result: { [key: string]: number } = {};
      
      if (data) {
        data.forEach(item => {
          result[item.property_type] = (result[item.property_type] || 0) + 1;
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching listings by type:', error);
      return {};
    }
  }

  /**
   * Get listings by location
   */
  private async getListingsByLocation(): Promise<AnalyticsData['listingsByLocation']> {
    try {
      // Get province IDs and counts
      const { data, error } = await supabase
        .from('listings')
        .select('province_id, count')
        .select('province_id')
        .order('province_id');
      
      if (error) throw error;
      
      // Count listings by province
      const provinceCounts: { [key: string]: number } = {};
      
      if (data) {
        data.forEach(item => {
          if (item.province_id) {
            provinceCounts[item.province_id] = (provinceCounts[item.province_id] || 0) + 1;
          }
        });
      }
      
      // Get province names
      const provinceIds = Object.keys(provinceCounts);
      
      if (provinceIds.length === 0) {
        return [];
      }
      
      const { data: provinces } = await supabase
        .from('locations')
        .select('id, name')
        .in('id', provinceIds)
        .eq('type', 'provinsi');
      
      // Calculate total for percentage
      const total = Object.values(provinceCounts).reduce((sum, count) => sum + count, 0);
      
      // Map to result format
      const result: AnalyticsData['listingsByLocation'] = [];
      
      if (provinces) {
        provinces.forEach(province => {
          const count = provinceCounts[province.id] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          result.push({
            province: province.name,
            count,
            percentage: parseFloat(percentage.toFixed(1)),
          });
        });
      }
      
      // Sort by count descending
      result.sort((a, b) => b.count - a.count);
      
      return result;
    } catch (error) {
      console.error('Error fetching listings by location:', error);
      return [];
    }
  }

  /**
   * Get listings by purpose
   */
  private async getListingsByPurpose(): Promise<AnalyticsData['listingsByPurpose']> {
    try {
      // Get counts by purpose
      const { data, error } = await supabase
        .from('listings')
        .select('purpose, count')
        .select('purpose')
        .order('purpose');
      
      if (error) throw error;
      
      let jual = 0;
      let sewa = 0;
      
      if (data) {
        data.forEach(item => {
          if (item.purpose === 'jual') {
            jual++;
          } else if (item.purpose === 'sewa') {
            sewa++;
          }
        });
      }
      
      return { jual, sewa };
    } catch (error) {
      console.error('Error fetching listings by purpose:', error);
      return { jual: 0, sewa: 0 };
    }
  }

  /**
   * Get active listings count within a time period
   */
  private async getActiveListingsCount(days: number): Promise<number> {
    try {
      const startDate = subDays(new Date(), days);
      
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', startDate.toISOString());
      
      return count || 0;
    } catch (error) {
      console.error(`Error fetching active listings for last ${days} days:`, error);
      return 0;
    }
  }

  /**
   * Get user registrations over time
   */
  private async getUserRegistrationsOverTime(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsData['userRegistrations']> {
    try {
      // Get all user registrations within date range
      const { data, error } = await supabase
        .from('user_profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');
      
      if (error) throw error;
      
      // Group by date
      const registrationsByDate: { [date: string]: number } = {};
      
      if (data) {
        data.forEach(user => {
          const date = user.created_at.split('T')[0]; // YYYY-MM-DD
          registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
        });
      }
      
      // Get total users before start date for cumulative count
      const { count: initialCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', startDate.toISOString());
      
      // Generate result with all dates in range
      const result: AnalyticsData['userRegistrations'] = [];
      let cumulativeCount = initialCount || 0;
      
      // Generate all dates in range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const count = registrationsByDate[dateStr] || 0;
        cumulativeCount += count;
        
        result.push({
          date: dateStr,
          count,
          cumulative: cumulativeCount,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching user registrations over time:', error);
      return [];
    }
  }

  /**
   * Get popular locations
   */
  private async getPopularLocations(): Promise<AnalyticsData['popularLocations']> {
    try {
      // Get locations with property counts
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .gt('property_count', 0)
        .order('property_count', { ascending: false })
        .limit(8);
      
      if (error) throw error;
      
      // Calculate growth (mock data for now)
      const result: AnalyticsData['popularLocations'] = [];
      
      if (data) {
        data.forEach(location => {
          // In a real implementation, you would calculate actual growth
          // by comparing current property count with historical data
          const growth = Math.random() * 25; // Random growth between 0-25%
          
          result.push({
            name: location.name,
            type: location.type,
            count: location.property_count || 0,
            growth: parseFloat(growth.toFixed(1)),
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching popular locations:', error);
      return [];
    }
  }

  /**
   * Get popular categories
   */
  private async getPopularCategories(): Promise<AnalyticsData['popularCategories']> {
    try {
      // Get categories with property counts
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .gt('property_count', 0)
        .order('property_count', { ascending: false });
      
      if (error) throw error;
      
      // Calculate total for percentage
      const total = data?.reduce((sum, category) => sum + (category.property_count || 0), 0) || 0;
      
      // Calculate growth (mock data for now)
      const result: AnalyticsData['popularCategories'] = [];
      
      if (data) {
        data.forEach(category => {
          // In a real implementation, you would calculate actual growth
          // by comparing current property count with historical data
          const growth = Math.random() * 20; // Random growth between 0-20%
          const count = category.property_count || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          result.push({
            name: category.name,
            count,
            percentage: parseFloat(percentage.toFixed(1)),
            growth: parseFloat(growth.toFixed(1)),
          });
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      return [];
    }
  }

  /**
   * Get price analysis
   */
  private async getPriceAnalysis(): Promise<AnalyticsData['priceAnalysis']> {
    try {
      // Get all listings with price data
      const { data, error } = await supabase
        .from('listings')
        .select('price, price_unit, property_type');
      
      if (error) throw error;
      
      // Calculate average price by type
      const pricesByType: { [type: string]: number[] } = {};
      const priceRangeCounts: { [range: string]: number } = {
        '< 500 Juta': 0,
        '500 Juta - 1 Miliar': 0,
        '1 - 2 Miliar': 0,
        '2 - 5 Miliar': 0,
        '5 - 10 Miliar': 0,
        '> 10 Miliar': 0,
      };
      
      if (data) {
        data.forEach(listing => {
          // Convert to billions for consistent calculation
          const priceInBillions = listing.price_unit === 'miliar' 
            ? listing.price 
            : listing.price / 1000;
          
          // Add to prices by type
          if (!pricesByType[listing.property_type]) {
            pricesByType[listing.property_type] = [];
          }
          pricesByType[listing.property_type].push(priceInBillions);
          
          // Count by price range
          const priceInMillions = priceInBillions * 1000;
          
          if (priceInMillions < 500) {
            priceRangeCounts['< 500 Juta']++;
          } else if (priceInMillions < 1000) {
            priceRangeCounts['500 Juta - 1 Miliar']++;
          } else if (priceInMillions < 2000) {
            priceRangeCounts['1 - 2 Miliar']++;
          } else if (priceInMillions < 5000) {
            priceRangeCounts['2 - 5 Miliar']++;
          } else if (priceInMillions < 10000) {
            priceRangeCounts['5 - 10 Miliar']++;
          } else {
            priceRangeCounts['> 10 Miliar']++;
          }
        });
      }
      
      // Calculate averages
      const averageByType: { [type: string]: number } = {};
      
      Object.entries(pricesByType).forEach(([type, prices]) => {
        if (prices.length > 0) {
          const sum = prices.reduce((total, price) => total + price, 0);
          averageByType[type] = parseFloat((sum / prices.length).toFixed(1));
        }
      });
      
      // Calculate total for percentages
      const total = Object.values(priceRangeCounts).reduce((sum, count) => sum + count, 0);
      
      // Format price ranges
      const priceRanges = Object.entries(priceRangeCounts).map(([range, count]) => ({
        range,
        count,
        percentage: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
      }));
      
      return {
        averageByType,
        priceRanges,
      };
    } catch (error) {
      console.error('Error fetching price analysis:', error);
      return {
        averageByType: {},
        priceRanges: [],
      };
    }
  }

  /**
   * Get performance metrics over time
   */
  private async getPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsData['performanceMetrics']> {
    try {
      // In a real implementation, you would query time-series data
      // from your database. For now, we'll generate mock data.
      
      const result: AnalyticsData['performanceMetrics'] = [];
      
      // Generate all dates in range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        
        // Generate random metrics
        result.push({
          date: dateStr,
          views: Math.floor(Math.random() * 5000) + 3000,
          inquiries: Math.floor(Math.random() * 400) + 200,
          newListings: Math.floor(Math.random() * 60) + 20,
          newUsers: Math.floor(Math.random() * 35) + 15,
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  /**
   * Get agent performance
   */
  private async getAgentPerformance(): Promise<AnalyticsData['agentPerformance']> {
    try {
      // Get top agents by listing count
      const { data: agents, error } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('role', 'agent')
        .limit(5);
      
      if (error) throw error;
      
      // Get listings for each agent
      const result: AnalyticsData['agentPerformance'] = [];
      
      if (agents) {
        for (const agent of agents) {
          // Get agent's listings
          const { data: listings } = await supabase
            .from('listings')
            .select('id, status, views, inquiries')
            .eq('user_id', agent.id);
          
          if (listings && listings.length > 0) {
            const totalListings = listings.length;
            const activeListings = listings.filter(l => l.status === 'active').length;
            const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
            const totalInquiries = listings.reduce((sum, l) => sum + (l.inquiries || 0), 0);
            const conversionRate = totalViews > 0 
              ? parseFloat(((totalInquiries / totalViews) * 100).toFixed(1)) 
              : 0;
            
            result.push({
              agentId: agent.id,
              agentName: agent.full_name,
              totalListings,
              activeListings,
              totalViews,
              totalInquiries,
              conversionRate,
            });
          }
        }
      }
      
      // Sort by total views descending
      result.sort((a, b) => b.totalViews - a.totalViews);
      
      return result;
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return [];
    }
  }

  /**
   * Get mock analytics data as fallback
   */
  private getMockAnalyticsData(): AnalyticsData {
    // Generate mock data for demonstration
    const now = new Date();
    
    return {
      overview: {
        totalListings: 8921,
        activeListings: 7834,
        totalUsers: 12543,
        totalAgents: 1247,
        totalViews: 156789,
        totalInquiries: 8934,
        conversionRate: 5.7,
        averagePrice: 2.8,
      },
      
      listingsByType: {
        'rumah': 3456,
        'apartemen': 2134,
        'ruko': 1245,
        'tanah': 987,
        'kondominium': 654,
        'gedung_komersial': 321,
        'ruang_industri': 124,
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
      
      userRegistrations: Array.from({ length: 30 }, (_, i) => {
        const date = format(subDays(now, 29 - i), 'yyyy-MM-dd');
        return {
          date,
          count: Math.floor(Math.random() * 70) + 15,
          cumulative: 12000 + (i * 18),
        };
      }),
      
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
          'gedung_komersial': 12.5,
          'ruang_industri': 8.7,
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
      
      performanceMetrics: Array.from({ length: 30 }, (_, i) => {
        const date = format(subDays(now, 29 - i), 'yyyy-MM-dd');
        return {
          date,
          views: Math.floor(Math.random() * 5000) + 3000,
          inquiries: Math.floor(Math.random() * 400) + 200,
          newListings: Math.floor(Math.random() * 60) + 20,
          newUsers: Math.floor(Math.random() * 35) + 15,
        };
      }),
      
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
  }
}

export const analyticsService = new AnalyticsService();