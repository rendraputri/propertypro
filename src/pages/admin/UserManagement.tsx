import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, UserPlus, MoreHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DataTable, { Column } from '../../components/admin/DataTable';
import { User } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { useToast } from '../../contexts/ToastContext';

const UserManagement: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      
      if (filterRole !== 'all') {
        filters.role = filterRole;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const { data } = await userService.getAllUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Error', 'Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Are you sure you want to delete user ${user.full_name}?`)) {
      try {
        const success = await userService.deleteUser(user.id);
        
        if (success) {
          showSuccess('User Deleted', `User ${user.full_name} has been deleted successfully.`);
          fetchUsers(); // Refresh the user list
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        showError('Error', 'Failed to delete user. Please try again.');
      }
    }
  };

  const handleChangeUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const success = await userService.changeUserStatus(userId, status);
      
      if (success) {
        showSuccess('Status Updated', `User status has been updated to ${status}.`);
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error changing user status:', error);
      showError('Error', 'Failed to update user status. Please try again.');
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap = {
      user: 'Pengguna',
      agent: 'Agen',
      admin: 'Admin',
      superadmin: 'Super Admin',
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Aktif', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Tidak Aktif', className: 'bg-gray-100 text-gray-800' },
      suspended: { label: 'Ditangguhkan', className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const columns: Column<User>[] = [
    {
      key: 'full_name',
      title: 'Nama',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-primary">
              {record.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Peran',
      sortable: true,
      render: (value) => getRoleLabel(value),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'phone',
      title: 'Telepon',
      render: (value) => value || '-',
    },
    {
      key: 'created_at',
      title: 'Terdaftar',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('id-ID'),
    },
  ];

  const renderActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('View user:', user.id);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="Lihat Detail"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditUser(user);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteUser(user);
        }}
        className="p-1 text-neutral-500 hover:text-red-600"
        title="Hapus"
        disabled={user.role === 'superadmin'}
      >
        <Trash2 size={16} className={user.role === 'superadmin' ? 'opacity-50 cursor-not-allowed' : ''} />
      </button>
      <div className="relative group">
        <button
          className="p-1 text-neutral-500 hover:text-neutral-700"
          title="More Actions"
        >
          <MoreHorizontal size={16} />
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10 hidden group-hover:block">
          <button
            onClick={() => handleChangeUserStatus(user.id, 'active')}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            disabled={user.status === 'active'}
          >
            Activate
          </button>
          <button
            onClick={() => handleChangeUserStatus(user.id, 'inactive')}
            className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            disabled={user.status === 'inactive'}
          >
            Deactivate
          </button>
          <button
            onClick={() => handleChangeUserStatus(user.id, 'suspended')}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            disabled={user.status === 'suspended'}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Manajemen Pengguna | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Manajemen Pengguna</h1>
            <p className="text-neutral-600">Kelola pengguna, agen, dan admin platform</p>
          </div>
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowUserModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <UserPlus size={18} className="mr-2" />
            Tambah Pengguna
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                fetchUsers();
              }}
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Ditangguhkan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Peran
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                fetchUsers();
              }}
            >
              <option value="all">Semua Peran</option>
              <option value="user">Pengguna</option>
              <option value="agent">Agen</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Pencarian
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchUsers();
                }
              }}
            />
          </div>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        actions={renderActions}
        searchable={false} // We're handling search manually
        filterable={false} // We're handling filters manually
        pagination
        pageSize={10}
        loading={isLoading}
        onRowClick={(user) => console.log('Row clicked:', user)}
      />

      {/* User Modal - Placeholder */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
            </h2>
            <p className="text-neutral-600 mb-4">
              Form untuk {selectedUser ? 'mengedit' : 'menambah'} pengguna akan ditampilkan di sini.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
              >
                Batal
              </button>
              <button className="btn-primary">
                {selectedUser ? 'Simpan' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;