// RaktNavi Emergency Requests Store
// Maintains active request records, tracking timelines, and status lifecycle.

const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

export const INITIAL_DEMO_REQUESTS = [
  {
    id: 'req-001',
    requestCode: 'RN-782194',
    requesterName: 'Rajesh Sharma',
    contactPhone: '+91 98765 43210',
    city: 'Patna',
    bloodGroup: 'O-',
    unitsRequired: 2,
    facilityPreferenceId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    urgencyLevel: 'Immediate / Critical',
    status: 'Pending',
    additionalNotes: 'Emergency surgery standby at regional medical center.',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    timeline: [
      {
        status: 'Pending',
        timestamp: hoursAgo(2),
        description: 'Emergency request registered into RaktNavi coordination queue.'
      }
    ]
  },
  {
    id: 'req-002',
    requestCode: 'RN-649102',
    requesterName: 'Priya Patel',
    contactPhone: '+91 91234 56789',
    city: 'Patna',
    bloodGroup: 'A+',
    unitsRequired: 1,
    facilityPreferenceId: 'fac-patna-02',
    facilityName: 'Magadh Medical Research Blood Facility',
    urgencyLevel: 'Urgent',
    status: 'Contacted',
    additionalNotes: 'Patient admitted for surgical procedure; facility contact initiated.',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(3),
    timeline: [
      {
        status: 'Pending',
        timestamp: hoursAgo(5),
        description: 'Emergency request logged in coordination queue.'
      },
      {
        status: 'Contacted',
        timestamp: hoursAgo(3),
        description: 'Operator contacted listed facility to cross-verify unit readiness.'
      }
    ]
  },
  {
    id: 'req-003',
    requestCode: 'RN-310574',
    requesterName: 'Amit Verma',
    contactPhone: '+91 99887 76655',
    city: 'New Delhi',
    bloodGroup: 'B+',
    unitsRequired: 2,
    facilityPreferenceId: 'fac-delhi-01',
    facilityName: 'Capital Metropolitan Blood Bank',
    urgencyLevel: 'Normal',
    status: 'Fulfilled',
    additionalNotes: 'Requisition fulfilled by voluntary donor arrangement.',
    createdAt: hoursAgo(24),
    updatedAt: hoursAgo(6),
    timeline: [
      {
        status: 'Pending',
        timestamp: hoursAgo(24),
        description: 'Request initiated by attending representative.'
      },
      {
        status: 'Contacted',
        timestamp: hoursAgo(18),
        description: 'Partner facility confirmed unit reservation.'
      },
      {
        status: 'Fulfilled',
        timestamp: hoursAgo(6),
        description: 'Requisition marked complete in coordination tracker.'
      }
    ]
  }
];

export const URGENCY_LEVELS = [
  'Normal',
  'Urgent',
  'Immediate / Critical'
];

export const REQUEST_STATUSES = [
  'All',
  'Pending',
  'Contacted',
  'Fulfilled',
  'Cancelled'
];
