import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import BloodGroupBadge from '../common/BloodGroupBadge';
import AvailabilityBadge from '../common/AvailabilityBadge';
import FreshnessBadge from '../common/FreshnessBadge';
import Button from '../common/Button';

export default function InventoryCard({ item }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8EC] p-5 shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header: Blood Group & Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BloodGroupBadge bloodGroup={item.bloodGroup} size="lg" />
            <div>
              <div className="text-lg font-bold text-[#273741] leading-tight">
                {item.unitsAvailable} <span className="text-xs font-semibold text-slate-500">Units Listed</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Cataloged units</span>
            </div>
          </div>
          <AvailabilityBadge status={item.availabilityStatus} size="sm" />
        </div>

        {/* Facility Info */}
        <div className="space-y-1.5 mb-4">
          <Link
            to={`/facilities/${item.facilityId}`}
            className="text-base font-bold text-[#273741] hover:text-[#C41315] transition-colors line-clamp-1 block"
          >
            {item.facilityName}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{item.address}, {item.city}</span>
          </div>
          {item.notes && (
            <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-md border border-slate-100">
              "{item.notes}"
            </p>
          )}
        </div>

        {/* Freshness Badge */}
        <div className="pt-3 border-t border-slate-100 mb-4">
          <FreshnessBadge timestamp={item.lastUpdated} size="sm" />
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#273741] transition-colors"
            title="Call facility to verify availability"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Call Facility</span>
          </a>
        ) : (
          <span className="text-xs text-slate-400 italic">No phone listed</span>
        )}

        <div className="flex items-center gap-2">
          <Link to={`/facilities/${item.facilityId}`}>
            <Button variant="ghost" size="sm">
              Details
            </Button>
          </Link>
          <Link
            to={`/emergency-request?facilityId=${item.facilityId}&bloodGroup=${encodeURIComponent(
              item.bloodGroup
            )}&city=${encodeURIComponent(item.city)}`}
          >
            <Button variant="primary" size="sm" icon={ArrowRight}>
              Request
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
