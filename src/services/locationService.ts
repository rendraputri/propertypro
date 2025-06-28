import { supabase } from '../lib/supabase';
import { Location, LocationHierarchy } from '../types/admin';

class LocationService {
  /**
   * Get all locations with optional filtering
   */
  async getAllLocations(filters?: { 
    type?: string; 
    isActive?: boolean; 
    parentId?: string;
    search?: string;
  }): Promise<Location[]> {
    try {
      let query = supabase
        .from('locations')
        .select('*');

      // Apply filters
      if (filters) {
        if (filters.type && filters.type !== 'all') {
          query = query.eq('type', filters.type);
        }
        
        if (filters.isActive !== undefined) {
          query = query.eq('is_active', filters.isActive);
        }
        
        if (filters.parentId) {
          query = query.eq('parent_id', filters.parentId);
        } else if (filters.parentId === '') {
          query = query.is('parent_id', null);
        }
        
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
        }
      }
      
      // Execute query
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Map database locations to Location interface
      return (data || []).map(location => ({
        id: location.id,
        name: location.name,
        type: location.type,
        parentId: location.parent_id || undefined,
        slug: location.slug,
        description: location.description || '',
        isActive: location.is_active || false,
        propertyCount: location.property_count || 0,
        coordinates: location.latitude && location.longitude ? {
          latitude: location.latitude,
          longitude: location.longitude,
        } : undefined,
        createdAt: location.created_at,
        updatedAt: location.updated_at,
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }

  /**
   * Build location hierarchy
   */
  buildLocationHierarchy(locations: Location[]): LocationHierarchy[] {
    const locationMap = new Map<string, LocationHierarchy>();
    const rootLocations: LocationHierarchy[] = [];

    // Create map of all locations
    locations.forEach(location => {
      locationMap.set(location.id, { ...location, children: [] });
    });

    // Build hierarchy
    locations.forEach(location => {
      const locationNode = locationMap.get(location.id)!;
      
      if (location.parentId) {
        const parent = locationMap.get(location.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(locationNode);
          locationNode.parent = parent;
        }
      } else {
        rootLocations.push(locationNode);
      }
    });

    return rootLocations;
  }

  /**
   * Get a single location by ID
   */
  async getLocationById(id: string): Promise<Location | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        parentId: data.parent_id || undefined,
        slug: data.slug,
        description: data.description || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        coordinates: data.latitude && data.longitude ? {
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  }

  /**
   * Create a new location
   */
  async createLocation(locationData: Partial<Location>): Promise<Location | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: locationData.name,
          type: locationData.type,
          parent_id: locationData.parentId || null,
          slug: locationData.slug,
          description: locationData.description || null,
          is_active: locationData.isActive !== undefined ? locationData.isActive : true,
          property_count: 0,
          latitude: locationData.coordinates?.latitude || null,
          longitude: locationData.coordinates?.longitude || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        parentId: data.parent_id || undefined,
        slug: data.slug,
        description: data.description || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        coordinates: data.latitude && data.longitude ? {
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error creating location:', error);
      return null;
    }
  }

  /**
   * Update an existing location
   */
  async updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update({
          name: updates.name,
          type: updates.type,
          parent_id: updates.parentId || null,
          slug: updates.slug,
          description: updates.description || null,
          is_active: updates.isActive,
          latitude: updates.coordinates?.latitude || null,
          longitude: updates.coordinates?.longitude || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        parentId: data.parent_id || undefined,
        slug: data.slug,
        description: data.description || '',
        isActive: data.is_active || false,
        propertyCount: data.property_count || 0,
        coordinates: data.latitude && data.longitude ? {
          latitude: data.latitude,
          longitude: data.longitude,
        } : undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error('Error updating location:', error);
      return null;
    }
  }

  /**
   * Delete a location
   */
  async deleteLocation(id: string): Promise<boolean> {
    try {
      // First check if location has properties
      const { data: location, error: fetchError } = await supabase
        .from('locations')
        .select('property_count')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (location && location.property_count > 0) {
        throw new Error(`Cannot delete location with ${location.property_count} properties`);
      }
      
      // Check if location has children
      const { data: children, error: childrenError } = await supabase
        .from('locations')
        .select('id')
        .eq('parent_id', id);
      
      if (childrenError) throw childrenError;
      
      if (children && children.length > 0) {
        throw new Error(`Cannot delete location with ${children.length} child locations`);
      }
      
      // Delete the location
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      return false;
    }
  }

  /**
   * Toggle location active status
   */
  async toggleLocationStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error toggling location status:', error);
      return false;
    }
  }
}

export const locationService = new LocationService();