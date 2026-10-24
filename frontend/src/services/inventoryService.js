// RaktNavi Inventory Service Layer
// Bridges UI requests to either FastAPI backend or client-side synthetic demo dataset.

import { apiRequest, IS_DEMO_MODE } from './apiClient';
import { INITIAL_DEMO_INVENTORY, DEMO_FACILITIES } from '../data/demoInventory';

const INVENTORY_STORAGE_KEY = 'raktnavi_inventory_store_v1';

function getStoredInventory() {
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load stored inventory', e);
  }
  return [...INITIAL_DEMO_INVENTORY];
}

function persistInventory(records) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.warn('Failed to persist inventory', e);
  }
}

// Persistent store for demo mode interactivity across browser refreshes
let demoInventoryStore = getStoredInventory();
let demoFacilitiesStore = [...DEMO_FACILITIES];

/**
 * Search blood inventory with filters
 */
export async function searchInventory({ city = '', bloodGroup = '', status = '' } = {}) {
  if (IS_DEMO_MODE) {
    // Simulate brief network delay for realistic UX testing (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));

    let results = [...demoInventoryStore];

    if (city && city.trim()) {
      const queryCity = city.trim().toLowerCase();
      results = results.filter((item) =>
        item.city.toLowerCase().includes(queryCity)
      );
    }

    if (bloodGroup && bloodGroup !== 'All' && bloodGroup !== '') {
      results = results.filter((item) => item.bloodGroup === bloodGroup);
    }

    if (status && status !== 'All Statuses' && status !== 'All' && status !== '') {
      results = results.filter((item) => item.availabilityStatus === status);
    }

    return {
      success: true,
      isDemo: true,
      total: results.length,
      records: results
    };
  }

  // API Mode
  const params = new URLSearchParams();
  if (city) params.append('city', city);
  if (bloodGroup) params.append('blood_group', bloodGroup);
  if (status) params.append('status', status);

  const response = await apiRequest(`/api/v1/inventory?${params.toString()}`);
  return response.data || response;
}

/**
 * Get facility information and all its listed blood group inventory
 */
export async function getFacilityDetails(facilityId) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const facility = demoFacilitiesStore.find((f) => f.id === facilityId);
    if (!facility) {
      const error = new Error('Facility record not found.');
      error.status = 404;
      throw error;
    }

    const facilityInventory = demoInventoryStore.filter(
      (item) => item.facilityId === facilityId
    );

    return {
      success: true,
      isDemo: true,
      facility,
      inventory: facilityInventory
    };
  }

  // API Mode
  const response = await apiRequest(`/api/v1/inventory/${facilityId}`);
  return response.data || response;
}

/**
 * Get all demo facilities list for dropdowns
 */
export function getAllFacilities() {
  return [...demoFacilitiesStore];
}

/**
 * Operator action: Add or update an inventory record (Demo in-memory or API)
 */
export async function upsertInventoryRecord(recordData) {
  if (IS_DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const existingIndex = demoInventoryStore.findIndex(
      (item) => item.facilityId === recordData.facilityId && item.bloodGroup === recordData.bloodGroup
    );

    const facility = demoFacilitiesStore.find((f) => f.id === recordData.facilityId);

    const updatedRecord = {
      id: existingIndex >= 0 ? demoInventoryStore[existingIndex].id : `inv-demo-${Date.now()}`,
      facilityId: recordData.facilityId,
      facilityName: facility ? facility.name : 'Demo Facility',
      city: facility ? facility.city : recordData.city || 'Patna',
      address: facility ? facility.address : 'Demo Address',
      phone: facility ? facility.phone : '+91 612 220 0001',
      bloodGroup: recordData.bloodGroup,
      unitsAvailable: Number(recordData.unitsAvailable),
      availabilityStatus: recordData.availabilityStatus,
      lastUpdated: new Date().toISOString(),
      notes: recordData.notes || 'Updated via Operator Portal'
    };

    if (existingIndex >= 0) {
      demoInventoryStore[existingIndex] = updatedRecord;
    } else {
      demoInventoryStore.unshift(updatedRecord);
    }
    persistInventory(demoInventoryStore);

    return {
      success: true,
      isDemo: true,
      record: updatedRecord
    };
  }

  // API Mode
  return await apiRequest('/api/v1/admin/inventory', {
    method: 'POST',
    body: JSON.stringify(recordData)
  });
}
