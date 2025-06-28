import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  formatValue?: (value: string | number) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'bg-blue-500',
  formatValue = (val) => val.toString(),
}) => {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus size={16} />;
    return change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };
  
  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-neutral-500';
    return change > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-2">
            {formatValue(value)}
          </p>
          
          {change !== undefined && (
            <div className={`flex items-center text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="ml-1">
                {Math.abs(change)}%
                {changeLabel && <span className="text-neutral-500 ml-1">{changeLabel}</span>}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;