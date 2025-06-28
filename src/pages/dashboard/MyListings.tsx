import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  Eye, 
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { formatPrice } from '../../utils/formatter';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserListing } from '../../types/listing';
import { listingService } from '../../services/listingService';

const MyListings: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<UserListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter, typeFilter, sortBy]);

  const fetchUserListings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userListings = await listingService.getUserListings(user.id);
      setListings(userListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      showError('Error', 'Failed to load your listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const success = await listingService.deleteListing(listingId, user.id);
      
      if (success) {
        setListings(prev => prev.filter(listing => listing.id !== listingId));
        showSuccess('Listing Deleted', 'Your property listing has been deleted successfully.');
      } else {
        throw new Error('Failed to delete listing');
      }
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      showError('Error', error.message || 'Failed to delete listing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPremium = (listingId: string) => {
    // Navigate to premium upgrade page
    window.location.href = `/premium/upgrade?propertyId=${listingId}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Aktif', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { label: 'Tidak Aktif', className: 'bg-gray-100 text-gray-800', icon: XCircle },
      expired: { label: 'Kedaluwarsa', className: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { label: 'Menunggu Review', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const confirmDeleteProperty = (listingId: string) => {
    setPropertyToDelete(listingId);
    setShowDeleteModal(true);
  };

  const deleteProperty = async () => {
    if (!propertyToDelete) return;
    
    try {
      await handleDeleteListing(propertyToDelete);
    } finally {
      setShowDeleteModal(false);
      setPropertyToDelete(null);
    }
  };

  if (isLoading && listings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Iklan Saya | Dashboard Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Iklan Saya</h1>
            <p className="text-neutral-600">Kelola semua iklan properti Anda</p>
          </div>
          <Link
            to="/dashboard/listings/new"
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Tambah Iklan
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Cari iklan..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
          >
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-neutral-200">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="expired">Kedaluwarsa</option>
                <option value="pending">Menunggu Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Jenis Properti</label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Semua Jenis</option>
                <option value="rumah">Rumah</option>
                <option value="apartemen">Apartemen</option>
                <option value="kondominium">Kondominium</option>
                <option value="ruko">Ruko</option>
                <option value="gedung_komersial">Gedung Komersial</option>
                <option value="ruang_industri">Ruang Industri</option>
                <option value="tanah">Tanah</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Urutkan</label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="title">Judul A-Z</option>
                <option value="views">Paling Banyak Dilihat</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.isPremium && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                      <Crown size={12} className="mr-1" />
                      Premium
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(listing.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                
                <div className="text-primary font-bold text-xl mb-2">
                  {formatPrice(listing.price, listing.priceUnit)}
                  {listing.purpose === 'sewa' && <span className="text-sm font-normal text-neutral-500">/bulan</span>}
                </div>

                <div className="text-sm text-neutral-600 mb-3">
                  {listing.location.city}, {listing.location.province}
                </div>

                <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {listing.views} kunjungan
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {new Date(listing.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>

                {/* Premium Expiry */}
                {listing.isPremium && listing.premiumExpiresAt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4">
                    <p className="text-xs text-yellow-700">
                      Premium berakhir: {new Date(listing.premiumExpiresAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/dashboard/listings/edit/${listing.id}`}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => confirmDeleteProperty(listing.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {!listing.isPremium && listing.status === 'active' && (
                    <button
                      onClick={() => handleUpgradeToPremium(listing.id)}
                      className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      Upgrade Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Tidak ada iklan yang sesuai filter'
              : 'Belum ada iklan'
            }
          </h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Coba ubah filter pencarian Anda'
              : 'Mulai dengan menambahkan iklan properti pertama Anda'
            }
          </p>
          <Link to="/dashboard/listings/new" className="btn-primary">
            Tambah Iklan Pertama
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Confirm Deletion</h3>
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
    </div>
  );
};

export default MyListings;