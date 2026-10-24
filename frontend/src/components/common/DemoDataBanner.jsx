import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export default function DemoDataBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      role="region"
      aria-label="Operational Advisory Notice"
      className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2 text-xs font-medium"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C41315] text-white font-bold text-[11px] tracking-wide uppercase">
            <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
            Verification Advisory
          </span>
          <span className="text-slate-200 hidden sm:inline">
            Reported inventory changes rapidly. Always call the listed facility directly to verify current blood component stock before travel.
          </span>
          <span className="text-slate-200 sm:hidden">
            Always call the facility directly to verify stock before travel.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss advisory banner"
          className="text-slate-400 hover:text-white p-1 rounded transition-colors focus:ring-1 focus:ring-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
