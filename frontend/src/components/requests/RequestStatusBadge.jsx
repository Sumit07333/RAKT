import React from 'react';
import { Clock, PhoneCall, CheckCircle, XCircle } from 'lucide-react';

export default function RequestStatusBadge({ status, size = 'md' }) {
  let config = {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Clock,
    label: status || 'Pending'
  };

  switch (status) {
    case 'Pending':
      config = {
        bg: 'bg-amber-50',
        text: 'text-[#B45309]',
        border: 'border-amber-200',
        icon: Clock,
        label: 'Pending Review'
      };
      break;
    case 'Contacted':
      config = {
        bg: 'bg-blue-50',
        text: 'text-[#2563EB]',
        border: 'border-blue-200',
        icon: PhoneCall,
        label: 'Facility Contacted'
      };
      break;
    case 'Fulfilled':
      config = {
        bg: 'bg-emerald-50',
        text: 'text-[#16803C]',
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Fulfilled'
      };
      break;
    case 'Cancelled':
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-300',
        icon: XCircle,
        label: 'Cancelled'
      };
      break;
    default:
      config = {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: Clock,
        label: status || 'Unknown'
      };
  }

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs md:text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
