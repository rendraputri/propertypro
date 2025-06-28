import { supabase } from '../lib/supabase';
import { User } from '../contexts/AuthContext';
import { Database } from '../types/supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

class UserService {
  /**
   * Get all users with optional filtering and pagination
   */
  async getAllUsers(
    filters?: { status?: string; role?: string; search?: string },
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ data: User[]; count: number }> {
    try {
      let query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        if (filters.role && filters.role !== 'all') {
          query = query.eq('role', filters.role);
        }
        
        if (filters.search) {
          query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
        }
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Get emails from auth.users for each user profile
      const userIds = (data || []).map(profile => profile.id);
      const { data: authUsers } = await supabase.auth.admin.listUsers({
        perPage: userIds.length,
        page: 1,
      });
      
      // Map user profiles to User interface
      const users: User[] = (data || []).map(profile => {
        const authUser = authUsers?.users.find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || '',
        };
      });
      
      return {
        data: users,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!profile) return null;
      
      // Get email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(id);
      
      if (!authUser?.user) return null;
      
      return {
        ...profile,
        email: authUser.user.email || '',
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    role?: string;
    company?: string;
  }): Promise<User | null> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          phone: userData.phone,
          role: userData.role || 'user',
        },
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');
      
      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          full_name: userData.full_name,
          phone: userData.phone || null,
          role: (userData.role || 'user') as Database['public']['Enums']['user_role'],
          status: 'active' as Database['public']['Enums']['user_status'],
          company: userData.company || null,
        })
        .select()
        .single();
      
      if (profileError) {
        // Rollback auth user creation if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      return {
        ...profile,
        email: authData.user.email || '',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: string, updates: Partial<UserProfile>): Promise<User | null> {
    try {
      // Update user profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Get email from auth.users
      const { data: authUser } = await supabase.auth.admin.getUserById(id);
      
      if (!authUser?.user) return null;
      
      return {
        ...profile,
        email: authUser.user.email || '',
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      // Delete auth user (this will cascade to user_profiles due to foreign key constraint)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Change user status
   */
  async changeUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error changing user status:', error);
      return false;
    }
  }
}

export const userService = new UserService();