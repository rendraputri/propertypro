import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  height?: number;
  showValues?: boolean;
  formatValue?: (value: number) => string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 300,
  showValues = true,
  formatValue = (value) => value.toLocaleString(),
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const colors = ['#F7941D', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (height - 40);
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={item.label} className="flex flex-col items-center flex-1">
                <div className="relative flex-1 flex items-end">
                  {showValues && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-neutral-600">
                      {formatValue(item.value)}
                    </div>
                  )}
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                    style={{
                      height: barHeight,
                      backgroundColor: color,
                      minHeight: '4px',
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-neutral-600 text-center">
                  <div className="truncate max-w-full">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;