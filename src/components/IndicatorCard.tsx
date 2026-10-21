import React from 'react';

interface IndicatorCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  badge?: string;
  trend?: number[];
  trendRange?: string;
}

interface SparklineProps {
  title: string;
  values: number[];
  range: string;
}

const Sparkline: React.FC<SparklineProps> = ({ title, values, range }) => {
  if (values.length < 2 || values.some(value => !Number.isFinite(value))) return null;

  const width = 88;
  const height = 44;
  const padding = 4;
  const minimum = Math.min(...values);
  const valueRange = Math.max(...values) - minimum || 1;
  const points = values.map((value, index) => ({
    x: padding + index * (width - padding * 2) / (values.length - 1),
    y: height - padding - (value - minimum) / valueRange * (height - padding * 2),
  }));
  const coordinates = points.map(({ x, y }) => `${x},${y}`).join(' ');
  const baseline = height - padding;
  const lastPoint = points[points.length - 1];
  const area = `M ${points[0].x} ${baseline} ${points.map(({ x, y }) => `L ${x} ${y}`).join(' ')} L ${lastPoint.x} ${baseline} Z`;
  const label = `Evolución de ${title} desde ${range}`;

  return (
    <svg
      className="h-10 w-20 shrink-0 text-cyan-600"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {[8, 22, 36].map(y => (
        <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <path d={area} fill="currentColor" fillOpacity="0.25" />
      <polyline
        points={coordinates}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill="currentColor" />
    </svg>
  );
};

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
  badge,
  trend,
  trendRange,
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <div className="card flex flex-col animate-fade-in hover:scale-105 transition-transform">
      <div className="card-header">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="card-title">{title}</h3>
          {badge && (
            <span className="badge bg-slate-100 text-slate-600">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-2">
        <div className="min-w-0">
          <p className="card-value">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {trend && trendRange && <Sparkline title={title} values={trend} range={trendRange} />}
      </div>
    </div>
  );
};
