import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import Input from '../common/Input';
import Select from '../common/Select';
import { BLOOD_GROUPS, AVAILABILITY_STATUSES } from '../../data/demoInventory';
import { getAllFacilities } from '../../services/inventoryService';

export default function InventoryModal({ isOpen, onClose, onSave, editingItem = null }) {
  const facilities = getAllFacilities();

  const [formData, setFormData] = useState({
    facilityId: facilities[0]?.id || '',
    bloodGroup: 'O+',
    unitsAvailable: 10,
    availabilityStatus: 'Available',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        facilityId: editingItem.facilityId,
        bloodGroup: editingItem.bloodGroup,
        unitsAvailable: editingItem.unitsAvailable,
        availabilityStatus: editingItem.availabilityStatus,
        notes: editingItem.notes || ''
      });
    } else {
      setFormData({
        facilityId: facilities[0]?.id || '',
        bloodGroup: 'O+',
        unitsAvailable: 10,
        availabilityStatus: 'Available',
        notes: ''
      });
    }
    setError(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.unitsAvailable < 0) {
      setError('Units available cannot be negative.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save inventory record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const facilityOptions = facilities.map((f) => ({ value: f.id, label: `${f.name} (${f.city})` }));
  const bloodGroupOptions = BLOOD_GROUPS.map((bg) => ({ value: bg, label: bg }));
  const statusOptions = AVAILABILITY_STATUSES.filter((s) => s !== 'All Statuses').map((s) => ({
    value: s,
    label: s
  }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-modal max-w-lg w-full p-6 text-[#273741] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 id="inventory-modal-title" className="text-lg font-bold text-[#273741]">
            {editingItem ? 'Edit Blood Stock Record' : 'Add Blood Stock Record'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-[#C41315]">
              {error}
            </div>
          )}

          <FormField id="modal-facility" label="Blood Facility" required>
            <Select
              id="modal-facility"
              value={formData.facilityId}
              onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
              options={facilityOptions}
              disabled={isSubmitting || !!editingItem}
              placeholder=""
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="modal-blood-group" label="Blood Group" required>
              <Select
                id="modal-blood-group"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                options={bloodGroupOptions}
                disabled={isSubmitting || !!editingItem}
                placeholder=""
              />
            </FormField>

            <FormField id="modal-units" label="Units Available" required>
              <Input
                id="modal-units"
                type="number"
                min="0"
                value={formData.unitsAvailable}
                onChange={(e) => {
                  const units = Number(e.target.value);
                  let autoStatus = formData.availabilityStatus;
                  if (units === 0) autoStatus = 'Unavailable';
                  else if (units <= 2) autoStatus = 'Critically Low';
                  else if (units <= 5) autoStatus = 'Low Stock';
                  else autoStatus = 'Available';

                  setFormData({
                    ...formData,
                    unitsAvailable: units,
                    availabilityStatus: autoStatus
                  });
                }}
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <FormField id="modal-status" label="Availability Status" required>
            <Select
              id="modal-status"
              value={formData.availabilityStatus}
              onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
              options={statusOptions}
              disabled={isSubmitting}
              placeholder=""
            />
          </FormField>

          <FormField id="modal-notes" label="Operator Notes / Batch Reference">
            <Input
              id="modal-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Lab tested PRBC batch 4A"
              disabled={isSubmitting}
            />
          </FormField>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save} isLoading={isSubmitting}>
              Save Stock Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
