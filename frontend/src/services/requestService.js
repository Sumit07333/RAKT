// RaktNavi Emergency Request Service Layer
// Manages request intake, tracking code generation, timeline events, and operator status updates.

import { apiRequest, IS_DEMO_MODE } from './apiClient';
import { INITIAL_DEMO_REQUESTS } from '../data/demoRequests';
import { DEMO_FACILITIES } from '../data/demoInventory';

const STORAGE_KEY = 'raktnavi_emergency_requests_v1';

function getStoredRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored requests', e);
  }
  return [...INITIAL_DEMO_REQUESTS];
}

function persistRequests(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Failed to persist requests', e);
  }
}

// Persistent store across browser refreshes
let demoRequestsStore = getStoredRequests();

/**
 * Generate a random 6-digit reference code: RN-XXXXXX
 */
function generateRequestCode() {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `RN-${digits}`;
}

/**
 * Submit an emergency blood request
 */
export async function createEmergencyRequest(formData) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const requestCode = generateRequestCode();
    const now = new Date().toISOString();
    const facility = formData.facilityPreferenceId
      ? DEMO_FACILITIES.find((f) => f.id === formData.facilityPreferenceId)
      : null;

    const newRequest = {
      id: `req-${Date.now()}`,
      requestCode,
      requesterName: formData.requesterName.trim(),
      contactPhone: formData.contactPhone.trim(),
      city: formData.city.trim(),
      bloodGroup: formData.bloodGroup,
      unitsRequired: Number(formData.unitsRequired),
      facilityPreferenceId: formData.facilityPreferenceId || null,
      facilityName: facility ? facility.name : 'No specific facility selected',
      urgencyLevel: formData.urgencyLevel || 'Urgent',
      status: 'Pending',
      additionalNotes: formData.additionalNotes ? formData.additionalNotes.trim() : '',
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          status: 'Pending',
          timestamp: now,
          description: 'Emergency request registered into RaktNavi coordination queue.'
        }
      ]
    };

    demoRequestsStore.unshift(newRequest);
    persistRequests(demoRequestsStore);

    return {
      success: true,
      data: newRequest
    };
  }

  // API Mode
  const response = await apiRequest('/api/v1/requests', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  return response.data || response;
}

/**
 * Track request status by reference code
 */
export async function getRequestByCode(requestCode) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const normalizedCode = requestCode.trim().toUpperCase();
    const cleanCode = normalizedCode.replace('RN-DEMO-', 'RN-');

    const request = demoRequestsStore.find((r) => {
      const stored = r.requestCode.toUpperCase();
      return (
        stored === normalizedCode ||
        stored.replace('RN-DEMO-', 'RN-') === cleanCode ||
        stored.replace('RN-', 'RN-DEMO-') === normalizedCode
      );
    });

    if (!request) {
      const error = new Error(`No request found matching reference code "${requestCode}". Please verify the code and try again.`);
      error.status = 404;
      throw error;
    }

    return {
      success: true,
      data: request
    };
  }

  // API Mode
  const response = await apiRequest(`/api/v1/requests/${requestCode.trim().toUpperCase()}`);
  return response.data || response;
}

/**
 * Get all requests (for Operator portal)
 */
export async function getAllRequests({ status = 'All' } = {}) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    let list = [...demoRequestsStore];
    if (status && status !== 'All') {
      list = list.filter((r) => r.status === status);
    }
    return {
      success: true,
      total: list.length,
      records: list
    };
  }

  const query = status && status !== 'All' ? `?status=${status}` : '';
  const response = await apiRequest(`/api/v1/admin/requests${query}`);
  return response.data || response;
}

/**
 * Update request status (Operator action)
 */
export async function updateRequestStatus(requestId, newStatus, note = '') {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const requestIndex = demoRequestsStore.findIndex((r) => r.id === requestId);
    if (requestIndex === -1) {
      const error = new Error('Request record not found.');
      error.status = 404;
      throw error;
    }

    const current = demoRequestsStore[requestIndex];
    const now = new Date().toISOString();

    const timelineEntry = {
      status: newStatus,
      timestamp: now,
      description: note.trim() || `Status updated to ${newStatus} by coordinator.`
    };

    const updated = {
      ...current,
      status: newStatus,
      updatedAt: now,
      timeline: [...current.timeline, timelineEntry]
    };

    demoRequestsStore[requestIndex] = updated;
    persistRequests(demoRequestsStore);

    return {
      success: true,
      data: updated
    };
  }

  // API Mode
  const response = await apiRequest(`/api/v1/admin/requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus, note })
  });
  return response.data || response;
}
