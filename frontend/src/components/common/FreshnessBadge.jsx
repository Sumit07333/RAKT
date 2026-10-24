import React from 'react';
import { Clock, HelpCircle } from 'lucide-react';
import { evaluateFreshness } from '../../utils/freshness';
import { formatRelativeTime } from '../../utils/formatDate';

export default function FreshnessBadge({ timestamp, showRelative = true, size = 'md' }) {
  const freshness = evaluateFreshness(timestamp);
  const relativeTime = formatRelativeTime(timestamp);

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap" title={freshness.warning}>
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${freshness.badgeColor} ${sizeClass}`}
      >
        <span className={`w-2 h-2 rounded-full ${freshness.dotColor} shrink-0`} aria-hidden="true" />
        <span>{freshness.label}</span>
      </span>
      {showRelative && timestamp && (
        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
          <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span>{relativeTime}</span>
        </span>
      )}
    </div>
  );
}
