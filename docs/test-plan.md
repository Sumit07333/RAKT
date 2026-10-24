# RaktNavi — Test Plan & Quality Assurance Protocol

**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026  
**Product:** RaktNavi Frontend Web Application

---

## 1. Test Objectives & Scope
The test suite validates:
1. Routing integrity across all 8 core application views.
2. Filter & search accuracy against normalized city names and blood groups.
3. Form validation rules (10-digit Indian phone format, required fields, unit counts).
4. Request creation and tracking flow in Demo Mode.
5. Operator dashboard inventory modification and request status transitions.
6. Responsive layout compliance across mobile (360px, 390px), tablet (768px), laptop (1024px), and desktop (1440px).
7. Accessibility, focus visibility, keyboard navigation, and semantic HTML elements.
8. Prominent display of "DEMO DATA — NOT LIVE AVAILABILITY" notices.

---

## 2. Test Cases Matrix

| Test ID | Area | Action / Scenario | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-01** | Navigation | Click navigation links (Home, Find Blood, How It Works, About, Emergency Request, Operator) | Routes transition smoothly without page reload; active nav link highlighted. |
| **TC-02** | Quick Search | Enter city "Patna", select "O+", click Search | Redirects to `/find-blood?city=Patna&bloodGroup=O%2B` with matching records. |
| **TC-03** | Filter Reset | Filter by blood group "AB-" on `/find-blood` and click "Clear Filters" | Search inputs reset, full inventory reappears. |
| **TC-04** | Facility View | Click on "Patna Central Red Cross" card | Navigates to `/facilities/fac-patna-01`, displays facility details and full blood group breakdown. |
| **TC-05** | Invalid Facility | Navigate to `/facilities/fac-non-existent-99` | Displays friendly "Facility Not Found" empty state with return button. |
| **TC-06** | Request Validation | Submit empty emergency request form | Red inline validation messages appear; form submission blocked. |
| **TC-07** | Phone Validation | Enter invalid phone `12345` on emergency request | Validation error: "Please enter a valid 10-digit mobile number". |
| **TC-08** | Request Flow | Submit valid emergency request | Displays confirmation modal/screen with reference code `RN-DEMO-XXXXXX`. |
| **TC-09** | Request Tracking | Input valid code `RN-DEMO-782194` into `/track-request` | Displays current status ("Pending") and timeline. |
| **TC-10** | Invalid Code | Input non-existent code `RN-DEMO-999999` into `/track-request` | Displays "Request Not Found" message with suggestion to verify code. |
| **TC-11** | Freshness Badge | Inspect inventory updated 2 hours ago vs. 80 hours ago | 2h shows green "Recently Updated"; 80h shows amber "Stale (>72h)". |
| **TC-12** | Operator Modal | Open Add/Edit Inventory modal in `/operator/dashboard` and update units | Unit count updates in table and KPI metrics recalculate. |
| **TC-13** | Operator Status | Change request status from "Pending" to "Contacted" | Status updates in memory and creates audit log entry. |
| **TC-14** | Mobile Nav | Shrink viewport to 375px and toggle mobile menu | Hamburger menu opens with full navigation links; closes on selection. |
| **TC-15** | Accessibility | Navigate via Tab key across forms and links | Focus ring clearly visible; all buttons accessible via Enter/Space. |
