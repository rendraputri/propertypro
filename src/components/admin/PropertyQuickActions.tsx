import React from 'react';
import { CheckCircle, XCircle, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';

interface PropertyQuickActionsProps {
  propertyId: string;
  currentStatus: 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished';
  onStatusChange: (propertyId: string, status: 'pending' | 'approved' | 'rejected' | 'published' | 'unpublished') => void;
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
  compact?: boolean;
}

const PropertyQuickActions: React.FC<PropertyQuickActionsProps> = ({
  propertyId,
  currentStatus,
  onStatusChange,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const actions = [
    {
      key: 'approve',
      label: 'Setujui',
      icon: CheckCircle,
      className: 'text-blue-600 hover:text-blue-800',
      onClick: () => onStatusChange(propertyId, 'approved'),
      show: currentStatus === 'pending',
    },
    {
      key: 'reject',
      label: 'Tolak',
      icon: XCircle,
      className: 'text-red-600 hover:text-red-800',
      onClick: () => onStatusChange(propertyId, 'rejected'),
      show: currentStatus === 'pending' || currentStatus === 'approved',
    },
    {
      key: 'publish',
      label: 'Publikasikan',
      icon: Eye,
      className: 'text-green-600 hover:text-green-800',
      onClick: () => onStatusChange(propertyId, 'published'),
      show: currentStatus === 'approved' || currentStatus === 'unpublished',
    },
    {
      key: 'unpublish',
      label: 'Batalkan Publikasi',
      icon: EyeOff,
      className: 'text-gray-600 hover:text-gray-800',
      onClick: () => onStatusChange(propertyId, 'unpublished'),
      show: currentStatus === 'published',
    },
  ];

  const visibleActions = actions.filter(action => action.show);

  if (compact) {
    return (
      <div className="flex items-center space-x-1">
        {visibleActions.slice(0, 2).map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={`p-1 rounded hover:bg-neutral-100 ${action.className}`}
              title={action.label}
              aria-label={action.label}
            >
              <Icon size={16} />
            </button>
          );
        })}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(propertyId);
            }}
            className="p-1 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-800"
            title="Edit"
            aria-label="Edit property"
          >
            <Edit size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(propertyId);
            }}
            className="p-1 rounded hover:bg-neutral-100 text-red-600 hover:text-red-800"
            title="Hapus"
            aria-label="Delete property"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleActions.map(action => {
        const Icon = action.icon;
        return (
          <button
            key={action.key}
            onClick={() => action.onClick()}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${action.className} hover:bg-opacity-10`}
            aria-label={action.label}
          >
            <Icon size={14} className="mr-1" />
            {action.label}
          </button>
        );
      })}
      
      {onEdit && (
        <button
          onClick={() => onEdit(propertyId)}
          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
          aria-label="Edit property"
        >
          <Edit size={14} className="mr-1" />
          Edit
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={() => onDelete(propertyId)}
          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
          aria-label="Delete property"
        >
          <Trash2 size={14} className="mr-1" />
          Hapus
        </button>
      )}
    </div>
  );
};

export default PropertyQuickActions;