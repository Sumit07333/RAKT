-- RaktNavi Database Demo Data & Schema Definition
-- Cloud-Based Blood Availability & Emergency Request Management System
-- Academic Context: IIT Patna - Cloud Computing Team Project - 2026
-- NOTICE: SYNTHETIC DEMONSTRATION DATA ONLY - NOT REAL PATIENT OR LIVE BLOOD INVENTORY

CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Blood Bank',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    helpline_email VARCHAR(100),
    operating_hours VARCHAR(100) DEFAULT '24/7 Emergency Service',
    is_demo_record BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_inventory (
    id VARCHAR(50) PRIMARY KEY,
    facility_id VARCHAR(50) REFERENCES facilities(id) ON DELETE CASCADE,
    blood_group VARCHAR(5) NOT NULL,
    units_available INT NOT NULL DEFAULT 0,
    availability_status VARCHAR(50) NOT NULL, -- 'Available', 'Low Stock', 'Critically Low', 'Unavailable'
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    freshness_category VARCHAR(50) DEFAULT 'Recently Updated',
    verification_notes TEXT DEFAULT 'Demo inventory record for academic evaluation'
);

CREATE TABLE IF NOT EXISTS emergency_requests (
    id VARCHAR(50) PRIMARY KEY,
    request_code VARCHAR(30) UNIQUE NOT NULL,
    requester_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    city VARCHAR(100) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_required INT NOT NULL DEFAULT 1,
    facility_preference_id VARCHAR(50) REFERENCES facilities(id),
    urgency_level VARCHAR(30) NOT NULL, -- 'Normal', 'Urgent', 'Immediate / Critical'
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Contacted', 'Fulfilled', 'Cancelled'
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS request_timeline_events (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES emergency_requests(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Demo Facilities
INSERT INTO facilities (id, name, category, address, city, state, pincode, contact_phone, helpline_email, operating_hours)
VALUES
('fac-patna-01', 'Patna Central Red Cross Blood Center', 'Regional Blood Bank', 'Demo Block B, Bailey Road', 'Patna', 'Bihar', '800001', '+91 612 2200001', 'patna-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-patna-02', 'Magadh Medical Research Blood Facility', 'Hospital Attached', 'Demo Sector 4, Kankarbagh', 'Patna', 'Bihar', '800020', '+91 612 2200002', 'magadh-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-delhi-01', 'Capital Metropolitan Blood Bank', 'Autonomous Blood Bank', 'Demo Health Enclave, Ansari Nagar', 'New Delhi', 'Delhi', '110029', '+91 11 26000001', 'delhi-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-delhi-02', 'North Ridge Charitable Blood Center', 'Charitable Trust', 'Demo Campus 3, Civil Lines', 'New Delhi', 'Delhi', '110054', '+91 11 26000002', 'northridge-demo@raktnavi.iitp.ac.in', '8:00 AM - 10:00 PM'),
('fac-blr-01', 'Silicon Valley Civic Blood Bank', 'Community Blood Center', 'Demo Layout 7th Main, Koramangala', 'Bengaluru', 'Karnataka', '560034', '+91 80 25000001', 'bengaluru-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-mum-01', 'Coastal Harbor Memorial Blood Center', 'Hospital Attached', 'Demo Ocean Drive, Parel', 'Mumbai', 'Maharashtra', '400012', '+91 22 24000001', 'mumbai-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-kol-01', 'Heritage City Voluntary Blood Reserve', 'Voluntary Society', 'Demo Avenue, Park Street Area', 'Kolkata', 'West Bengal', '700016', '+91 33 22000001', 'kolkata-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service'),
('fac-lko-01', 'Awadh Regional Blood Transfusion Hub', 'Government Supported', 'Demo Medical Campus, Chowk', 'Lucknow', 'Uttar Pradesh', '226003', '+91 522 2300001', 'lucknow-demo@raktnavi.iitp.ac.in', '24/7 Emergency Service')
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Inventory
INSERT INTO blood_inventory (id, facility_id, blood_group, units_available, availability_status, last_updated)
VALUES
('inv-001', 'fac-patna-01', 'O+', 14, 'Available', NOW() - INTERVAL '2 hours'),
('inv-002', 'fac-patna-01', 'O-', 3, 'Critically Low', NOW() - INTERVAL '1 hour'),
('inv-003', 'fac-patna-01', 'A+', 9, 'Available', NOW() - INTERVAL '4 hours'),
('inv-004', 'fac-patna-01', 'B+', 12, 'Available', NOW() - INTERVAL '3 hours'),
('inv-005', 'fac-patna-01', 'AB-', 1, 'Critically Low', NOW() - INTERVAL '12 hours'),
('inv-006', 'fac-patna-02', 'A+', 7, 'Available', NOW() - INTERVAL '6 hours'),
('inv-007', 'fac-patna-02', 'B+', 2, 'Low Stock', NOW() - INTERVAL '26 hours'),
('inv-008', 'fac-patna-02', 'O+', 0, 'Unavailable', NOW() - INTERVAL '30 hours'),
('inv-009', 'fac-delhi-01', 'O+', 22, 'Available', NOW() - INTERVAL '1 hour'),
('inv-010', 'fac-delhi-01', 'A-', 4, 'Low Stock', NOW() - INTERVAL '5 hours'),
('inv-011', 'fac-delhi-01', 'B-', 2, 'Critically Low', NOW() - INTERVAL '18 hours'),
('inv-012', 'fac-delhi-02', 'AB+', 8, 'Available', NOW() - INTERVAL '80 hours'), -- Stale
('inv-013', 'fac-blr-01', 'O+', 18, 'Available', NOW() - INTERVAL '3 hours'),
('inv-014', 'fac-blr-01', 'O-', 1, 'Critically Low', NOW() - INTERVAL '15 minutes'),
('inv-015', 'fac-blr-01', 'B+', 15, 'Available', NOW() - INTERVAL '2 hours'),
('inv-016', 'fac-mum-01', 'A+', 11, 'Available', NOW() - INTERVAL '4 hours'),
('inv-017', 'fac-mum-01', 'AB-', 0, 'Unavailable', NOW() - INTERVAL '48 hours'),
('inv-018', 'fac-kol-01', 'B+', 9, 'Available', NOW() - INTERVAL '5 hours'),
('inv-019', 'fac-kol-01', 'O+', 6, 'Available', NOW() - INTERVAL '10 hours'),
('inv-020', 'fac-lko-01', 'O+', 10, 'Available', NOW() - INTERVAL '7 hours')
ON CONFLICT (id) DO NOTHING;

-- Seed Demo Emergency Requests
INSERT INTO emergency_requests (id, request_code, requester_name, contact_phone, city, blood_group, units_required, facility_preference_id, urgency_level, status, additional_notes)
VALUES
('req-001', 'RN-DEMO-782194', 'Demo Guardian Rajesh', '+91 98765 43210', 'Patna', 'O-', 2, 'fac-patna-01', 'Immediate / Critical', 'Pending', 'Emergency surgery standby at regional hospital (Demo simulation).'),
('req-002', 'RN-DEMO-649102', 'Demo Relative Priya', '+91 91234 56789', 'Patna', 'A+', 1, 'fac-patna-02', 'Urgent', 'Contacted', 'Verified facility contact initiated. Awaiting confirmation.'),
('req-003', 'RN-DEMO-310574', 'Demo Volunteer Amit', '+91 99887 76655', 'New Delhi', 'B+', 2, 'fac-delhi-01', 'Normal', 'Fulfilled', 'Patient successfully assisted through alternative facility matching.')
ON CONFLICT (id) DO NOTHING;

-- Seed Request Timeline Events
INSERT INTO request_timeline_events (request_id, status, description, event_timestamp)
VALUES
('req-001', 'Pending', 'Emergency request submitted into RaktNavi demo queue.', NOW() - INTERVAL '2 hours'),
('req-002', 'Pending', 'Emergency request logged in demo database.', NOW() - INTERVAL '5 hours'),
('req-002', 'Contacted', 'Operator contacted listed facility to cross-verify listed stock.', NOW() - INTERVAL '3 hours'),
('req-003', 'Pending', 'Request initiated by voluntary attendant.', NOW() - INTERVAL '24 hours'),
('req-003', 'Contacted', 'Partner facility confirmed unit reservation for demo.', NOW() - INTERVAL '18 hours'),
('req-003', 'Fulfilled', 'Requisition marked complete in demonstration tracker.', NOW() - INTERVAL '6 hours');
