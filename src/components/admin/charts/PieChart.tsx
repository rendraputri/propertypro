import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  size?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  size = 200,
  showLegend = true,
  showPercentages = true,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#F7941D', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
  
  let cumulativePercentage = 0;
  const slices = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    cumulativePercentage += percentage;
    
    const color = item.color || colors[index % colors.length];
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      color,
    };
  });
  
  const createPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(0, 0, radius, endAngle);
    const end = polarToCartesian(0, 0, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", 0, 0,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  const radius = size / 2 - 10;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {title && (
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      
      <div className="flex items-center justify-center">
        <div className="flex items-start gap-6">
          {/* Pie Chart */}
          <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
              {slices.map((slice, index) => (
                <path
                  key={index}
                  d={createPath(slice.startAngle, slice.endAngle, radius)}
                  fill={slice.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                  transform={`translate(${size/2}, ${size/2})`}
                >
                  <title>{`${slice.label}: ${slice.value.toLocaleString()} (${slice.percentage.toFixed(1)}%)`}</title>
                </path>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          {showLegend && (
            <div className="space-y-2">
              {slices.map((slice, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="text-neutral-700">
                    {slice.label}
                    {showPercentages && (
                      <span className="text-neutral-500 ml-1">
                        ({slice.percentage.toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieChart;