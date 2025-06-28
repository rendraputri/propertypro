import { supabase } from '../lib/supabase';
import { Category } from '../types/admin';

class CategoryService {
  /**
   * Get all categories with optional filtering
   */
  async getAllCategories(filters?: { isActive?: boolean; search?: string }): Promise<Category[]> {
    try {
      let query = supabase
        .from('categories')
        .select('*');

      // Apply filters
      if (filters) {
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
        }
      }
      
      // Execute query
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Map database categories to Category interface
      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        isActive: category.is_active || false,
        propertyCount: category.property_count || 0,
        createdAt: category.created_at,
        updatedAt: category.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        icon: data.icon || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  /**
   * Create a new category
   */
  async createCategory(categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description || null,
          icon: categoryData.icon || null,
          is_active: categoryData.isActive !== undefined ? categoryData.isActive : true,
          property_count: 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        icon: data.icon || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  /**
   * Update an existing category
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          slug: updates.slug,
          description: updates.description || null,
          icon: updates.icon || null,
          is_active: updates.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        icon: data.icon || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // First check if category has properties
      const { data: category, error: fetchError } = await supabase
        .from('categories')
        .select('property_count')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (category && category.property_count > 0) {
        throw new Error(`Cannot delete category with ${category.property_count} properties`);
      }
      
      // Delete the category
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }

  /**
   * Toggle category active status
   */
  async toggleCategoryStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error toggling category status:', error);
      return false;
    }
  }
}

export const categoryService = new CategoryService();