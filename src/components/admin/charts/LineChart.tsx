import React from 'react';

interface LineChartProps {
  data: { date: string; value: number; label?: string }[];
  title?: string;
  height?: number;
  color?: string;
  showDots?: boolean;
  formatValue?: (value: number) => string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  height = 300,
  color = '#F7941D',
  showDots = true,
  formatValue = (value) => value.toLocaleString(),
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  
  const chartHeight = height - 60; // Leave space for labels
  const chartWidth = 100; // Percentage
  
  const getY = (value: number) => {
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };
  
  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };
  
  // Create SVG path
  const pathData = data.map((item, index) => {
    const x = getX(index);
    const y = getY(item.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height }}>
        <svg
          width="100%"
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Area under the line */}
          <path
            d={`${pathData} L ${getX(data.length - 1)} ${chartHeight} L 0 ${chartHeight} Z`}
            fill={color}
            fillOpacity="0.1"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Dots */}
          {showDots && data.map((item, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(item.value)}
              r="3"
              fill={color}
              className="hover:r-4 transition-all duration-200"
            >
              <title>{`${item.date}: ${formatValue(item.value)}`}</title>
            </circle>
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-neutral-500">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;