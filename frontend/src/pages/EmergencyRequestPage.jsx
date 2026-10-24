import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, HeartHandshake } from 'lucide-react';
import RequestForm from '../components/requests/RequestForm';

export default function EmergencyRequestPage() {
  const [searchParams] = useSearchParams();

  const initialValues = {
    facilityPreferenceId: searchParams.get('facilityId') || '',
    bloodGroup: searchParams.get('bloodGroup') || 'O+',
    city: searchParams.get('city') || 'Patna'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/find-blood"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#C41315] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blood Search</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C41315] text-xs font-bold uppercase tracking-wider mb-2">
          <HeartHandshake className="w-4 h-4" />
          <span>Emergency Request Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273741] tracking-tight">
          Submit Emergency Blood Request
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Log critical blood requirements into the emergency coordination queue. Receive an instant tracking reference code to follow up with responding centers.
        </p>
      </div>

      {/* Form */}
      <RequestForm initialValues={initialValues} />

      {/* Privacy Notice */}
      <div className="text-center text-xs text-slate-500">
        <p>
          Privacy Guarantee: No private clinical records or patient identity details are stored in permanent browser caches.
        </p>
      </div>
    </div>
  );
}
