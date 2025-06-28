import { supabase } from '../lib/supabase';
import { Listing, PropertyMedia, UserListing, ListingFormData, ListingFilters } from '../types/listing';
import { Property, PropertyType, ListingStatus, Location } from '../types';
import { provinces, cities, districts } from '../data/locations';

/**
 * Service for managing property listings
 */
class ListingService {
  /**
   * Get all listings with optional filtering, sorting, and pagination
   */
  async getAllListings(filters?: ListingFilters, page: number = 1, pageSize: number = 10): Promise<{
    data: Property[];
    count: number;
  }> {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          property_media!inner(*)
        `, { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        
        if (filters.type && filters.type !== 'all') {
          query = query.eq('property_type', filters.type);
        }
        
        if (filters.purpose && filters.purpose !== 'all') {
          query = query.eq('purpose', filters.purpose);
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange;
          if (min !== null) query = query.gte('price', min);
          if (max !== null) query = query.lte('price', max);
        }
        
        if (filters.bedrooms) {
          query = query.gte('bedrooms', filters.bedrooms);
        }
        
        if (filters.bathrooms) {
          query = query.gte('bathrooms', filters.bathrooms);
        }
        
        if (filters.location) {
          if (filters.location.province) {
            query = query.eq('province_id', filters.location.province);
          }
          if (filters.location.city) {
            query = query.eq('city_id', filters.location.city);
          }
          if (filters.location.district) {
            query = query.eq('district_id', filters.location.district);
          }
        }
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'views':
            query = query.order('views', { ascending: false });
            break;
          case 'premium':
            // First sort by is_promoted, then by created_at
            query = query.order('is_promoted', { ascending: false })
                         .order('created_at', { ascending: false });
            break;
        }
      } else {
        // Default sorting
        query = query.order('created_at', { ascending: false });
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transform data to Property interface
      const properties: Property[] = await this.transformListingsToProperties(data || []);
      
      return {
        data: properties,
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching listings:', error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Get a single listing by ID
   */
  async getListingById(id: string): Promise<Property | null> {
    try {
      // Get the listing
      const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!listing) return null;
      
      // Get the property media
      const { data: media } = await supabase
        .from('property_media')
        .select('*')
        .eq('listing_id', id)
        .order('is_primary', { ascending: false });
      
      // Get the user profile (agent)
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', listing.user_id)
        .single();
      
      // Transform to Property interface
      return this.transformListingToProperty(listing, media || [], userProfile);
    } catch (error) {
      console.error('Error fetching listing:', error);
      return null;
    }
  }

  /**
   * Get listings for a specific user
   */
  async getUserListings(userId: string): Promise<UserListing[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          property_media(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to UserListing interface
      const userListings: UserListing[] = await Promise.all((data || []).map(async (listing) => {
        // Get location names
        const province = provinces.find(p => p.id === listing.province_id)?.name || '';
        const city = cities.find(c => c.id === listing.city_id)?.name || '';
        
        // Get primary image
        const media = listing.property_media || [];
        const primaryImage = media.find(m => m.is_primary)?.media_url || 
                            (media.length > 0 ? media[0].media_url : '');
        
        // Map status
        let status: 'active' | 'inactive' | 'expired' | 'pending';
        switch (listing.status) {
          case 'active':
            status = 'active';
            break;
          case 'pending':
          case 'draft':
            status = 'pending';
            break;
          case 'rejected':
          case 'rented':
          case 'sold':
            status = 'inactive';
            break;
          default:
            status = 'expired';
        }
        
        // Check if premium
        const { data: premiumData } = await supabase
          .from('premium_listings')
          .select('*')
          .eq('property_id', listing.id)
          .eq('status', 'active')
          .gt('end_date', new Date().toISOString())
          .single();
        
        return {
          id: listing.id,
          title: listing.title,
          type: listing.property_type,
          purpose: listing.purpose,
          price: listing.price,
          priceUnit: listing.price_unit,
          status,
          isPremium: !!premiumData,
          premiumExpiresAt: premiumData?.end_date,
          views: listing.views,
          createdAt: listing.created_at,
          image: primaryImage || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
          location: {
            city,
            province
          }
        };
      }));
      
      return userListings;
    } catch (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }
  }

  /**
   * Create a new listing
   */
  async createListing(formData: ListingFormData, userId: string): Promise<string | null> {
    try {
      // Prepare listing data
      const listingData = this.prepareListingData(formData, userId);
      
      // Insert listing
      const { data, error } = await supabase
        .from('listings')
        .insert(listingData)
        .select('id')
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Failed to create listing');
      
      const listingId = data.id;
      
      // Upload images and create property media records
      if (formData.images.length > 0) {
        await this.savePropertyMedia(listingId, formData.images);
      }
      
      return listingId;
    } catch (error) {
      console.error('Error creating listing:', error);
      return null;
    }
  }

  /**
   * Update an existing listing
   */
  async updateListing(id: string, formData: ListingFormData, userId: string): Promise<boolean> {
    try {
      // Prepare listing data
      const listingData = this.prepareListingData(formData, userId);
      
      // Update listing
      const { error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Delete existing media
      await supabase
        .from('property_media')
        .delete()
        .eq('listing_id', id);
      
      // Upload new images and create property media records
      if (formData.images.length > 0) {
        await this.savePropertyMedia(id, formData.images);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating listing:', error);
      return false;
    }
  }

  /**
   * Update listing status
   */
  async updateListingStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating listing status:', error);
      return false;
    }
  }

  /**
   * Delete a listing
   */
  async deleteListing(id: string, userId: string): Promise<boolean> {
    try {
      // Delete property media first (foreign key constraint)
      const { error: mediaError } = await supabase
        .from('property_media')
        .delete()
        .eq('listing_id', id);
      
      if (mediaError) throw mediaError;
      
      // Delete the listing
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting listing:', error);
      return false;
    }
  }

  /**
   * Increment view count for a listing
   */
  async incrementViewCount(id: string): Promise<void> {
    try {
      await supabase.rpc('increment_listing_views', { listing_id: id });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  /**
   * Increment inquiry count for a listing
   */
  async incrementInquiryCount(id: string): Promise<void> {
    try {
      await supabase.rpc('increment_listing_inquiries', { listing_id: id });
    } catch (error) {
      console.error('Error incrementing inquiry count:', error);
    }
  }

  /**
   * Upload an image to Supabase Storage
   */
  private async uploadImage(file: File | string, listingId: string): Promise<string> {
    // If the file is already a URL (not a data URL), return it
    if (typeof file === 'string' && !file.startsWith('data:')) {
      return file;
    }
    
    try {
      // For data URLs, convert to file
      let fileToUpload: File;
      if (typeof file === 'string') {
        // Convert data URL to File
        const res = await fetch(file);
        const blob = await res.blob();
        fileToUpload = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      } else {
        fileToUpload = file;
      }
      
      // Generate a unique file name
      const fileName = `${listingId}/${Date.now()}-${fileToUpload.name.replace(/\s+/g, '-')}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // If upload fails, return the original URL
      return typeof file === 'string' ? file : '';
    }
  }

  /**
   * Save property media records
   */
  private async savePropertyMedia(listingId: string, images: string[]): Promise<void> {
    try {
      const mediaRecords = await Promise.all(images.map(async (image, index) => {
        // Upload image if it's a new one (data URL)
        let mediaUrl = image;
        if (image.startsWith('data:')) {
          mediaUrl = await this.uploadImage(image, listingId);
        }
        
        return {
          listing_id: listingId,
          media_url: mediaUrl,
          media_type: 'image',
          is_primary: index === 0 // First image is primary
        };
      }));
      
      // Insert media records
      const { error } = await supabase
        .from('property_media')
        .insert(mediaRecords);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving property media:', error);
    }
  }

  /**
   * Prepare listing data for database
   */
  private prepareListingData(formData: ListingFormData, userId: string): Partial<Listing> {
    return {
      user_id: userId,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      price_unit: formData.priceUnit,
      property_type: formData.propertyType,
      purpose: formData.purpose,
      bedrooms: formData.bedrooms || null,
      bathrooms: formData.bathrooms || null,
      building_size: formData.buildingSize || null,
      land_size: formData.landSize || null,
      province_id: formData.province || null,
      city_id: formData.city || null,
      district_id: formData.district || null,
      address: formData.address || null,
      features: formData.features.length > 0 ? formData.features : null,
      status: 'pending', // New listings start as pending
      views: 0,
      inquiries: 0,
      is_promoted: false
    };
  }

  /**
   * Transform database listing to frontend Property interface
   */
  private async transformListingToProperty(
    listing: Listing, 
    media: PropertyMedia[], 
    userProfile: any
  ): Promise<Property> {
    // Get location names
    const province = provinces.find(p => p.id === listing.province_id)?.name || '';
    const city = cities.find(c => c.id === listing.city_id)?.name || '';
    const district = districts.find(d => d.id === listing.district_id)?.name || '';
    
    // Get images
    const images = media.map(m => m.media_url);
    
    // Create agent object
    const agent = {
      id: userProfile?.id || listing.user_id,
      name: userProfile?.full_name || 'Unknown Agent',
      phone: userProfile?.phone || '',
      email: userProfile?.email || '',
      avatar: userProfile?.avatar_url || undefined,
      company: userProfile?.company || undefined
    };
    
    // Map property type
    const propertyType = listing.property_type as PropertyType;
    
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      priceUnit: listing.price_unit,
      type: propertyType,
      purpose: listing.purpose,
      bedrooms: listing.bedrooms || undefined,
      bathrooms: listing.bathrooms || undefined,
      buildingSize: listing.building_size || undefined,
      landSize: listing.land_size || undefined,
      location: {
        province,
        city,
        district,
        address: listing.address || '',
        postalCode: listing.postal_code || undefined
      },
      images: images.length > 0 ? images : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
      features: listing.features || [],
      agent,
      createdAt: listing.created_at,
      isPromoted: listing.is_promoted,
      status: listing.status as ListingStatus,
      views: listing.views,
      inquiries: listing.inquiries
    };
  }

  /**
   * Transform multiple database listings to frontend Property interface
   */
  private async transformListingsToProperties(listings: any[]): Promise<Property[]> {
    return Promise.all(listings.map(async (listing) => {
      // Get user profile
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', listing.user_id)
        .single();
      
      // Get media
      const media = listing.property_media || [];
      
      return this.transformListingToProperty(listing, media, userProfile);
    }));
  }
}

export const listingService = new ListingService();