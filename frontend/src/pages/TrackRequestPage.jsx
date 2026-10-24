import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, FileText, CheckCircle2, AlertCircle, Phone, MapPin, Share2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import BloodGroupBadge from '../components/common/BloodGroupBadge';
import RequestStatusBadge from '../components/requests/RequestStatusBadge';
import RequestTimeline from '../components/requests/RequestTimeline';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import { getRequestByCode } from '../services/requestService';
import { formatDateTime } from '../utils/formatDate';

export default function TrackRequestPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [activeRequest, setActiveRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchRequest = (targetCode) => {
    if (!targetCode.trim()) {
      setError('Please enter a valid request reference code (e.g. RN-DEMO-782194).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    getRequestByCode(targetCode)
      .then((res) => {
        setActiveRequest(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setActiveRequest(null);
        setError(err.message || 'Request not found.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (initialCode) {
      fetchRequest(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter your request reference code.');
      return;
    }
    setSearchParams({ code: code.trim().toUpperCase() });
    fetchRequest(code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4 text-[#C41315]" />
          <span>Real-time Status Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#273741] tracking-tight">
          Track Emergency Request
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your unique reference code to review live verification status and audit timeline events.
        </p>
      </div>

      {/* Code Search Input Box */}
      <div className="bg-white rounded-2xl border border-[#E2E8EC] p-6 shadow-xs max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full">
            <Input
              id="tracking-code-input"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. RN-782194"
              icon={Search}
              className="font-mono text-base uppercase"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full sm:w-auto shrink-0"
          >
            Track Status
          </Button>
        </form>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C41315] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Reference Codes */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
          <span className="font-semibold text-slate-400">Sample Inquiries:</span>
          {['RN-782194', 'RN-649102', 'RN-310574'].map((sampleCode) => (
            <button
              key={sampleCode}
              type="button"
              onClick={() => {
                setCode(sampleCode);
                setSearchParams({ code: sampleCode });
                fetchRequest(sampleCode);
              }}
              className="font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[#273741] font-semibold transition-colors"
            >
              {sampleCode}
            </button>
          ))}
        </div>
      </div>

      {/* Tracking Results Panel */}
      {isLoading ? (
        <LoadingState message="Retrieving emergency request record..." />
      ) : activeRequest ? (
        <div className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-card space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Emergency Request Reference
              </span>
              <h2 className="text-2xl font-mono font-black text-[#C41315] tracking-wide">
                {activeRequest.requestCode}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Created: {formatDateTime(activeRequest.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🚨 *URGENT BLOOD REQUIREMENT (RaktNavi)*\n• Blood Group: *${activeRequest.bloodGroup}*\n• Units Needed: *${activeRequest.unitsRequired} Units*\n• City: *${activeRequest.city}*\n• Status: *${activeRequest.status}*\n• Reference Code: *${activeRequest.requestCode}*\nLive Tracking: ${window.location.origin}/track-request?code=${activeRequest.requestCode}\n\n_Please share with compatible donors immediately._`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Broadcast on WhatsApp</span>
              </a>
              <RequestStatusBadge status={activeRequest.status} size="md" />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Required Group
              </span>
              <div className="mt-1">
                <BloodGroupBadge bloodGroup={activeRequest.bloodGroup} size="sm" />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Units Required
              </span>
              <span className="mt-1 block font-bold text-base text-[#273741]">
                {activeRequest.unitsRequired} {activeRequest.unitsRequired === 1 ? 'Unit' : 'Units'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                City / Location
              </span>
              <span className="mt-1 block font-semibold text-sm text-[#273741]">
                {activeRequest.city}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Urgency Tier
              </span>
              <span className="mt-1 block font-semibold text-sm text-[#C41315]">
                {activeRequest.urgencyLevel}
              </span>
            </div>
          </div>

          {/* Requester & Preferred Facility info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-[#273741] block">Requester Identification:</span>
              <p>{activeRequest.requesterName}</p>
              <p className="text-slate-500">Contact: {activeRequest.contactPhone}</p>
            </div>
            <div className="p-3.5 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-[#273741] block">Facility Assignment:</span>
              <p>{activeRequest.facilityName || 'Any nearest available center'}</p>
              {activeRequest.additionalNotes && (
                <p className="text-slate-500 italic">Notes: "{activeRequest.additionalNotes}"</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#273741] uppercase tracking-wider mb-4">
              Chronological Verification Timeline
            </h3>
            <RequestTimeline events={activeRequest.timeline} />
          </div>

          {/* Refresh notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
            Emergency requests are tracked in real-time as responding coordinators update contact and fulfillment progress.
          </div>
        </div>
      ) : hasSearched && !isLoading ? (
        <EmptyState
          title="No Request Found"
          description={`We could not locate any active emergency request for code "${code}". Please verify the code.`}
          actionLabel="Try Sample Code (RN-782194)"
          onAction={() => {
            setCode('RN-782194');
            fetchRequest('RN-782194');
          }}
        />
      ) : null}
    </div>
  );
}
