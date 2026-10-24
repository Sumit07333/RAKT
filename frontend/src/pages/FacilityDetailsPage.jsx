import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowLeft,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import InventoryTable from '../components/inventory/InventoryTable';
import { getFacilityDetails } from '../services/inventoryService';

export default function FacilityDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getFacilityDetails(id)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load facility record.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <LoadingState message="Fetching facility details and listed inventory..." />
      </div>
    );
  }

  if (error || !data?.facility) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Facility Not Found"
          description={`No listed medical blood center matched ID "${id}". It may have been removed or entered incorrectly.`}
          actionLabel="Back to All Blood Centers"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const { facility, inventory } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/find-blood"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#C41315] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Availability</span>
        </Link>
      </div>

      {/* Main Facility Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {facility.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Registered Facility
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273741] tracking-tight">
              {facility.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
              </span>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {facility.phone && (
              <a href={`tel:${facility.phone}`}>
                <Button variant="outline" size="md" icon={Phone}>
                  Call Facility
                </Button>
              </a>
            )}
            <Link
              to={`/emergency-request?facilityId=${facility.id}&city=${encodeURIComponent(
                facility.city
              )}`}
            >
              <Button variant="primary" size="md" icon={PlusCircle}>
                Request Blood
              </Button>
            </Link>
          </div>
        </div>

        {/* Facility Contact & Operating Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-600">
          <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="block font-bold text-[#273741]">Operating Hours</span>
              <span>{facility.operatingHours}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Phone className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="block font-bold text-[#273741]">Emergency Desk</span>
              <span>{facility.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <span className="block font-bold text-[#273741]">Helpdesk Email</span>
              <span>{facility.email}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Reconfirmation Alert */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Mandatory Verification Required:</p>
            <p>
              Reported availability counts are subject to immediate clinical demands. Always contact the center directly at{' '}
              <span className="font-semibold">{facility.phone}</span> to reconfirm current component inventory, compatibility testing requirements, and donor replacement protocols before transit.
            </p>
          </div>
        </div>
      </div>

      {/* Facility Blood Stock Breakdown */}
      <div className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#273741]">
              Listed Blood Inventory by Group
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current stock counts and freshness assessments recorded for this center.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {inventory.length} Groups Cataloged
          </span>
        </div>

        <InventoryTable records={inventory} showFacility={false} />
      </div>
    </div>
  );
}
