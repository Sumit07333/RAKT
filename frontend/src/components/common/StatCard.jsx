import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default', // 'default', 'warning', 'danger', 'success'
  className = ''
}) {
  const variantStyles = {
    default: {
      border: 'border-[#E2E8EC]',
      iconBg: 'bg-slate-100 text-[#273741]',
      badge: 'bg-slate-50 text-slate-700'
    },
    warning: {
      border: 'border-amber-200 bg-amber-50/30',
      iconBg: 'bg-amber-100 text-[#B45309]',
      badge: 'bg-amber-50 text-[#B45309]'
    },
    danger: {
      border: 'border-rose-200 bg-rose-50/30',
      iconBg: 'bg-rose-100 text-[#C41315]',
      badge: 'bg-rose-50 text-[#C41315]'
    },
    success: {
      border: 'border-emerald-200 bg-emerald-50/30',
      iconBg: 'bg-emerald-100 text-[#16803C]',
      badge: 'bg-emerald-50 text-[#16803C]'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-xs transition-shadow hover:shadow-sm ${currentVariant.border} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#273741]">{value}</p>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-2.5 text-xs text-slate-500 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
