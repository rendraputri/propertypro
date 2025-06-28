import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    status: string;
    type: string;
    purpose: string;
    agent: string;
    dateRange: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter size={18} className="mr-2 text-neutral-600" />
        <h3 className="font-medium text-neutral-900">Filter Properti</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Review</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="published">Dipublikasi</option>
            <option value="unpublished">Tidak Dipublikasi</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Tipe Properti
          </label>
          <select
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="all">Semua Tipe</option>
            <option value="rumah">Rumah</option>
            <option value="apartemen">Apartemen</option>
            <option value="kondominium">Kondominium</option>
            <option value="ruko">Ruko</option>
            <option value="gedung-komersial">Gedung Komersial</option>
            <option value="ruang-industri">Ruang Industri</option>
            <option value="tanah">Tanah</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Tujuan
          </label>
          <select
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.purpose}
            onChange={(e) => onFilterChange('purpose', e.target.value)}
          >
            <option value="all">Semua Tujuan</option>
            <option value="jual">Dijual</option>
            <option value="sewa">Disewa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Agen
          </label>
          <select
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.agent}
            onChange={(e) => onFilterChange('agent', e.target.value)}
          >
            <option value="all">Semua Agen</option>
            <option value="budi-santoso">Budi Santoso</option>
            <option value="sinta-dewi">Sinta Dewi</option>
            <option value="anton-wijaya">Anton Wijaya</option>
            <option value="diana-putri">Diana Putri</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Periode
          </label>
          <select
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
          >
            <option value="all">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
            <option value="quarter">3 Bulan Terakhir</option>
            <option value="year">1 Tahun Terakhir</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center justify-center"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;