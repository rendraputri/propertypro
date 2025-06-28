import { supabase } from '../lib/supabase';
import { SystemSettings, AdminUser, ActivityLog } from '../types/admin';

class SettingsService {
  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<SystemSettings | null> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return data.settings_data as SystemSettings;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return null;
    }
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: SystemSettings, adminId: string, adminName: string): Promise<boolean> {
    try {
      // Get current settings to check if they exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('system_settings')
        .select('id')
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      let updateError;
      
      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        const { error } = await supabase
          .from('system_settings')
          .update({
            settings_data: settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSettings[0].id);
        
        updateError = error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('system_settings')
          .insert({
            settings_data: settings,
            updated_at: new Date().toISOString(),
          });
        
        updateError = error;
      }
      
      if (updateError) throw updateError;
      
      // Log the activity
      await this.logActivity({
        userId: adminId,
        userName: adminName,
        action: 'UPDATE_SETTINGS',
        resource: 'system_settings',
        details: 'Updated system settings',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating system settings:', error);
      return false;
    }
  }

  /**
   * Get all admin users
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['admin', 'superadmin'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get auth data for each admin
      const adminUsers: AdminUser[] = await Promise.all((data || []).map(async (profile) => {
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
        
        return {
          id: profile.id,
          name: profile.full_name,
          email: authUser?.user?.email || '',
          role: profile.role,
          permissions: profile.permissions || [],
          isActive: profile.status === 'active',
          lastLogin: authUser?.user?.last_sign_in_at,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at,
        };
      }));
      
      return adminUsers;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }
  }

  /**
   * Create a new admin user
   */
  async createAdminUser(userData: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'superadmin';
    permissions: string[];
    isActive: boolean;
  }): Promise<AdminUser | null> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.name,
          role: userData.role,
        },
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');
      
      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          full_name: userData.name,
          role: userData.role,
          status: userData.isActive ? 'active' : 'inactive',
          permissions: userData.permissions,
        })
        .select()
        .single();
      
      if (profileError) {
        // Rollback auth user creation if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      return {
        id: profile.id,
        name: profile.full_name,
        email: authData.user.email || '',
        role: profile.role,
        permissions: profile.permissions || [],
        isActive: profile.status === 'active',
        lastLogin: null,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch (error) {
      console.error('Error creating admin user:', error);
      return null;
    }
  }

  /**
   * Update an admin user
   */
  async updateAdminUser(id: string, updates: {
    name?: string;
    role?: 'admin' | 'superadmin';
    permissions?: string[];
    isActive?: boolean;
  }): Promise<AdminUser | null> {
    try {
      // Update user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: updates.name,
          role: updates.role,
          status: updates.isActive !== undefined ? (updates.isActive ? 'active' : 'inactive') : undefined,
          permissions: updates.permissions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // Get auth data
      const { data: authUser } = await supabase.auth.admin.getUserById(id);
      
      return {
        id: profile.id,
        name: profile.full_name,
        email: authUser?.user?.email || '',
        role: profile.role,
        permissions: profile.permissions || [],
        isActive: profile.status === 'active',
        lastLogin: authUser?.user?.last_sign_in_at,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    } catch (error) {
      console.error('Error updating admin user:', error);
      return null;
    }
  }

  /**
   * Delete an admin user
   */
  async deleteAdminUser(id: string): Promise<boolean> {
    try {
      // Delete auth user (this will cascade to user_profiles due to foreign key constraint)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting admin user:', error);
      return false;
    }
  }

  /**
   * Log an activity
   */
  async logActivity(activityData: {
    userId: string;
    userName: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: activityData.userId,
          user_name: activityData.userName,
          action: activityData.action,
          resource: activityData.resource,
          resource_id: activityData.resourceId || null,
          details: activityData.details || null,
          ip_address: '127.0.0.1', // In a real app, you would get the actual IP
          user_agent: navigator.userAgent,
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    dateRange?: string;
    search?: string;
  }, page: number = 1, pageSize: number = 15): Promise<{ data: ActivityLog[]; count: number }> {
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        
        if (filters.action && filters.action !== 'all') {
          query = query.eq('action', filters.action);
        }
        
        if (filters.resource && filters.resource !== 'all') {
          query = query.eq('resource', filters.resource);
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
          query = query.or(`details.ilike.%${filters.search}%,user_name.ilike.%${filters.search}%,action.ilike.%${filters.search}%`);
        }
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map to ActivityLog interface
      const activityLogs: ActivityLog[] = (data || []).map(log => ({
        id: log.id,
        userId: log.user_id || '',
        userName: log.user_name || '',
        action: log.action,
        resource: log.resource,
        resourceId: log.resource_id,
        details: log.details,
        ipAddress: log.ip_address || '',
        userAgent: log.user_agent || '',
        createdAt: log.created_at,
      }));
      
      return {
        data: activityLogs,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Create a backup
   */
  async createBackup(): Promise<boolean> {
    try {
      // In a real implementation, this would call a server-side function
      // to create a database backup
      
      // Update the last backup date in settings
      const { data: settings } = await supabase
        .from('system_settings')
        .select('id, settings_data')
        .limit(1)
        .single();
      
      if (settings) {
        const updatedSettings = {
          ...settings.settings_data,
          backup: {
            ...settings.settings_data.backup,
            lastBackupDate: new Date().toISOString(),
            nextBackupDate: this.calculateNextBackupDate(
              settings.settings_data.backup.backupFrequency
            ),
          },
        };
        
        await supabase
          .from('system_settings')
          .update({
            settings_data: updatedSettings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  /**
   * Calculate next backup date based on frequency
   */
  private calculateNextBackupDate(frequency: string): string {
    const now = new Date();
    const nextDate = new Date(now);
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      default:
        nextDate.setDate(nextDate.getDate() + 1);
    }
    
    return nextDate.toISOString();
  }
}

export const settingsService = new SettingsService();