# RaktNavi — User & Operator Guide

**Product:** RaktNavi (Cloud-Based Blood Availability & Emergency Request Management System)  
**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026

---

## 1. Getting Started

### 1.1 Prerequisites
- Node.js version 18+ (verified on Node v24.11.1)
- npm version 9+ (verified on npm 11.16.0)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 1.2 Running the Application Locally
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 2. Public User Guide

### 2.1 Searching for Blood Availability
1. Navigate to the **Home Page** (`/`) or **Find Blood** (`/find-blood`).
2. Enter your city (e.g. `Patna`, `Delhi`, `Bengaluru`).
3. Select your target blood group (e.g. `O+`, `AB-`, `B+`).
4. Click **Search**.
5. The results list displays all listed facilities, available units, and **Freshness Badges**:
   - **Green (Recently Updated):** Updated within the last 24 hours.
   - **Yellow/Amber (Needs Reconfirmation):** Updated 24 to 72 hours ago.
   - **Red/Dark Amber (Stale):** Updated more than 72 hours ago.
6. **Important:** Click the phone button to call the facility and verify actual stock before travelling.

### 2.2 Submitting an Emergency Request
1. Click **Emergency Request** in the navigation bar or from a facility card.
2. Fill in:
   - Patient or Requester Name.
   - Contact Phone (10 digits).
   - City.
   - Required Blood Group and number of units.
   - Urgency Level (*Normal*, *Urgent*, *Immediate / Critical*).
   - Optional facility preference and clinical notes.
3. Click **Submit Emergency Request**.
4. A unique reference code will be generated (e.g. `RN-DEMO-782194`). Save this code.

### 2.3 Tracking an Emergency Request
1. Click **Track Request** (`/track-request`).
2. Enter your reference code (e.g. `RN-DEMO-782194`).
3. View the current status:
   - **Pending:** Received in the queue.
   - **Contacted:** Facility or operator has reached out to verify availability.
   - **Fulfilled:** Units arranged.
   - **Cancelled:** Requisition withdrawn or resolved.
4. Review the timeline of events.

---

## 3. Operator Guide (Authorized Blood Bank Portal)

### 3.1 Operator Login
1. Click **Operator Login** in the footer or visit `/operator/login`.
2. For the demo presentation, use any test email (e.g. `operator@raktnavi.iitp.ac.in`) and any sample password.
3. Click **Sign In (Demo Mode)**.

### 3.2 Managing Blood Inventory
1. In the **Operator Dashboard** (`/operator/dashboard`), view summary KPIs:
   - Total Listed Records
   - Low Stock Alerts (< 5 units)
   - Stale Inventory (> 24 hours unconfirmed)
   - Pending Emergency Requests
2. Under the **Blood Inventory** tab:
   - Click **Add / Update Inventory Record**.
   - Select Facility, Blood Group, Units, and Status.
   - Click **Save Record**. The list and metrics update immediately in memory.

### 3.3 Managing Emergency Requests
1. Switch to the **Emergency Requests** tab on the dashboard.
2. Review pending requests from citizens.
3. Click **Update Status** to advance requests from *Pending* to *Contacted* or *Fulfilled*.
4. All updates are logged in the **Live Audit Activity** pane.
