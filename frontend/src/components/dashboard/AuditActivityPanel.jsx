import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export default function AuditActivityPanel({ logs = [] }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8EC] p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#C41315]" aria-hidden="true" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#273741]">
            Operations Audit Trail
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Live Event Stream
        </span>
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-4 text-center">
          No operator actions recorded in this active session.
        </p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#273741]">{log.action}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                {formatRelativeTime(log.timestamp)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
