import { supabase } from '../lib/supabase';
import { Report, ModerationAction, ModerationStats } from '../types/admin';

class ReportService {
  /**
   * Get all reports with optional filtering
   */
  async getAllReports(filters?: { 
    status?: string; 
    type?: string; 
    priority?: string;
    search?: string;
  }): Promise<Report[]> {
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          property:listings(
            id,
            title,
            property_type,
            purpose,
            price,
            price_unit,
            status,
            user_id,
            city_id,
            province_id
          )
        `);

      // Apply filters
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        
        if (filters.priority && filters.priority !== 'all') {
          query = query.eq('priority', filters.priority);
        }
        
        if (filters.search) {
          query = query.or(`reason.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
      }
      
      // Execute query
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get additional data for each report
      const reports: Report[] = await Promise.all((data || []).map(async (report) => {
        // Get property location names
        const { data: locations } = await supabase
          .from('locations')
          .select('id, name, type')
          .in('id', [report.property.province_id, report.property.city_id].filter(Boolean));
        
        const province = locations?.find(l => l.id === report.property.province_id)?.name || '';
        const city = locations?.find(l => l.id === report.property.city_id)?.name || '';
        
        // Get property images
        const { data: media } = await supabase
          .from('property_media')
          .select('media_url')
          .eq('listing_id', report.property.id)
          .limit(1);
        
        const imageUrl = media && media.length > 0 ? media[0].media_url : '';
        
        // Get agent info
        const { data: agent } = await supabase
          .from('user_profiles')
          .select('id, full_name, email')
          .eq('id', report.property.user_id)
          .single();
        
        return {
          id: report.id,
          propertyId: report.property_id,
          reporterId: report.reporter_id,
          reporterName: report.reporter_name,
          reporterEmail: report.reporter_email,
          type: report.type,
          reason: report.reason,
          description: report.description || '',
          status: report.status,
          priority: report.priority,
          createdAt: report.created_at,
          updatedAt: report.updated_at,
          resolvedAt: report.resolved_at,
          resolvedBy: report.resolved_by,
          resolution: report.resolution,
          property: {
            id: report.property.id,
            title: report.property.title,
            type: report.property.property_type,
            purpose: report.property.purpose,
            price: report.property.price,
            priceUnit: report.property.price_unit,
            location: {
              city,
              province,
            },
            images: imageUrl ? [imageUrl] : [],
            agent: {
              id: agent?.id || '',
              name: agent?.full_name || 'Unknown',
              email: agent?.email || '',
            },
            status: report.property.status,
          },
        };
      }));
      
      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  }

  /**
   * Get a single report by ID
   */
  async getReportById(id: string): Promise<Report | null> {
    try {
      const { data: report, error } = await supabase
        .from('reports')
        .select(`
          *,
          property:listings(
            id,
            title,
            property_type,
            purpose,
            price,
            price_unit,
            status,
            user_id,
            city_id,
            province_id
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!report) return null;
      
      // Get property location names
      const { data: locations } = await supabase
        .from('locations')
        .select('id, name, type')
        .in('id', [report.property.province_id, report.property.city_id].filter(Boolean));
      
      const province = locations?.find(l => l.id === report.property.province_id)?.name || '';
      const city = locations?.find(l => l.id === report.property.city_id)?.name || '';
      
      // Get property images
      const { data: media } = await supabase
        .from('property_media')
        .select('media_url')
        .eq('listing_id', report.property.id)
        .limit(1);
      
      const imageUrl = media && media.length > 0 ? media[0].media_url : '';
      
      // Get agent info
      const { data: agent } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .eq('id', report.property.user_id)
        .single();
      
      return {
        id: report.id,
        propertyId: report.property_id,
        reporterId: report.reporter_id,
        reporterName: report.reporter_name,
        reporterEmail: report.reporter_email,
        type: report.type,
        reason: report.reason,
        description: report.description || '',
        status: report.status,
        priority: report.priority,
        createdAt: report.created_at,
        updatedAt: report.updated_at,
        resolvedAt: report.resolved_at,
        resolvedBy: report.resolved_by,
        resolution: report.resolution,
        property: {
          id: report.property.id,
          title: report.property.title,
          type: report.property.property_type,
          purpose: report.property.purpose,
          price: report.property.price,
          priceUnit: report.property.price_unit,
          location: {
            city,
            province,
          },
          images: imageUrl ? [imageUrl] : [],
          agent: {
            id: agent?.id || '',
            name: agent?.full_name || 'Unknown',
            email: agent?.email || '',
          },
          status: report.property.status,
        },
      };
    } catch (error) {
      console.error('Error fetching report:', error);
      return null;
    }
  }

  /**
   * Update report status
   */
  async updateReportStatus(
    id: string, 
    status: 'pending' | 'under_review' | 'resolved' | 'dismissed',
    resolution?: string,
    adminId?: string
  ): Promise<boolean> {
    try {
      const updates: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      if (status === 'resolved' || status === 'dismissed') {
        updates.resolved_at = new Date().toISOString();
        updates.resolved_by = adminId;
        updates.resolution = resolution;
      }
      
      const { error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating report status:', error);
      return false;
    }
  }

  /**
   * Create a moderation action
   */
  async createModerationAction(actionData: {
    reportId?: string;
    propertyId: string;
    adminId: string;
    adminName: string;
    action: string;
    reason: string;
    details?: string;
    previousStatus?: string;
    newStatus?: string;
  }): Promise<ModerationAction | null> {
    try {
      const { data, error } = await supabase
        .from('moderation_actions')
        .insert({
          report_id: actionData.reportId || null,
          property_id: actionData.propertyId,
          admin_id: actionData.adminId,
          admin_name: actionData.adminName,
          action: actionData.action,
          reason: actionData.reason,
          details: actionData.details || null,
          previous_status: actionData.previousStatus || null,
          new_status: actionData.newStatus || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Get property info
      const { data: property } = await supabase
        .from('listings')
        .select('id, title, user_id')
        .eq('id', actionData.propertyId)
        .single();
      
      // Get agent info
      const { data: agent } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .eq('id', property?.user_id)
        .single();
      
      return {
        id: data.id,
        reportId: data.report_id || undefined,
        propertyId: data.property_id,
        adminId: data.admin_id,
        adminName: data.admin_name,
        action: data.action,
        reason: data.reason,
        details: data.details || undefined,
        previousStatus: data.previous_status || undefined,
        newStatus: data.new_status || undefined,
        createdAt: data.created_at,
        property: {
          id: property?.id || '',
          title: property?.title || '',
          agent: {
            id: agent?.id || '',
            name: agent?.full_name || 'Unknown',
            email: agent?.email || '',
          },
        },
      };
    } catch (error) {
      console.error('Error creating moderation action:', error);
      return null;
    }
  }

  /**
   * Get all moderation actions
   */
  async getAllModerationActions(filters?: {
    action?: string;
    adminId?: string;
    dateRange?: string;
    search?: string;
  }): Promise<ModerationAction[]> {
    try {
      let query = supabase
        .from('moderation_actions')
        .select(`
          *,
          property:listings(id, title, user_id)
        `);

      // Apply filters
      if (filters) {
        if (filters.action && filters.action !== 'all') {
          query = query.eq('action', filters.action);
        }
        
        if (filters.adminId && filters.adminId !== 'all') {
          query = query.eq('admin_id', filters.adminId);
        }
        
        if (filters.dateRange && filters.dateRange !== 'all') {
          const now = new Date();
          let startDate: Date;
          
          switch (filters.dateRange) {
            case 'today':
              startDate = new Date(now.setHours(0, 0, 0, 0));
              break;
            case 'week':
              startDate = new Date(now);
              startDate.setDate(startDate.getDate() - 7);
              break;
            case 'month':
              startDate = new Date(now);
              startDate.setDate(startDate.getDate() - 30);
              break;
            default:
              startDate = new Date(0);
          }
          
          query = query.gte('created_at', startDate.toISOString());
        }
        
        if (filters.search) {
          query = query.or(`reason.ilike.%${filters.search}%,details.ilike.%${filters.search}%,admin_name.ilike.%${filters.search}%`);
        }
      }
      
      // Execute query
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get agent info for each property
      const actions: ModerationAction[] = await Promise.all((data || []).map(async (action) => {
        const { data: agent } = await supabase
          .from('user_profiles')
          .select('id, full_name, email')
          .eq('id', action.property.user_id)
          .single();
        
        return {
          id: action.id,
          reportId: action.report_id || undefined,
          propertyId: action.property_id,
          adminId: action.admin_id,
          adminName: action.admin_name,
          action: action.action,
          reason: action.reason,
          details: action.details || undefined,
          previousStatus: action.previous_status || undefined,
          newStatus: action.new_status || undefined,
          createdAt: action.created_at,
          property: {
            id: action.property.id,
            title: action.property.title,
            agent: {
              id: agent?.id || '',
              name: agent?.full_name || 'Unknown',
              email: agent?.email || '',
            },
          },
        };
      }));
      
      return actions;
    } catch (error) {
      console.error('Error fetching moderation actions:', error);
      return [];
    }
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(): Promise<ModerationStats> {
    try {
      // Get total reports count
      const { count: totalReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });
      
      // Get pending reports count
      const { count: pendingReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get resolved reports count
      const { count: resolvedReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved');
      
      // Get dismissed reports count
      const { count: dismissedReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'dismissed');
      
      // Get actions taken today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: actionsToday } = await supabase
        .from('moderation_actions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
      
      // Get average resolution time
      const { data: resolvedReportsData } = await supabase
        .from('reports')
        .select('created_at, resolved_at')
        .not('resolved_at', 'is', null)
        .limit(100);
      
      let totalResolutionTime = 0;
      let resolutionCount = 0;
      
      if (resolvedReportsData) {
        resolvedReportsData.forEach(report => {
          if (report.created_at && report.resolved_at) {
            const createdAt = new Date(report.created_at).getTime();
            const resolvedAt = new Date(report.resolved_at).getTime();
            const resolutionTime = (resolvedAt - createdAt) / (1000 * 60 * 60); // in hours
            totalResolutionTime += resolutionTime;
            resolutionCount++;
          }
        });
      }
      
      const averageResolutionTime = resolutionCount > 0 ? totalResolutionTime / resolutionCount : 0;
      
      // Get reports by type
      const { data: reportsByTypeData } = await supabase
        .from('reports')
        .select('type, count')
        .select('type')
        .order('type');
      
      const reportsByType: { [key: string]: number } = {};
      
      if (reportsByTypeData) {
        reportsByTypeData.forEach(report => {
          reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
        });
      }
      
      // Get reports by priority
      const { data: reportsByPriorityData } = await supabase
        .from('reports')
        .select('priority')
        .order('priority');
      
      const reportsByPriority: { [key: string]: number } = {};
      
      if (reportsByPriorityData) {
        reportsByPriorityData.forEach(report => {
          reportsByPriority[report.priority] = (reportsByPriority[report.priority] || 0) + 1;
        });
      }
      
      return {
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0,
        resolvedReports: resolvedReports || 0,
        dismissedReports: dismissedReports || 0,
        actionsToday: actionsToday || 0,
        averageResolutionTime,
        reportsByType,
        reportsByPriority,
      };
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
      return {
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        dismissedReports: 0,
        actionsToday: 0,
        averageResolutionTime: 0,
        reportsByType: {},
        reportsByPriority: {},
      };
    }
  }
}

export const reportService = new ReportService();