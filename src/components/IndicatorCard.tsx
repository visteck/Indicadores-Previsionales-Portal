import React from 'react';

interface IndicatorCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  badge?: string;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color = 'primary',
  badge,
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
    <div className="card animate-fade-in hover:scale-105 transition-transform">
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
      <div className="mt-2">
        <p className="card-value">{value}</p>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
