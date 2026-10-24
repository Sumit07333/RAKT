import React from 'react';
import { Link } from 'react-router-dom';
import BloodGroupBadge from '../common/BloodGroupBadge';
import AvailabilityBadge from '../common/AvailabilityBadge';
import FreshnessBadge from '../common/FreshnessBadge';
import Button from '../common/Button';

export default function InventoryTable({
  records = [],
  showFacility = true,
  onEditRecord,
  isOperatorView = false
}) {
  if (records.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-[#E2E8EC]">
        No inventory records to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E2E8EC] bg-white shadow-xs">
      <table className="w-full text-left text-sm text-[#273741]">
        <thead className="bg-[#EEF2F4] text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-[#E2E8EC]">
          <tr>
            <th scope="col" className="px-4 py-3.5">Blood Group</th>
            {showFacility && <th scope="col" className="px-4 py-3.5">Facility & City</th>}
            <th scope="col" className="px-4 py-3.5">Units Available</th>
            <th scope="col" className="px-4 py-3.5">Status</th>
            <th scope="col" className="px-4 py-3.5">Last Updated / Freshness</th>
            <th scope="col" className="px-4 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3.5 whitespace-nowrap">
                <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
              </td>
              {showFacility && (
                <td className="px-4 py-3.5">
                  <Link
                    to={`/facilities/${item.facilityId}`}
                    className="font-semibold text-[#273741] hover:text-[#C41315] transition-colors block"
                  >
                    {item.facilityName}
                  </Link>
                  <span className="text-xs text-slate-500">{item.city}</span>
                </td>
              )}
              <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                {item.unitsAvailable}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <AvailabilityBadge status={item.availabilityStatus} size="sm" />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <FreshnessBadge timestamp={item.lastUpdated} size="sm" />
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap text-right">
                {isOperatorView ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRecord && onEditRecord(item)}
                  >
                    Edit Stock
                  </Button>
                ) : (
                  <Link
                    to={`/emergency-request?facilityId=${item.facilityId}&bloodGroup=${encodeURIComponent(
                      item.bloodGroup
                    )}&city=${encodeURIComponent(item.city)}`}
                  >
                    <Button variant="primary" size="sm">
                      Request
                    </Button>
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
