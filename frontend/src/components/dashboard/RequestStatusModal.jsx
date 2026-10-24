import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import Select from '../common/Select';
import { REQUEST_STATUSES } from '../../data/demoRequests';

export default function RequestStatusModal({ isOpen, onClose, onUpdate, request }) {
  const [status, setStatus] = useState(request?.status || 'Pending');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setNote('');
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  const statusOptions = REQUEST_STATUSES.filter((s) => s !== 'All').map((s) => ({
    value: s,
    label: s
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(request.id, status, note);
      onClose();
    } catch {
      // error handled in caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-modal max-w-md w-full p-6 text-[#273741] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 id="status-modal-title" className="text-lg font-bold text-[#273741]">
              Update Request Status
            </h3>
            <p className="text-xs font-mono font-semibold text-[#C41315]">
              {request.requestCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
          <p><strong>Requester:</strong> {request.requesterName} ({request.contactPhone})</p>
          <p><strong>Requirement:</strong> {request.unitsRequired} unit(s) of {request.bloodGroup} in {request.city}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <FormField id="modal-req-status" label="New Status" required>
            <Select
              id="modal-req-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              disabled={isSubmitting}
              placeholder=""
            />
          </FormField>

          <FormField id="modal-req-note" label="Action Log / Operator Note" hint="Explain the verification step performed">
            <textarea
              id="modal-req-note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Called attendant and confirmed donor replacement dispatched..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-[#E2E8EC] p-2.5 text-sm text-[#273741] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41315] focus:border-transparent"
            />
          </FormField>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
