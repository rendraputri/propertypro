import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Eye, EyeOff, Home, Building2, Building, Store, Warehouse, MapPin, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DataTable, { Column } from '../../components/admin/DataTable';
import { Category } from '../../types/admin';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../contexts/ToastContext';

const CategoryManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      
      if (filterStatus === 'active') {
        filters.isActive = true;
      } else if (filterStatus === 'inactive') {
        filters.isActive = false;
      }
      
      const data = await categoryService.getAllCategories(filters);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Error', 'Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (categoryId: string) => {
    try {
      const category = categories.find(c => c.id === categoryId);
      if (!category) return;
      
      const newStatus = !category.isActive;
      const success = await categoryService.toggleCategoryStatus(categoryId, newStatus);
      
      if (success) {
        setCategories(prev => 
          prev.map(category => 
            category.id === categoryId 
              ? { ...category, isActive: newStatus, updatedAt: new Date().toISOString() }
              : category
          )
        );
        
        showSuccess(
          'Status Updated', 
          `Category "${category.name}" is now ${newStatus ? 'active' : 'inactive'}.`
        );
      } else {
        throw new Error('Failed to update category status');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      showError('Error', 'Failed to update category status. Please try again.');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.propertyCount > 0) {
      showError(
        'Cannot Delete Category', 
        `Category "${category.name}" still has ${category.propertyCount} properties.`
      );
      return;
    }
    
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        const success = await categoryService.deleteCategory(category.id);
        
        if (success) {
          setCategories(prev => prev.filter(c => c.id !== category.id));
          showSuccess('Category Deleted', `Category "${category.name}" has been deleted successfully.`);
        } else {
          throw new Error('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        showError('Error', 'Failed to delete category. Please try again.');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Home,
      Building2,
      Building,
      Store,
      Warehouse,
      MapPin,
      Users,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Home;
    return <IconComponent size={20} />;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? (
          <>
            <Eye size={12} className="mr-1" />
            Aktif
          </>
        ) : (
          <>
            <EyeOff size={12} className="mr-1" />
            Tidak Aktif
          </>
        )}
      </span>
    );
  };

  // Filter categories based on selected status
  const filteredCategories = categories.filter(category => {
    if (filterStatus === 'active') return category.isActive;
    if (filterStatus === 'inactive') return !category.isActive;
    return true;
  });

  const columns: Column<Category>[] = [
    {
      key: 'name',
      title: 'Kategori',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 text-primary">
            {getIconComponent(record.icon || 'Home')}
          </div>
          <div>
            <div className="font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{record.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'Deskripsi',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-neutral-700 line-clamp-2">{value}</p>
        </div>
      ),
    },
    {
      key: 'propertyCount',
      title: 'Jumlah Properti',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value.toLocaleString()}</span>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'updatedAt',
      title: 'Terakhir Diperbarui',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('id-ID'),
    },
  ];

  const renderActions = (category: Category) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStatusToggle(category.id);
        }}
        className={`p-1 rounded ${
          category.isActive 
            ? 'text-gray-600 hover:text-gray-800' 
            : 'text-green-600 hover:text-green-800'
        }`}
        title={category.isActive ? 'Nonaktifkan' : 'Aktifkan'}
      >
        {category.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditCategory(category);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCategory(category);
        }}
        className="p-1 text-neutral-500 hover:text-red-600"
        title="Hapus"
        disabled={category.propertyCount > 0}
      >
        <Trash2 size={16} className={category.propertyCount > 0 ? 'opacity-50 cursor-not-allowed' : ''} />
      </button>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Manajemen Kategori | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Manajemen Kategori</h1>
            <p className="text-neutral-600">Kelola kategori properti di platform</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowCategoryModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-neutral-900">
            {categories.length}
          </div>
          <div className="text-sm text-neutral-600">Total Kategori</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </div>
          <div className="text-sm text-neutral-600">Kategori Aktif</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-600">
            {categories.filter(c => !c.isActive).length}
          </div>
          <div className="text-sm text-neutral-600">Tidak Aktif</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, c) => sum + c.propertyCount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-neutral-600">Total Properti</div>
        </div>
      </div>

      <DataTable
        data={filteredCategories}
        columns={columns}
        actions={renderActions}
        searchable
        pagination
        pageSize={10}
        loading={isLoading}
        onRowClick={(category) => handleEditCategory(category)}
      />

      {/* Category Form Modal */}
      {showCategoryModal && (
        <CategoryFormModal
          category={selectedCategory}
          onClose={() => setShowCategoryModal(false)}
          onSave={async (category) => {
            try {
              if (selectedCategory) {
                // Update existing category
                const updatedCategory = await categoryService.updateCategory(category.id, category);
                
                if (updatedCategory) {
                  setCategories(prev => 
                    prev.map(c => c.id === category.id ? updatedCategory : c)
                  );
                  
                  showSuccess('Category Updated', `Category "${category.name}" has been updated successfully.`);
                } else {
                  throw new Error('Failed to update category');
                }
              } else {
                // Create new category
                const newCategory = await categoryService.createCategory(category);
                
                if (newCategory) {
                  setCategories(prev => [...prev, newCategory]);
                  showSuccess('Category Created', `Category "${category.name}" has been created successfully.`);
                } else {
                  throw new Error('Failed to create category');
                }
              }
              
              setShowCategoryModal(false);
            } catch (error) {
              console.error('Error saving category:', error);
              showError('Error', 'Failed to save category. Please try again.');
            }
          }}
        />
      )}
    </div>
  );
};

// Category Form Modal Component
interface CategoryFormModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ 
  category, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    icon: category?.icon || 'Home',
    isActive: category?.isActive ?? true,
  });

  const iconOptions = [
    { value: 'Home', label: 'Rumah', icon: Home },
    { value: 'Building2', label: 'Apartemen', icon: Building2 },
    { value: 'Building', label: 'Gedung', icon: Building },
    { value: 'Store', label: 'Toko', icon: Store },
    { value: 'Warehouse', label: 'Gudang', icon: Warehouse },
    { value: 'MapPin', label: 'Lokasi', icon: MapPin },
    { value: 'Users', label: 'Komunitas', icon: Users },
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCategory: Category = {
      id: category?.id || Date.now().toString(),
      ...formData,
      propertyCount: category?.propertyCount || 0,
      createdAt: category?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave(newCategory);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold">
            {category ? 'Edit Kategori' : 'Tambah Kategori'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nama Kategori
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Ikon
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              >
                {iconOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
              <div className="mt-2 flex items-center text-sm text-neutral-600">
                <span className="mr-2">Preview:</span>
                {React.createElement(iconOptions.find(opt => opt.value === formData.icon)?.icon || Home, { size: 16 })}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi kategori (opsional)"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-neutral-700">
                Kategori aktif
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {category ? 'Simpan Perubahan' : 'Tambah Kategori'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryManagement;