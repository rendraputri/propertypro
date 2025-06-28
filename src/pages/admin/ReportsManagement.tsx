import React, { useState, useEffect } from 'react';
import { Eye, AlertTriangle, Clock, CheckCircle, XCircle, Filter, MoreHorizontal, MessageSquare, User, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import DataTable, { Column } from '../../components/admin/DataTable';
import { Report, ModerationStats } from '../../types/admin';
import { mockReports } from '../../data/reports';
import { formatPrice } from '../../utils/formatter';

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const [stats, setStats] = useState<ModerationStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
    actionsToday: 0,
    averageResolutionTime: 0,
    reportsByType: {},
    reportsByPriority: {},
  });

  useEffect(() => {
    setReports(mockReports);
    
    // Calculate stats
    const totalReports = mockReports.length;
    const pendingReports = mockReports.filter(r => r.status === 'pending').length;
    const resolvedReports = mockReports.filter(r => r.status === 'resolved').length;
    const dismissedReports = mockReports.filter(r => r.status === 'dismissed').length;
    
    const reportsByType = mockReports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    const reportsByPriority = mockReports.reduce((acc, report) => {
      acc[report.priority] = (acc[report.priority] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    setStats({
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
      actionsToday: 3,
      averageResolutionTime: 24,
      reportsByType,
      reportsByPriority,
    });
  }, []);

  const handleTakeAction = (report: Report) => {
    setSelectedReport(report);
    setShowActionModal(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const getStatusBadge = (status: Report['status']) => {
    const statusConfig = {
      pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { label: 'Sedang Ditinjau', className: 'bg-blue-100 text-blue-800', icon: Eye },
      resolved: { label: 'Diselesaikan', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      dismissed: { label: 'Ditolak', className: 'bg-gray-100 text-gray-800', icon: XCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        <Icon size={12} className="mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Report['priority']) => {
    const priorityConfig = {
      low: { label: 'Rendah', className: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Sedang', className: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'Tinggi', className: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Mendesak', className: 'bg-red-100 text-red-800' },
    };
    
    const config = priorityConfig[priority];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type: Report['type']) => {
    const typeMap = {
      spam: 'Spam',
      inappropriate_content: 'Konten Tidak Pantas',
      fake_listing: 'Iklan Palsu',
      wrong_category: 'Kategori Salah',
      duplicate: 'Duplikat',
      other: 'Lainnya',
    };
    return typeMap[type] || type;
  };

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    if (filterType !== 'all' && report.type !== filterType) return false;
    if (filterPriority !== 'all' && report.priority !== filterPriority) return false;
    return true;
  });

  const columns: Column<Report>[] = [
    {
      key: 'id',
      title: 'ID Laporan',
      sortable: true,
      width: '100px',
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'property.title',
      title: 'Properti',
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center">
          <div className="w-12 h-10 bg-neutral-200 rounded overflow-hidden mr-3 flex-shrink-0">
            {record.property.images[0] && (
              <img 
                src={record.property.images[0]} 
                alt={record.property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-neutral-900 truncate">{value}</div>
            <div className="text-sm text-neutral-500">
              {formatPrice(record.property.price, record.property.priceUnit)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Jenis Laporan',
      sortable: true,
      render: (value) => getTypeLabel(value),
    },
    {
      key: 'reporterName',
      title: 'Pelapor',
      sortable: true,
      render: (value, record) => (
        <div>
          <div className="font-medium text-neutral-900">{value}</div>
          <div className="text-sm text-neutral-500">{record.reporterEmail}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Prioritas',
      sortable: true,
      render: (value) => getPriorityBadge(value),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'createdAt',
      title: 'Tanggal Laporan',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('id-ID'),
    },
  ];

  const renderActions = (report: Report) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewReport(report);
        }}
        className="p-1 text-neutral-500 hover:text-primary"
        title="Lihat Detail"
      >
        <Eye size={16} />
      </button>
      {(report.status === 'pending' || report.status === 'under_review') && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTakeAction(report);
          }}
          className="p-1 text-neutral-500 hover:text-blue-600"
          title="Ambil Tindakan"
        >
          <AlertTriangle size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>Manajemen Laporan | Admin Properti Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Manajemen Laporan</h1>
            <p className="text-neutral-600">Kelola laporan dan moderasi konten platform</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.totalReports}</div>
              <div className="text-sm text-neutral-600">Total Laporan</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingReports}</div>
              <div className="text-sm text-neutral-600">Menunggu Review</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
              <div className="text-sm text-neutral-600">Diselesaikan</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.actionsToday}</div>
              <div className="text-sm text-neutral-600">Tindakan Hari Ini</div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-neutral-600" />
          <h3 className="font-medium text-neutral-900">Filter Laporan</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="under_review">Sedang Ditinjau</option>
              <option value="resolved">Diselesaikan</option>
              <option value="dismissed">Ditolak</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Jenis Laporan
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Semua Jenis</option>
              <option value="spam">Spam</option>
              <option value="inappropriate_content">Konten Tidak Pantas</option>
              <option value="fake_listing">Iklan Palsu</option>
              <option value="wrong_category">Kategori Salah</option>
              <option value="duplicate">Duplikat</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Prioritas
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Semua Prioritas</option>
              <option value="urgent">Mendesak</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
                setFilterPriority('all');
              }}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      <DataTable
        data={filteredReports}
        columns={columns}
        actions={renderActions}
        searchable
        pagination
        pageSize={10}
        onRowClick={(report) => handleViewReport(report)}
      />

      {/* Report Detail Modal */}
      {showReportModal && selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setShowReportModal(false)}
          onTakeAction={() => {
            setShowReportModal(false);
            setShowActionModal(true);
          }}
        />
      )}

      {/* Action Modal */}
      {showActionModal && selectedReport && (
        <ModerationActionModal
          report={selectedReport}
          onClose={() => setShowActionModal(false)}
          onActionTaken={(updatedReport) => {
            setReports(prev => 
              prev.map(r => r.id === updatedReport.id ? updatedReport : r)
            );
            setShowActionModal(false);
          }}
        />
      )}
    </div>
  );
};

// Report Detail Modal Component
interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
  onTakeAction: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ 
  report, 
  onClose, 
  onTakeAction 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Detail Laporan #{report.id}</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Laporan</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Status:</span>
                  {report.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      <Clock size={12} className="mr-1" />
                      Menunggu
                    </span>
                  )}
                  {report.status === 'under_review' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      <Eye size={12} className="mr-1" />
                      Sedang Ditinjau
                    </span>
                  )}
                  {report.status === 'resolved' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" />
                      Diselesaikan
                    </span>
                  )}
                  {report.status === 'dismissed' && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      <XCircle size={12} className="mr-1" />
                      Ditolak
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Prioritas:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.priority === 'urgent' ? 'Mendesak' :
                     report.priority === 'high' ? 'Tinggi' :
                     report.priority === 'medium' ? 'Sedang' : 'Rendah'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Jenis:</span>
                  <span className="font-medium">
                    {report.type === 'spam' ? 'Spam' :
                     report.type === 'inappropriate_content' ? 'Konten Tidak Pantas' :
                     report.type === 'fake_listing' ? 'Iklan Palsu' :
                     report.type === 'wrong_category' ? 'Kategori Salah' :
                     report.type === 'duplicate' ? 'Duplikat' : 'Lainnya'}
                  </span>
                </div>
                
                <div className="flex items-start justify-between">
                  <span className="text-sm text-neutral-500">Pelapor:</span>
                  <div className="text-right">
                    <div className="font-medium">{report.reporterName}</div>
                    <div className="text-sm text-neutral-500">{report.reporterEmail}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Tanggal:</span>
                  <span className="font-medium">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Alasan Laporan:</h4>
                <p className="text-neutral-700 bg-neutral-50 p-3 rounded">{report.reason}</p>
              </div>
              
              {report.description && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Deskripsi Detail:</h4>
                  <p className="text-neutral-700 bg-neutral-50 p-3 rounded">{report.description}</p>
                </div>
              )}
              
              {report.resolution && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Resolusi:</h4>
                  <p className="text-neutral-700 bg-green-50 p-3 rounded border border-green-200">{report.resolution}</p>
                </div>
              )}
            </div>
            
            {/* Property Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Properti yang Dilaporkan</h3>
              
              <div className="border rounded-lg p-4">
                <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={report.property.images[0]} 
                    alt={report.property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="font-semibold text-lg mb-2">{report.property.title}</h4>
                <p className="text-primary font-bold text-xl mb-2">
                  {formatPrice(report.property.price, report.property.priceUnit)}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tipe:</span>
                    <span className="font-medium">{report.property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Tujuan:</span>
                    <span className="font-medium">{report.property.purpose === 'jual' ? 'Dijual' : 'Disewa'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Lokasi:</span>
                    <span className="font-medium">{report.property.location.city}, {report.property.location.province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Status:</span>
                    <span className={`font-medium ${
                      report.property.status === 'active' ? 'text-green-600' :
                      report.property.status === 'suspended' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {report.property.status === 'active' ? 'Aktif' :
                       report.property.status === 'suspended' ? 'Disuspend' : 'Dihapus'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Agen:</h5>
                  <div className="text-sm">
                    <div className="font-medium">{report.property.agent.name}</div>
                    <div className="text-neutral-500">{report.property.agent.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {(report.status === 'pending' || report.status === 'under_review') && (
            <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
              >
                Tutup
              </button>
              <button
                onClick={onTakeAction}
                className="btn-primary"
              >
                Ambil Tindakan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Moderation Action Modal Component
interface ModerationActionModalProps {
  report: Report;
  onClose: () => void;
  onActionTaken: (updatedReport: Report) => void;
}

const ModerationActionModal: React.FC<ModerationActionModalProps> = ({ 
  report, 
  onClose, 
  onActionTaken 
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionOptions = [
    { value: 'approve', label: 'Setujui Properti', description: 'Properti valid, tolak laporan' },
    { value: 'remove', label: 'Hapus Properti', description: 'Hapus properti dari platform' },
    { value: 'suspend', label: 'Suspend Properti', description: 'Suspend properti sementara' },
    { value: 'warn_user', label: 'Peringatkan Agen', description: 'Kirim peringatan ke agen' },
    { value: 'edit_content', label: 'Edit Konten', description: 'Perbaiki konten properti' },
    { value: 'change_category', label: 'Ubah Kategori', description: 'Perbaiki kategori properti' },
    { value: 'dismiss_report', label: 'Tolak Laporan', description: 'Laporan tidak valid' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update report status based on action
      let newStatus: Report['status'] = 'resolved';
      let resolution = '';

      if (selectedAction === 'dismiss_report') {
        newStatus = 'dismissed';
        resolution = `Laporan ditolak: ${reason}`;
      } else {
        resolution = `Tindakan diambil: ${actionOptions.find(a => a.value === selectedAction)?.label}. ${reason}`;
      }

      const updatedReport: Report = {
        ...report,
        status: newStatus,
        resolution,
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'current-admin-id',
        updatedAt: new Date().toISOString(),
      };

      onActionTaken(updatedReport);
    } catch (error) {
      console.error('Error taking action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ambil Tindakan Moderasi</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Laporan: {report.reason}</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Properti: {report.property.title}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pilih Tindakan
            </label>
            <div className="space-y-2">
              {actionOptions.map(option => (
                <label key={option.value} className="flex items-start">
                  <input
                    type="radio"
                    name="action"
                    value={option.value}
                    checked={selectedAction === option.value}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="mt-1 h-4 w-4 text-primary border-neutral-300 focus:ring-primary"
                    required
                  />
                  <div className="ml-3">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-neutral-500">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Alasan Tindakan
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan alasan tindakan"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Detail Tambahan (Opsional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tambahkan detail atau catatan tambahan"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Ambil Tindakan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportsManagement;