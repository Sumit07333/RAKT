import React from 'react';
import { CheckCircle2, Clock, PhoneCall, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

export default function RequestTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">No timeline events recorded.</p>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'Contacted':
        return <PhoneCall className="w-4 h-4 text-blue-600" />;
      case 'Fulfilled':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-slate-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 border-amber-300';
      case 'Contacted':
        return 'bg-blue-100 border-blue-300';
      case 'Fulfilled':
        return 'bg-emerald-100 border-emerald-300';
      case 'Cancelled':
        return 'bg-slate-100 border-slate-300';
      default:
        return 'bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {events.map((evt, idx) => (
        <div key={idx} className="relative group">
          {/* Timeline node icon */}
          <div
            className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border flex items-center justify-center bg-white shadow-xs ${getStatusBg(
              evt.status
            )}`}
          >
            {getStatusIcon(evt.status)}
          </div>

          <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <span className="text-sm font-bold text-[#273741]">{evt.status}</span>
              <span className="text-xs text-slate-500 font-medium">
                {formatDateTime(evt.timestamp)}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
