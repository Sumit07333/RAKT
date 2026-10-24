# RaktNavi — Functional Requirements Document (FRD)

**Project Name:** RaktNavi  
**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026  
**Tagline:** Find Blood Availability Faster. Connect When It Matters.  
**Subtitle:** Cloud-Based Blood Availability & Emergency Request Management System  

---

## 1. Problem Statement & Motivation
During medical emergencies, patients and caretakers struggle to locate timely blood availability information across regional hospitals and blood banks. The process often relies on frantic phone calls, unverified social media leads, and outdated bulletin boards. 

**RaktNavi** addresses this information discovery friction by providing:
1. Fast, centralized indexing of listed blood availability by blood group and city.
2. Prominent **Information Freshness Indicators** to inform users when a record was last updated and when direct re-confirmation is essential.
3. An emergency request intake and tracking system with unique demo reference codes (`RN-DEMO-XXXXXX`).
4. An authorized facility operator interface for updating inventory and responding to emergency requests.

---

## 2. Important Limitations & Disclaimers
- **Notice:** `DEMO DATA — NOT LIVE AVAILABILITY`.
- RaktNavi does not collect, supply, transport, process, or guarantee blood units.
- The platform is an information management and routing system. It does not provide medical diagnosis, cross-matching suitability, or treatment advice.
- Users must always contact listed facilities directly to verify availability before travel.
- Contact numbers and facility addresses in demo mode are synthetic placeholders.

---

## 3. User Roles & Use Cases

### 3.1 Public Users / Emergency Requesters
- **UC-01 (Search Inventory):** Search blood availability by city, blood group (A+, A-, B+, B-, AB+, AB-, O+, O-), and availability status.
- **UC-02 (View Facility Details):** View detailed facility cards including complete listed inventory table, address, operating hours, phone link, and freshness warning.
- **UC-03 (Submit Emergency Request):** Fill out an emergency request form with required fields (requester name, 10-digit Indian mobile number, city, required blood group, units needed, urgency, notes).
- **UC-04 (Track Emergency Request):** Look up request status by reference code (`RN-DEMO-XXXXXX`) and view chronological timeline of events (Pending -> Contacted -> Fulfilled / Cancelled).
- **UC-05 (Learn About Project & System Limits):** Read the transparency statement and academic project overview.

### 3.2 Facility Operators & Blood Bank Administrators
- **UC-06 (Operator Authentication):** Log in to the operator portal (demo-mode login simulation for frontend stage).
- **UC-07 (Dashboard Overview):** View real-time KPI metrics (total records, low-stock alerts, stale inventory warnings, pending requests).
- **UC-08 (Manage Blood Inventory):** Filter, search, add, edit, and update availability status and quantities for blood groups with automatic timestamping.
- **UC-09 (Manage Emergency Requests):** Review incoming emergency requests, update status (Pending -> Contacted -> Fulfilled -> Cancelled), and record operational notes.
- **UC-10 (Audit Activity):** View real-time log of operator actions during the session.

---

## 4. System & Interface Requirements

### 4.1 Visual Design & Identity
- **Primary Red:** `#C41315` (urgent actions, logo mark, critical badges)
- **Deep Navy:** `#273741` (headings, navigation, professional contrast)
- **Interactive Bright Red:** `#E82A25` (hover states, interactive highlights)
- **Backgrounds:** Pure White (`#FFFFFF`) and Light Blue-Gray (`#EEF2F4`)
- **Typography:** Modern clean sans-serif (`Inter` with system fallback)

### 4.2 Data Freshness Tiers
- **Recently Updated (< 24 hrs):** Active green badge. Listed recently; reconfirmation still advised.
- **Needs Reconfirmation (24 - 72 hrs):** Amber warning. Record may have changed. Direct call recommended.
- **Stale (> 72 hrs):** Dark amber/red badge. Facility must be called before taking action.
- **Timestamp Unavailable:** Neutral badge indicating unverified update time.

### 4.3 Error & Offline Resilience
- Seamless client-side demo dataset when `VITE_DEMO_MODE=true` or backend is unreachable.
- Explicit notification when operating in Demo Mode.
- No silent fallback if API mode is explicitly requested and fails.
