// RaktNavi Synthetic Demonstration Inventory Dataset
// NOTICE: ALL DATA IS FICTIONAL AND FOR DEMONSTRATION/EVALUATION PURPOSES ONLY.
// IT DOES NOT REPRESENT LIVE OR VERIFIED BLOOD INVENTORY.

export const DEMO_FACILITIES = [
  {
    id: 'fac-patna-01',
    name: 'Patna Central Red Cross Blood Center',
    category: 'Regional Blood Bank',
    address: 'Demo Block B, Bailey Road',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    phone: '+91 612 220 0001',
    email: 'patna-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Autonomous central blood transfusion and component separation center (Demo Facility).'
  },
  {
    id: 'fac-patna-02',
    name: 'Magadh Medical Research Blood Facility',
    category: 'Hospital Attached Blood Bank',
    address: 'Demo Sector 4, Kankarbagh',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800020',
    phone: '+91 612 220 0002',
    email: 'magadh-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Attached to tertiary demo hospital providing blood component storage.'
  },
  {
    id: 'fac-patna-03',
    name: 'Nalanda Emergency Blood Reserve',
    category: 'Charitable Trust Blood Center',
    address: 'Demo Lane 12, Rajendra Nagar',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800016',
    phone: '+91 612 220 0003',
    email: 'nalanda-demo@raktnavi.iitp.ac.in',
    operatingHours: '8:00 AM - 10:00 PM',
    description: 'Community-funded blood collection and storage facility.'
  },
  {
    id: 'fac-delhi-01',
    name: 'Capital Metropolitan Blood Bank',
    category: 'Autonomous Apex Blood Bank',
    address: 'Demo Health Enclave, Ansari Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    phone: '+91 11 2600 0001',
    email: 'delhi-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Regional apex center with state-of-the-art component testing laboratories.'
  },
  {
    id: 'fac-delhi-02',
    name: 'North Ridge Charitable Blood Center',
    category: 'Charitable Trust',
    address: 'Demo Campus 3, Civil Lines',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110054',
    phone: '+91 11 2600 0002',
    email: 'northridge-demo@raktnavi.iitp.ac.in',
    operatingHours: '9:00 AM - 9:00 PM',
    description: 'Charitable blood donation and distribution center.'
  },
  {
    id: 'fac-blr-01',
    name: 'Silicon Valley Civic Blood Bank',
    category: 'Community Blood Center',
    address: 'Demo Layout 7th Main, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    phone: '+91 80 2500 0001',
    email: 'bengaluru-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Urban emergency blood coordination hub.'
  },
  {
    id: 'fac-blr-02',
    name: 'Deccan Memorial Blood Bank',
    category: 'Hospital Attached',
    address: 'Demo Circle, Jayanagar 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560011',
    phone: '+91 80 2500 0002',
    email: 'deccan-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Emergency blood supply unit for trauma care.'
  },
  {
    id: 'fac-mum-01',
    name: 'Coastal Harbor Memorial Blood Center',
    category: 'Hospital Attached Blood Bank',
    address: 'Demo Ocean Drive, Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400012',
    phone: '+91 22 2400 0001',
    email: 'mumbai-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Major medical center transfusion wing serving southern districts.'
  },
  {
    id: 'fac-kol-01',
    name: 'Heritage City Voluntary Blood Reserve',
    category: 'Voluntary Society',
    address: 'Demo Avenue, Park Street Area',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    phone: '+91 33 2200 0001',
    email: 'kolkata-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'Non-profit volunteer donor registry and component depot.'
  },
  {
    id: 'fac-lko-01',
    name: 'Awadh Regional Blood Transfusion Hub',
    category: 'Government Supported Blood Center',
    address: 'Demo Medical Campus, Chowk',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226003',
    phone: '+91 522 230 0001',
    email: 'lucknow-demo@raktnavi.iitp.ac.in',
    operatingHours: '24/7 Emergency Service',
    description: 'State emergency transfusion support facility.'
  }
];

// Helper to calculate realistic ISO timestamps relative to now
const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const INITIAL_DEMO_INVENTORY = [
  // Patna Central Red Cross
  {
    id: 'inv-001',
    facilityId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    city: 'Patna',
    address: 'Demo Block B, Bailey Road',
    phone: '+91 612 220 0001',
    bloodGroup: 'O+',
    unitsAvailable: 14,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(2),
    notes: 'Regular donor walk-in stock verified.'
  },
  {
    id: 'inv-002',
    facilityId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    city: 'Patna',
    address: 'Demo Block B, Bailey Road',
    phone: '+91 612 220 0001',
    bloodGroup: 'O-',
    unitsAvailable: 2,
    availabilityStatus: 'Critically Low',
    lastUpdated: minutesAgo(45),
    notes: 'High emergency demand. Reserve for immediate trauma.'
  },
  {
    id: 'inv-003',
    facilityId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    city: 'Patna',
    address: 'Demo Block B, Bailey Road',
    phone: '+91 612 220 0001',
    bloodGroup: 'A+',
    unitsAvailable: 9,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(4),
    notes: 'Adequate stock.'
  },
  {
    id: 'inv-004',
    facilityId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    city: 'Patna',
    address: 'Demo Block B, Bailey Road',
    phone: '+91 612 220 0001',
    bloodGroup: 'B+',
    unitsAvailable: 11,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(3),
    notes: 'Tested and cleared for distribution.'
  },
  {
    id: 'inv-005',
    facilityId: 'fac-patna-01',
    facilityName: 'Patna Central Red Cross Blood Center',
    city: 'Patna',
    address: 'Demo Block B, Bailey Road',
    phone: '+91 612 220 0001',
    bloodGroup: 'AB-',
    unitsAvailable: 1,
    availabilityStatus: 'Critically Low',
    lastUpdated: hoursAgo(12),
    notes: 'Rare group; contact blood bank doctor.'
  },

  // Magadh Medical Research
  {
    id: 'inv-006',
    facilityId: 'fac-patna-02',
    facilityName: 'Magadh Medical Research Blood Facility',
    city: 'Patna',
    address: 'Demo Sector 4, Kankarbagh',
    phone: '+91 612 220 0002',
    bloodGroup: 'A+',
    unitsAvailable: 7,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(6),
    notes: 'Component separated PRBC.'
  },
  {
    id: 'inv-007',
    facilityId: 'fac-patna-02',
    facilityName: 'Magadh Medical Research Blood Facility',
    city: 'Patna',
    address: 'Demo Sector 4, Kankarbagh',
    phone: '+91 612 220 0002',
    bloodGroup: 'B+',
    unitsAvailable: 3,
    availabilityStatus: 'Low Stock',
    lastUpdated: hoursAgo(28), // Needs reconfirmation (> 24h)
    notes: 'Last updated yesterday morning.'
  },
  {
    id: 'inv-008',
    facilityId: 'fac-patna-02',
    facilityName: 'Magadh Medical Research Blood Facility',
    city: 'Patna',
    address: 'Demo Sector 4, Kankarbagh',
    phone: '+91 612 220 0002',
    bloodGroup: 'O+',
    unitsAvailable: 0,
    availabilityStatus: 'Unavailable',
    lastUpdated: hoursAgo(32), // Needs reconfirmation (> 24h)
    notes: 'Exhausted during morning emergencies.'
  },

  // Nalanda Emergency Blood Reserve
  {
    id: 'inv-009',
    facilityId: 'fac-patna-03',
    facilityName: 'Nalanda Emergency Blood Reserve',
    city: 'Patna',
    address: 'Demo Lane 12, Rajendra Nagar',
    phone: '+91 612 220 0003',
    bloodGroup: 'A-',
    unitsAvailable: 4,
    availabilityStatus: 'Low Stock',
    lastUpdated: hoursAgo(16),
    notes: 'Screened units available.'
  },
  {
    id: 'inv-010',
    facilityId: 'fac-patna-03',
    facilityName: 'Nalanda Emergency Blood Reserve',
    city: 'Patna',
    address: 'Demo Lane 12, Rajendra Nagar',
    phone: '+91 612 220 0003',
    bloodGroup: 'AB+',
    unitsAvailable: 8,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(84), // Stale (> 72h)
    notes: 'Last count from weekend batch.'
  },

  // Capital Metropolitan Blood Bank (New Delhi)
  {
    id: 'inv-011',
    facilityId: 'fac-delhi-01',
    facilityName: 'Capital Metropolitan Blood Bank',
    city: 'New Delhi',
    address: 'Demo Health Enclave, Ansari Nagar',
    phone: '+91 11 2600 0001',
    bloodGroup: 'O+',
    unitsAvailable: 26,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(1),
    notes: 'High capacity automated facility.'
  },
  {
    id: 'inv-012',
    facilityId: 'fac-delhi-01',
    facilityName: 'Capital Metropolitan Blood Bank',
    city: 'New Delhi',
    address: 'Demo Health Enclave, Ansari Nagar',
    phone: '+91 11 2600 0001',
    bloodGroup: 'O-',
    unitsAvailable: 5,
    availabilityStatus: 'Low Stock',
    lastUpdated: hoursAgo(3),
    notes: 'Universal donor PRBC units.'
  },
  {
    id: 'inv-013',
    facilityId: 'fac-delhi-01',
    facilityName: 'Capital Metropolitan Blood Bank',
    city: 'New Delhi',
    address: 'Demo Health Enclave, Ansari Nagar',
    phone: '+91 11 2600 0001',
    bloodGroup: 'B-',
    unitsAvailable: 2,
    availabilityStatus: 'Critically Low',
    lastUpdated: hoursAgo(7),
    notes: 'Priority reservation required.'
  },
  {
    id: 'inv-014',
    facilityId: 'fac-delhi-02',
    facilityName: 'North Ridge Charitable Blood Center',
    city: 'New Delhi',
    address: 'Demo Campus 3, Civil Lines',
    phone: '+91 11 2600 0002',
    bloodGroup: 'B+',
    unitsAvailable: 14,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(90), // Stale (> 72h)
    notes: 'Volunteer batch update.'
  },

  // Silicon Valley Civic (Bengaluru)
  {
    id: 'inv-015',
    facilityId: 'fac-blr-01',
    facilityName: 'Silicon Valley Civic Blood Bank',
    city: 'Bengaluru',
    address: 'Demo Layout 7th Main, Koramangala',
    phone: '+91 80 2500 0001',
    bloodGroup: 'O+',
    unitsAvailable: 19,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(2),
    notes: 'Freshly replenished.'
  },
  {
    id: 'inv-016',
    facilityId: 'fac-blr-01',
    facilityName: 'Silicon Valley Civic Blood Bank',
    city: 'Bengaluru',
    address: 'Demo Layout 7th Main, Koramangala',
    phone: '+91 80 2500 0001',
    bloodGroup: 'O-',
    unitsAvailable: 1,
    availabilityStatus: 'Critically Low',
    lastUpdated: minutesAgo(20),
    notes: 'Immediate need for replacement donors.'
  },
  {
    id: 'inv-017',
    facilityId: 'fac-blr-02',
    facilityName: 'Deccan Memorial Blood Bank',
    city: 'Bengaluru',
    address: 'Demo Circle, Jayanagar 4th Block',
    phone: '+91 80 2500 0002',
    bloodGroup: 'A-',
    unitsAvailable: 3,
    availabilityStatus: 'Low Stock',
    lastUpdated: hoursAgo(36), // Needs reconfirmation
    notes: 'Awaiting laboratory batch clearance.'
  },

  // Coastal Harbor (Mumbai)
  {
    id: 'inv-018',
    facilityId: 'fac-mum-01',
    facilityName: 'Coastal Harbor Memorial Blood Center',
    city: 'Mumbai',
    address: 'Demo Ocean Drive, Parel',
    phone: '+91 22 2400 0001',
    bloodGroup: 'A+',
    unitsAvailable: 15,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(5),
    notes: 'Component separation functional.'
  },
  {
    id: 'inv-019',
    facilityId: 'fac-mum-01',
    facilityName: 'Coastal Harbor Memorial Blood Center',
    city: 'Mumbai',
    address: 'Demo Ocean Drive, Parel',
    phone: '+91 22 2400 0001',
    bloodGroup: 'AB-',
    unitsAvailable: 0,
    availabilityStatus: 'Unavailable',
    lastUpdated: hoursAgo(42), // Needs reconfirmation
    notes: 'Stock depleted.'
  },

  // Heritage City (Kolkata)
  {
    id: 'inv-020',
    facilityId: 'fac-kol-01',
    facilityName: 'Heritage City Voluntary Blood Reserve',
    city: 'Kolkata',
    address: 'Demo Avenue, Park Street Area',
    phone: '+91 33 2200 0001',
    bloodGroup: 'B+',
    unitsAvailable: 10,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(8),
    notes: 'Tested negative for all transfusion pathogens.'
  },

  // Awadh Regional (Lucknow)
  {
    id: 'inv-021',
    facilityId: 'fac-lko-01',
    facilityName: 'Awadh Regional Blood Transfusion Hub',
    city: 'Lucknow',
    address: 'Demo Medical Campus, Chowk',
    phone: '+91 522 230 0001',
    bloodGroup: 'O+',
    unitsAvailable: 12,
    availabilityStatus: 'Available',
    lastUpdated: hoursAgo(9),
    notes: 'Available for regional requisition.'
  }
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AVAILABILITY_STATUSES = [
  'All Statuses',
  'Available',
  'Low Stock',
  'Critically Low',
  'Unavailable'
];
