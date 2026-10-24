import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function AvailabilityBadge({ status, units, showIcon = true, size = 'md' }) {
  let config = {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    label: status || 'Available'
  };

  switch (status) {
    case 'Available':
      config = {
        bg: 'bg-emerald-50',
        text: 'text-[#16803C]',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        label: 'Available'
      };
      break;
    case 'Low Stock':
      config = {
        bg: 'bg-amber-50',
        text: 'text-[#B45309]',
        border: 'border-amber-200',
        icon: AlertTriangle,
        label: 'Low Stock'
      };
      break;
    case 'Critically Low':
      config = {
        bg: 'bg-rose-50',
        text: 'text-[#C41315]',
        border: 'border-rose-200',
        icon: AlertCircle,
        label: 'Critically Low'
      };
      break;
    case 'Unavailable':
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-300',
        icon: XCircle,
        label: 'Unavailable'
      };
      break;
    default:
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
        icon: AlertCircle,
        label: status || 'Unknown'
      };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs md:text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
      {typeof units === 'number' && (
        <span className="font-semibold text-xs ml-0.5 opacity-90">({units} {units === 1 ? 'unit' : 'units'})</span>
      )}
    </span>
  );
}
