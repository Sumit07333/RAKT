// RaktNavi Data Freshness Engine
// Treats information freshness as a first-class feature for healthcare reliability.
// Display thresholds are project-defined demonstration rules, not clinical standards.

const RECENT_THRESHOLD_HOURS = 24;
const STALE_THRESHOLD_HOURS = 72;

/**
 * Evaluates an inventory record's update timestamp and returns freshness metadata.
 * @param {string|Date|null|undefined} timestamp 
 * @returns {Object} Freshness assessment
 */
export function evaluateFreshness(timestamp) {
  if (!timestamp) {
    return {
      category: 'unavailable',
      label: 'Timestamp Unavailable',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      dotColor: 'bg-slate-400',
      warning: 'No update timestamp available. Call facility directly before taking any action.',
      isFresh: false,
      hoursOld: null
    };
  }

  const date = new Date(timestamp);
  const now = new Date();

  // Validate date parsing
  if (isNaN(date.getTime())) {
    return {
      category: 'unavailable',
      label: 'Invalid Timestamp',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      dotColor: 'bg-slate-400',
      warning: 'Timestamp formatting is unverified. Please confirm stock directly.',
      isFresh: false,
      hoursOld: null
    };
  }

  const diffMs = now - date;
  
  // Future timestamp safety check
  if (diffMs < -60000) { // more than 1 min in the future
    return {
      category: 'unavailable',
      label: 'Clock Desynchronized',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      warning: 'Record has a future timestamp. Please re-verify with the facility.',
      isFresh: false,
      hoursOld: 0
    };
  }

  const hoursOld = Math.max(0, diffMs / (1000 * 60 * 60));

  if (hoursOld < RECENT_THRESHOLD_HOURS) {
    return {
      category: 'recently_updated',
      label: 'Recently Updated',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      dotColor: 'bg-emerald-500',
      warning: 'Updated within the last 24 hours. Reconfirm with facility during transit.',
      isFresh: true,
      hoursOld
    };
  } else if (hoursOld < STALE_THRESHOLD_HOURS) {
    return {
      category: 'needs_reconfirmation',
      label: 'Needs Reconfirmation',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
      dotColor: 'bg-amber-500',
      warning: 'Updated over 24 hours ago. Stock levels may have shifted significantly.',
      isFresh: false,
      hoursOld
    };
  } else {
    return {
      category: 'stale',
      label: 'Stale (> 72h)',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
      dotColor: 'bg-rose-500',
      warning: 'Record updated more than 3 days ago. High likelihood of stock divergence.',
      isFresh: false,
      hoursOld
    };
  }
}
