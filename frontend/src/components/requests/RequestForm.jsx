import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, Copy, Check, Share2 } from 'lucide-react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import Input from '../common/Input';
import Select from '../common/Select';
import { BLOOD_GROUPS } from '../../data/demoInventory';
import { URGENCY_LEVELS } from '../../data/demoRequests';
import { validateIndianPhone, validateRequiredText, validateUnits } from '../../utils/validation';
import { createEmergencyRequest } from '../../services/requestService';
import { getAllFacilities } from '../../services/inventoryService';

export default function RequestForm({ initialValues = {} }) {
  const facilities = getAllFacilities();

  const [formData, setFormData] = useState({
    requesterName: initialValues.requesterName || '',
    contactPhone: initialValues.contactPhone || '',
    city: initialValues.city || 'Patna',
    bloodGroup: initialValues.bloodGroup || 'O+',
    unitsRequired: initialValues.unitsRequired || 1,
    facilityPreferenceId: initialValues.facilityPreferenceId || '',
    urgencyLevel: initialValues.urgencyLevel || 'Urgent',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const bloodGroupOptions = BLOOD_GROUPS.map((bg) => ({ value: bg, label: `Group ${bg}` }));
  const urgencyOptions = URGENCY_LEVELS.map((u) => ({ value: u, label: u }));
  const facilityOptions = [
    { value: '', label: 'No Preference / Nearest Available' },
    ...facilities.map((f) => ({ value: f.id, label: `${f.name} (${f.city})` }))
  ];

  const validate = () => {
    const newErrors = {};

    const nameCheck = validateRequiredText(formData.requesterName, 'Requester or Patient Name', 3, 70);
    if (!nameCheck.isValid) newErrors.requesterName = nameCheck.error;

    const phoneCheck = validateIndianPhone(formData.contactPhone);
    if (!phoneCheck.isValid) newErrors.contactPhone = phoneCheck.error;

    const cityCheck = validateRequiredText(formData.city, 'City', 2, 50);
    if (!cityCheck.isValid) newErrors.city = cityCheck.error;

    const unitsCheck = validateUnits(formData.unitsRequired);
    if (!unitsCheck.isValid) newErrors.unitsRequired = unitsCheck.error;

    if (formData.additionalNotes.length > 300) {
      newErrors.additionalNotes = 'Additional notes cannot exceed 300 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await createEmergencyRequest(formData);
      setSubmittedResult(response.data);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit emergency request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (submittedResult?.requestCode) {
      navigator.clipboard.writeText(submittedResult.requestCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedResult) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-card text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16803C] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-[#273741]">
          Emergency Request Recorded
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Your emergency request has been registered in the coordination queue with reference code:
        </p>

        {/* Code Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-extrabold text-[#C41315] tracking-wider">
            {submittedResult.requestCode}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Copy reference code"
            className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors focus:ring-1 focus:ring-[#C41315]"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {/* Operational Notice Alert */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#273741]">
            <ShieldAlert className="w-4 h-4 text-[#C41315] shrink-0" />
            <span>Important Operational Notice:</span>
          </div>
          <p>
            • Requisition tickets notify participating facilities. Blood availability remains subject to on-site testing and physical stock confirmation.
          </p>
          <p>
            • In critical life-saving circumstances, always contact the facility emergency desk directly using the numbers provided in the directory.
          </p>
        </div>

        {/* Next Actions */}
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
          <Link to={`/track-request?code=${submittedResult.requestCode}`} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full" icon={ArrowRight}>
              Track This Request Now
            </Button>
          </Link>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🚨 *URGENT BLOOD REQUIREMENT (RaktNavi)*\n• Blood Group: *${submittedResult.bloodGroup || formData.bloodGroup}*\n• Units Needed: *${submittedResult.unitsRequired || formData.unitsRequired} Units*\n• City: *${submittedResult.city || formData.city}*\n• Tracking Code: *${submittedResult.requestCode}*\nLive Tracking: ${window.location.origin}/track-request?code=${submittedResult.requestCode}\n\n_Please share with compatible donors immediately._`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Broadcast on WhatsApp</span>
          </a>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSubmittedResult(null);
              setFormData({
                requesterName: '',
                contactPhone: '',
                city: 'Patna',
                bloodGroup: 'O+',
                unitsRequired: 1,
                facilityPreferenceId: '',
                urgencyLevel: 'Urgent',
                additionalNotes: ''
              });
            }}
          >
            Create Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-[#E2E8EC] p-6 sm:p-8 shadow-xs">
      {/* Notice Banner */}
      <div className="p-3.5 mb-6 rounded-lg bg-red-50/70 border border-red-200 flex items-start gap-2.5 text-xs text-red-950">
        <AlertCircle className="w-4 h-4 text-[#C41315] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">EMERGENCY INTAKE:</span> Please ensure contact details are accurate so responding facilities and blood coordinators can reach you promptly.
        </div>
      </div>

      {errors.form && (
        <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C41315]">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Requester Name */}
        <FormField
          id="requesterName"
          label="Patient or Requester Name"
          required
          error={errors.requesterName}
          hint="Full name of attendant, guardian, or patient"
        >
          <Input
            id="requesterName"
            value={formData.requesterName}
            onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
            placeholder="e.g. Rajesh Sharma"
            error={errors.requesterName}
            disabled={isSubmitting}
          />
        </FormField>

        {/* Contact Phone */}
        <FormField
          id="contactPhone"
          label="Contact Mobile Number"
          required
          error={errors.contactPhone}
          hint="10-digit Indian mobile format (e.g. 9876543210)"
        >
          <Input
            id="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            placeholder="9876543210"
            error={errors.contactPhone}
            disabled={isSubmitting}
          />
        </FormField>

        {/* City */}
        <FormField
          id="city"
          label="City / Town"
          required
          error={errors.city}
        >
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Patna"
            error={errors.city}
            disabled={isSubmitting}
          />
        </FormField>

        {/* Blood Group */}
        <FormField
          id="bloodGroup"
          label="Required Blood Group"
          required
        >
          <Select
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            options={bloodGroupOptions}
            disabled={isSubmitting}
            placeholder=""
          />
        </FormField>

        {/* Units Required */}
        <FormField
          id="unitsRequired"
          label="Units Required (PRBC / Whole Blood)"
          required
          error={errors.unitsRequired}
          hint="Maximum 20 units for demonstration"
        >
          <Input
            id="unitsRequired"
            type="number"
            min="1"
            max="20"
            value={formData.unitsRequired}
            onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
            error={errors.unitsRequired}
            disabled={isSubmitting}
          />
        </FormField>

        {/* Urgency Level */}
        <FormField
          id="urgencyLevel"
          label="Urgency Level"
          required
        >
          <Select
            id="urgencyLevel"
            value={formData.urgencyLevel}
            onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
            options={urgencyOptions}
            disabled={isSubmitting}
            placeholder=""
          />
        </FormField>

        {/* Facility Preference */}
        <div className="md:col-span-2">
          <FormField
            id="facilityPreferenceId"
            label="Preferred Blood Facility (Optional)"
            hint="Leave blank if any nearest verified facility is acceptable"
          >
            <Select
              id="facilityPreferenceId"
              value={formData.facilityPreferenceId}
              onChange={(e) => setFormData({ ...formData, facilityPreferenceId: e.target.value })}
              options={facilityOptions}
              disabled={isSubmitting}
              placeholder=""
            />
          </FormField>
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <FormField
            id="additionalNotes"
            label="Additional Notes / Clinical Context"
            error={errors.additionalNotes}
            hint={`${formData.additionalNotes.length}/300 characters`}
          >
            <textarea
              id="additionalNotes"
              rows="3"
              maxLength="300"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="e.g. Surgery scheduled at 2 PM, replacement donors currently on transit..."
              disabled={isSubmitting}
              className="w-full rounded-lg border border-[#E2E8EC] p-3 text-sm text-[#273741] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C41315] focus:border-transparent transition-colors"
            />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <Link to="/find-blood">
          <Button variant="ghost" disabled={isSubmitting}>
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
        >
          Submit Emergency Request
        </Button>
      </div>
    </form>
  );
}
