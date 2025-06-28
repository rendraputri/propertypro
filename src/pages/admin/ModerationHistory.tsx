import React, { useState, useEffect } from 'react';
import { Eye, Calendar, User, Filter, Download, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DataTable, { Column } from '../../components/admin/DataTable';
import { ModerationAction } from '../../types/admin';
import { mockModerationActions } from '../../data/reports';

const ModerationHistory: React.FC = () => {
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<ModerationAction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterAdmin, setFilterAdmin] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');

  useEffect(() => {
    setActions(mockModerationActions);
  }, []);

  const handleViewDetail = (action: ModerationAction) => {
    setSelectedAction(action);
    setShowDetailModal(true);
  };

  const getActionBadge = (action: ModerationAction['action']) => {
    const actionConfig = {
      approve: { label: 'Setujui', className: 'bg-green-100 text-green-800' },
      remove: { label: 'Hapus', className: 'bg-red-100 text-red-800' },
      suspend: { label: 'Suspend', className: 'bg-yellow-100 text-yellow-800' },
      warn_user: { label: 'Peringatkan', className: 'bg-orange-100 text-orange-800' },
      edit_content: { label: 'Edit Konten', className: 'bg-blue-100 text-blue-800' },
      change_category: { label: 'Ubah Kategori', className: 'bg-purple-100 text-purple-800' },
      dismiss_report: { label: 'Tolak Laporan', className: 'bg-gray-100 text-gray-800' },
    };
    
    const config = actionConfig[action] || actionConfig.approve;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = ['Tanggal', 'Admin', 'Tindakan', 'Properti', 'Alasan', 'Detail'];
    const csvData = actions.map(action => [
      new Date(action.createdAt).toLocaleDateString('id-ID'),
      action.adminName,
      action.action,
      action.property.title,
      action.reason,
      action.details || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `moderation_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter actions based on selected filters
  const filteredActions = actions.filter(action => {
    if (filterAction !== 'all' && action.action !== filterAction) return false;
    if (filterAdmin !== 'all' && action.adminId !== filterAdmin) return false;
    
    if (filterDateRange !== 'all') {
      const actionDate = new Date(action.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - actionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterDateRange === 'today' && daysDiff > 0) return false;
      if (filterDateRange === 'week' && daysDiff > 7) return false;
      if (filterDateRange === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  // Get unique admins for filter
  const uniqueAdmins = Array.from(new Set(actions.map(action => action.adminId)))
    .map(adminId => {
      const action = actions.find(a => a.adminId === adminId);
      return { id: adminId, name: action?.adminName || adminId };
    });

  const columns: Column<ModerationAction>[] = [
    {
      key: 'createdAt',
      title: 'Tanggal & Waktu',
      sortable: true,
      render: (value) => (
        <div>
          <div className="font-medium">
            {new Date(value).toLocaleDateString('id-ID')}
          </div>
          <div className="text-sm text-neutral-500">
            {new Date(value).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'adminName',
      title: 'Admin',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-neutral-900">{value}</div>
            <div className="text-sm text-neutral-500">{record.adminId}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Tindakan',
      sortable: true,
      render: (value) => getActionBadge(value),
    },
    {
      key: 'property.title',
      title: 'Properti',
      render: (value, record) => (
        <div>
          <div className="font-medium text-neutral-900 truncate max-w-xs">{value}</div>
          <div className="text-sm text-neutral-500">
            Agen: {record.property.agent.name}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      title: 'Alasan',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: 'reportId',
      title: 'ID Laporan',
      render: (value) => (
        value ? (
          <span className="font-mono text-sm">{value}</span>
        ) : (
          <span className="text-neutral-400 text-sm">-</span>
        )
      ),
    },
  ];

  const renderActions = (action: ModerationAction) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetail(action);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="Lihat Detail"
      >
        <Eye size={16} />
      </button>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Riwayat Moderasi | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Riwayat Moderasi</h1>
            <p className="text-neutral-600">Lihat semua tindakan moderasi yang telah dilakukan</p>
          </div>
          <button
            onClick={exportToCSV}
            className="btn-primary flex items-center"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-neutral-900">
            {actions.length}
          </div>
          <div className="text-sm text-neutral-600">Total Tindakan</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">
            {actions.filter(a => {
              const actionDate = new Date(a.createdAt);
              const today = new Date();
              return actionDate.toDateString() === today.toDateString();
            }).length}
          </div>
          <div className="text-sm text-neutral-600">Tindakan Hari Ini</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {actions.filter(a => a.action === 'approve').length}
          </div>
          <div className="text-sm text-neutral-600">Properti Disetujui</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-red-600">
            {actions.filter(a => a.action === 'remove').length}
          </div>
          <div className="text-sm text-neutral-600">Properti Dihapus</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-neutral-600" />
          <h3 className="font-medium text-neutral-900">Filter Riwayat</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tindakan
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">Semua Tindakan</option>
              <option value="approve">Setujui</option>
              <option value="remove">Hapus</option>
              <option value="suspend">Suspend</option>
              <option value="warn_user">Peringatkan</option>
              <option value="edit_content">Edit Konten</option>
              <option value="change_category">Ubah Kategori</option>
              <option value="dismiss_report">Tolak Laporan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Admin
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
            >
              <option value="all">Semua Admin</option>
              {uniqueAdmins.map(admin => (
                <option key={admin.id} value={admin.id}>{admin.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Periode
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">30 Hari Terakhir</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterAction('all');
                setFilterAdmin('all');
                setFilterDateRange('all');
              }}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredActions}
        columns={columns}
        actions={renderActions}
        searchable
        pagination
        pageSize={15}
        onRowClick={(action) => handleViewDetail(action)}
      />

      {/* Action Detail Modal */}
      {showDetailModal && selectedAction && (
        <ActionDetailModal
          action={selectedAction}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

// Action Detail Modal Component
interface ActionDetailModalProps {
  action: ModerationAction;
  onClose: () => void;
}

const ActionDetailModal: React.FC<ActionDetailModalProps> = ({ 
  action, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Detail Tindakan Moderasi</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Informasi Tindakan</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">ID Tindakan:</span>
                  <span className="font-mono text-sm">{action.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tanggal & Waktu:</span>
                  <span className="font-medium">
                    {new Date(action.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Admin:</span>
                  <span className="font-medium">{action.adminName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tindakan:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    action.action === 'approve' ? 'bg-green-100 text-green-800' :
                    action.action === 'remove' ? 'bg-red-100 text-red-800' :
                    action.action === 'suspend' ? 'bg-yellow-100 text-yellow-800' :
                    action.action === 'warn_user' ? 'bg-orange-100 text-orange-800' :
                    action.action === 'edit_content' ? 'bg-blue-100 text-blue-800' :
                    action.action === 'change_category' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {action.action === 'approve' ? 'Setujui' :
                     action.action === 'remove' ? 'Hapus' :
                     action.action === 'suspend' ? 'Suspend' :
                     action.action === 'warn_user' ? 'Peringatkan' :
                     action.action === 'edit_content' ? 'Edit Konten' :
                     action.action === 'change_category' ? 'Ubah Kategori' :
                     'Tolak Laporan'}
                  </span>
                </div>
                
                {action.reportId && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ID Laporan:</span>
                    <span className="font-mono text-sm">{action.reportId}</span>
                  </div>
                )}
                
                {action.previousStatus && action.newStatus && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Perubahan Status:</span>
                    <span className="font-medium">
                      {action.previousStatus} → {action.newStatus}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Informasi Properti</h3>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{action.property.title}</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">ID Properti:</span>
                    <span className="font-mono">{action.propertyId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Agen:</span>
                    <span className="font-medium">{action.property.agent.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email Agen:</span>
                    <span className="text-sm">{action.property.agent.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Alasan Tindakan</h3>
            <p className="text-neutral-700 bg-neutral-50 p-3 rounded">{action.reason}</p>
          </div>
          
          {action.details && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Detail Tambahan</h3>
              <p className="text-neutral-700 bg-neutral-50 p-3 rounded">{action.details}</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationHistory;