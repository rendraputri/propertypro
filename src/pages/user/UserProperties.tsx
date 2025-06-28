import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Edit, 
  Trash2, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Home,
  MapPin
} from 'lucide-react';
import { formatPrice } from '../../utils/formatter';
import { useToast } from '../../contexts/ToastContext';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit: 'juta' | 'miliar';
  type: string;
  purpose: 'jual' | 'sewa';
  location: {
    city: string;
    province: string;
  };
  images: string[];
  status: 'active' | 'pending' | 'rejected' | 'expired';
  views: number;
  inquiries: number;
  createdAt: string;
}

const UserProperties: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and view options
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    getPropertyList();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [properties, searchTerm, statusFilter, typeFilter, sortBy]);
  
  const getPropertyList = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Modern Apartment in Jakarta',
          description: 'Beautiful apartment with city view',
          price: 800,
          priceUnit: 'juta',
          type: 'apartemen',
          purpose: 'jual',
          location: {
            city: 'Jakarta',
            province: 'DKI Jakarta'
          },
          images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'],
          status: 'active',
          views: 423,
          inquiries: 12,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() // 5 days ago
        },
        {
          id: '2',
          title: 'Family House in Bandung',
          description: 'Spacious family house with garden',
          price: 2.5,
          priceUnit: 'miliar',
          type: 'rumah',
          purpose: 'jual',
          location: {
            city: 'Bandung',
            province: 'Jawa Barat'
          },
          images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
          status: 'active',
          views: 287,
          inquiries: 8,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
        },
        {
          id: '3',
          title: 'Luxury Villa in Bali',
          description: 'Luxury villa with private pool',
          price: 5,
          priceUnit: 'miliar',
          type: 'villa',
          purpose: 'jual',
          location: {
            city: 'Denpasar',
            province: 'Bali'
          },
          images: ['https://images.pexels.com/photos/32870/pexels-photo.jpg'],
          status: 'pending',
          views: 156,
          inquiries: 4,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
        },
        {
          id: '4',
          title: 'Office Space in Jakarta',
          description: 'Modern office space in business district',
          price: 15,
          priceUnit: 'juta',
          type: 'kantor',
          purpose: 'sewa',
          location: {
            city: 'Jakarta',
            province: 'DKI Jakarta'
          },
          images: ['https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg'],
          status: 'expired',
          views: 89,
          inquiries: 2,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString() // 30 days ago
        }
      ];
      
      setProperties(mockProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...properties];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price_high':
          const priceA = a.priceUnit === 'miliar' ? a.price * 1000 : a.price;
          const priceB = b.priceUnit === 'miliar' ? b.price * 1000 : b.price;
          return priceB - priceA;
        case 'price_low':
          const priceALow = a.priceUnit === 'miliar' ? a.price * 1000 : a.price;
          const priceBLow = b.priceUnit === 'miliar' ? b.price * 1000 : b.price;
          return priceALow - priceBLow;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });
    
    setFilteredProperties(filtered);
  };
  
  const editProperty = (id: string) => {
    // Navigate to the edit property page
    navigate(`/dashboard/listings/edit/${id}`);
  };
  
  const confirmDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setShowDeleteModal(true);
  };
  
  const deleteProperty = async () => {
    if (!propertyToDelete) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the property from the list
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete));
      
      showSuccess('Property deleted successfully', 'The property has been removed from your listings.');
    } catch (err) {
      console.error('Error deleting property:', err);
      showError('Failed to delete property', 'Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle size={12} className="mr-1" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };
  
  if (isLoading && properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>My Properties | User Area</title>
        <meta name="description" content="Manage your property listings" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Properties</h1>
            <p className="text-neutral-600">
              Manage your property listings
            </p>
          </div>
          
          <Link to="/user/properties/add" className="btn-primary flex items-center justify-center">
            <Plus size={18} className="mr-2" />
            Add New Property
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="w-full sm:w-auto flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search properties"
              />
            </div>
            
            <div className="w-full sm:w-auto flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center"
                aria-expanded={showFilters}
                aria-controls="filter-options"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
              
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-neutral-700'}`}
                  title="Grid View"
                  aria-label="Switch to grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-neutral-700'}`}
                  title="List View"
                  aria-label="Switch to list view"
                  aria-pressed={viewMode === 'list'}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div id="filter-options" className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-neutral-700 mb-1">
                  Property Type
                </label>
                <select
                  id="type-filter"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="rumah">House</option>
                  <option value="apartemen">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="kantor">Office</option>
                  <option value="tanah">Land</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-neutral-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-by"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Property List */}
        {filteredProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                    
                    <div className="text-primary font-bold text-xl mb-2">
                      {formatPrice(property.price, property.priceUnit)}
                      {property.purpose === 'sewa' && <span className="text-sm font-normal text-neutral-500">/month</span>}
                    </div>
                    
                    <div className="flex items-center text-sm text-neutral-600 mb-3">
                      <MapPin size={14} className="mr-1" />
                      {property.location.city}, {property.location.province}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {property.views} views
                      </div>
                      <div>
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => editProperty(property.id)}
                          className="p-2 text-neutral-600 hover:text-primary hover:bg-neutral-100 rounded"
                          title="Edit Property"
                          aria-label="Edit property"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteProperty(property.id)}
                          className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Property"
                          aria-label="Delete property"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <Link
                        to={`/properti/${property.id}`}
                        className="text-primary hover:underline text-sm flex items-center"
                        aria-label={`View details of ${property.title}`}
                      >
                        View Details
                        <Eye size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-50 border-b">
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Property</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Views</th>
                      <th className="text-left py-3 px-4 font-medium text-neutral-700">Date Added</th>
                      <th className="text-right py-3 px-4 font-medium text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(property => (
                      <tr key={property.id} className="border-b hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-neutral-900">{property.title}</div>
                              <div className="text-sm text-neutral-500">{property.location.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-primary">
                            {formatPrice(property.price, property.priceUnit)}
                            {property.purpose === 'sewa' && <span className="text-xs font-normal text-neutral-500">/month</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(property.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Eye size={14} className="mr-1 text-neutral-500" />
                            <span>{property.views}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-neutral-500">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/properti/${property.id}`}
                              className="p-1 text-neutral-600 hover:text-primary hover:bg-neutral-100 rounded"
                              title="View Property"
                              aria-label={`View ${property.title}`}
                            >
                              <Eye size={16} />
                            </Link>
                            <button
                              onClick={() => editProperty(property.id)}
                              className="p-1 text-neutral-600 hover:text-primary hover:bg-neutral-100 rounded"
                              title="Edit Property"
                              aria-label={`Edit ${property.title}`}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => confirmDeleteProperty(property.id)}
                              className="p-1 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Property"
                              aria-label={`Delete ${property.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No properties match your filters'
                : 'No properties yet'}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try changing your search criteria or filters'
                : 'Add your first property to get started'}
            </p>
            <Link to="/user/properties/add" className="btn-primary">
              Add Your First Property
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 id="delete-modal-title" className="text-lg font-semibold text-neutral-900 mb-4">Confirm Deletion</h3>
            <p className="text-neutral-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={deleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProperties;