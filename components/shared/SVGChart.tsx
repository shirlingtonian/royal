
import React from 'react';
import { HistoricalDataPoint } from '../../types/index';

// Define DataPoint interface locally to be structurally compatible with HistoricalDataPoint
interface DataPoint {
  year: number;
  value: number;
}

export interface ChartProps {
  data: DataPoint[];
  title: string;
  width: number;
  height: number;
  color: string;
  yLabel?: string;
  isBarChart?: boolean;
}

export const SVGChart: React.FC<ChartProps> = ({ data, title, width, height, color, yLabel = "Value", isBarChart = false }) => {
  if (data.length === 0) {
    return <p className="text-slate-500 text-center">No data available for {title}.</p>;
  }

  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xValues = data.map(d => d.year);
  const yValues = data.map(d => d.value);

  const minX = xValues.length > 0 ? Math.min(...xValues) : 0;
  const maxX = xValues.length > 0 ? Math.max(...xValues) : 0;
  const minY = 0; // Assuming values don't go below 0 for status/treasury
  const maxY = yValues.length > 0 ? Math.max(...yValues, 10) : 10; // Ensure maxY is at least 10 for small values


  const getX = (year: number) => {
    if (maxX === minX) return padding.left + chartWidth / 2; // Handle single data point
    return padding.left + ((year - minX) / (maxX - minX)) * chartWidth;
  };

  const getY = (value: number) => {
    if (maxY === minY) return padding.top + chartHeight; // Handle case where all values are the same (or no data)
    return padding.top + chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;
  };

  // Determine number of X-axis ticks, ensuring at least 2 if data exists for a range
  const numXTicks = Math.min(5, data.length > 1 ? data.length : 2);
  const xTickValues = data.length > 1 ? Array.from({ length: numXTicks }, (_, i) =>
    Math.round(minX + i * ((maxX - minX) / (numXTicks -1 < 1 ? 1 : numXTicks - 1))) // Avoid division by zero
  ) : (data.length === 1 ? [minX] : []);


  const numYTicks = 5;
  const yTickValues = Array.from({ length: numYTicks + 1 }, (_, i) =>
     parseFloat((minY + i * ((maxY - minY) / numYTicks)).toFixed(1)) // toFixed(1) for one decimal place if needed
  );


  return (
    <div className="mb-8 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold text-teal-700 mb-2 text-center">{title}</h3>
      <svg width={width} height={height} className="font-sans text-xs" aria-labelledby={`chart-title-${title.replace(/\s+/g, '-')}`} role="img">
        <title id={`chart-title-${title.replace(/\s+/g, '-')}`}>{title}</title>
        {/* Y-axis */}
        {yTickValues.map((tickVal, i) => (
          <g key={`y-tick-${title}-${i}`} transform={`translate(${padding.left}, ${getY(tickVal)})`}>
            <line x1="-5" x2={chartWidth + 5} stroke="#D1D5DB" strokeWidth="0.5" />
            <text x="-10" dy=".32em" textAnchor="end" fill="#6B7280">
              {tickVal.toLocaleString()}
            </text>
          </g>
        ))}
        <text
            transform={`translate(${padding.left / 3}, ${padding.top + chartHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="#4B5563"
            className="text-xs font-semibold"
        >
            {yLabel}
        </text>

        {/* X-axis */}
        {xTickValues.map((tickVal, i) => (
          <g key={`x-tick-${title}-${i}`} transform={`translate(${getX(tickVal)}, ${padding.top + chartHeight})`}>
            <line y1="0" y2="5" stroke="#6B7280" />
            <text y="15" textAnchor="middle" fill="#6B7280">
              {isBarChart ? `Gen ${tickVal}` : `Yr ${tickVal}`}
            </text>
          </g>
        ))}
         <text
            x={padding.left + chartWidth / 2}
            y={height - padding.bottom / 4}
            textAnchor="middle"
            fill="#4B5563"
            className="text-xs font-semibold"
        >
            {isBarChart ? "Generation" : "Year"}
        </text>

        {/* Data rendering */}
        {isBarChart ? (
          data.map((dataPoint, index) => {
            const barWidthRatio = 0.6;
            const slotWidth = data.length > 0 ? chartWidth / data.length : chartWidth;
            const barWidth = slotWidth * barWidthRatio;
            const xPos = getX(dataPoint.year) - barWidth / 2;
            const yPos = getY(dataPoint.value);
            const barHeight = Math.max(0, (padding.top + chartHeight) - yPos); // Ensure height is not negative
            return (
              <rect
                key={`bar-${title}-${index}-${dataPoint.year}`}
                x={xPos}
                y={yPos}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="2"
                ry="2"
              >
                <title>{`Gen ${dataPoint.year}: ${dataPoint.value.toFixed(2)}`}</title>
              </rect>
            );
          })
        ) : (
          <>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={data.map(dataPoint => `${getX(dataPoint.year)},${getY(dataPoint.value)}`).join(' ')}
            />
            {data.map((dataPoint, index) => (
              <circle
                key={`dot-${title}-${index}-${dataPoint.year}`}
                cx={getX(dataPoint.year)}
                cy={getY(dataPoint.value)}
                r="3"
                fill={color}
              >
                <title>{`Year ${dataPoint.year}: ${dataPoint.value.toFixed(2)}`}</title>
              </circle>
            ))}
          </>
        )}
      </svg>
    </div>
  );
};
