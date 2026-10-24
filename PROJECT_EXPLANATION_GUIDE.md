# RaktNavi (रक्तनवी) — Complete Project Guide & Documentation

> **Tagline:** Find Blood Availability Faster. Connect When It Matters.  
> **Project Type:** Cloud-Based Blood Availability & Emergency Request Management System  
> **Academic Context:** IIT Patna — Department of Computer Science & Engineering (2026)  
> **Language:** Simple Hinglish (Easy to understand for viva, review, and presentation)

---

## 📑 Table of Contents (विषय सूची)
1. [Project Ka Parichay (Introduction & Problem Solved)](#1-project-ka-parichay)
2. [Tech Stack (Kaunsi cheez kis technology se bani hai)](#2-tech-stack)
3. [Folder Structure (Folder aur file ka naksha)](#3-folder-structure)
4. [Humne Kya-Kya Naya Banaya Aur Fix Kiya (AI Updates)](#4-humne-kya-kya-naya-banaya-aur-fix-kiya)
5. [Frontend Components & Features Ki Detail](#5-frontend-components--features)
6. [Backend (FastAPI) APIs & Services Ki Detail](#6-backend-fastapi-apis--services)
7. [Database Architecture & Models](#7-database-architecture--models)
8. [End-to-End Workflow (Data kaise travel karta hai)](#8-end-to-end-workflow)
9. [Deployment Guide (GitHub & Vercel Fixes)](#9-deployment-guide)
10. [Viva & Project Presentation FAQs](#10-viva--project-presentation-faqs)

---

## 1. Project Ka Parichay

### Real-world Problem Kya Hai?
Jab kisi hospital me patient ko emergency me khoon ya platelets ki zaroorat hoti hai, toh parivaar walo ke paas koi central verified platform nahi hota. Log kya karte hain:
- 10-15 alag-alag hospitals/blood banks me phone ghumate hain (jisme line busy hoti hai ya koi uthata nahi).
- WhatsApp groups ya Twitter/X par post daalte hain, jaha 2-3 din purane messages ghumte rehte hain.
- Jab tak sahi jagah khoon milta hai, tab tak bohot der ho chuki hoti hai.

### RaktNavi Ka Solution:
1. **Single Discovery Portal:** Ek hi jagah par apne City aur Blood Group (e.g. `O+`, `B-`, `AB+`) ke hisaab se live stock dekhna.
2. **Data Freshness Engine:** Sirf yeh nahi batana ki blood hai ya nahi, balki yeh batana ki **data kitna purana hai** (Green = <24h fresh, Yellow = 24-72h reconfirm karein, Red = >72h purana/stale).
3. **Emergency Intake & Tracking:** Agar stock nahi mil raha, toh turant online emergency request raise karna. System ek unique 6-digit tracking code (`RN-XXXXXX`) deta hai jisse live status pata chalta hai.
4. **1-Click WhatsApp Broadcast:** Patient ke parivaar ke liye verified tracking link ke sath WhatsApp par turant broadcast karne ka button.
5. **Operator Portal:** Blood bank staff ke liye admin dashboard jaha se wo stock units update kar sakte hain aur patient ki requests ko coordinate kar sakte hain.

---

## 2. Tech Stack

| Layer | Technology | Kis Kaam Ke Liye Use Hua? |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19** + **Vite 8** | Modern, ultra-fast Single Page Application (SPA). |
| **Styling** | **Tailwind CSS** | Clean healthcare design tokens (Deep Navy `#273741`, Emergency Red `#C41315`). |
| **Icons** | **Lucide React** | Medical, navigation, phone, aur dashboard ke sharp icons. |
| **Routing** | **React Router v7** | Bina page reload kiye alag-alag screens par switch karna. |
| **Backend API** | **Python 3.11+ / FastAPI** | Asynchronous, fast REST API jo requests aur stock handle karta hai. |
| **Database ORM** | **SQLAlchemy 2.0** | Python objects ko SQL queries me convert karne ke liye. |
| **Database** | **PostgreSQL 15** | Relational database (hospitals, stock, emergency requests). |
| **Data Validation** | **Pydantic v2** | Phone numbers, blood groups, aur email formats ko validate karne ke liye. |
| **Deployment** | **Vercel** + **GitHub** | Online free live hosting and version control. |

---

## 3. Folder Structure

```text
RaktNavi_web-main/
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI Pieces
│   │   │   ├── common/              # Buttons, Badges, Input fields, Stat cards
│   │   │   ├── dashboard/           # InventoryModal, RequestStatusModal, AuditPanel
│   │   │   ├── inventory/           # InventoryCard, InventoryFilters, InventoryTable
│   │   │   ├── navigation/          # Navbar, Footer
│   │   │   └── requests/            # RequestForm, RequestStatusBadge, RequestTimeline
│   │   ├── pages/                   # Main Screens
│   │   │   ├── LandingPage.jsx      # Home Screen (Search widget, stats)
│   │   │   ├── BloodSearchPage.jsx  # Search & Filter with Grid/Table view
│   │   │   ├── FacilityDetailsPage  # Hospital profile & 8-group stock matrix
│   │   │   ├── EmergencyRequestPage # Patient Request Intake Form
│   │   │   ├── TrackRequestPage.jsx # Tracking code search & Live Timeline
│   │   │   ├── OperatorLoginPage    # Operator sign-in
│   │   │   └── OperatorDashboard    # Admin stock update & request queue
│   │   ├── services/                # Data Bridge (API calls + Local persistence)
│   │   │   ├── inventoryService.js  # Search & stock update functions
│   │   │   ├── requestService.js    # Create request & timeline status functions
│   │   │   ├── authService.js       # Operator login & token management
│   │   │   └── apiClient.js         # Central fetch wrapper
│   │   ├── utils/
│   │   │   ├── freshness.js         # Data Freshness calculation engine
│   │   │   ├── validation.js        # Indian mobile & email regex validation
│   │   │   └── formatDate.js        # Relative dates (e.g. "2 hours ago")
│   │   ├── App.jsx                  # React Router routes setup
│   │   └── index.css                # Tailwind CSS classes
│   ├── vercel.json                  # SPA routing fallback fix for Vercel
│   └── package.json                 # Dependencies & scripts
├── backend/                         # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/                  # Endpoints
│   │   │   ├── facilities.py        # Hospital listing & details
│   │   │   ├── blood_availability.py# Stock search with stale check
│   │   │   ├── emergency_requests.py# Request intake & PII-masked tracking
│   │   │   ├── auth.py              # Operator authentication
│   │   │   ├── admin.py             # Operator request queue & stock updates
│   │   │   └── router.py            # Combined API router
│   │   ├── models/                  # Database Entities (SQLAlchemy 2.0)
│   │   ├── repositories/            # Database Queries (CRUD)
│   │   ├── schemas/                 # Pydantic v2 DTOs
│   │   ├── services/                # Business Logic
│   │   ├── database.py              # DB Engine & SessionLocal
│   │   └── main.py                  # FastAPI app, CORS, Body limits & health
│   ├── tests/                       # Pytest automated test cases
│   └── requirements.txt             # Python dependencies
├── database/
│   └── seed_demo_data.sql           # Schema & pre-seeded demo hospitals
└── README.md                        # Project documentation
```

---

## 4. Humne Kya-Kya Naya Banaya Aur Fix Kiya (AI Updates)

Pehle is project me sirf frontend ka basic layout tha aur backend me sirf public search thi. Aaj humne isme yeh bade badlaav kiye:

1. **Operator / Admin Backend Banaya:**
   - `auth.py`: Operator login, session token generation.
   - `admin.py`: Operator dashboard ke liye requests fetch karna, status (`Pending` → `Contacted` → `Fulfilled`) update karna aur stock unit update karna.
2. **Permanent Data Persistence (`localStorage` Sync):**
   - Pehle refresh karne par naya data delete ho jata tha. Humne `requestService.js` aur `inventoryService.js` me `localStorage` sync laga diya jisse data hamesha permanently save rehta hai.
3. **"📍 Use My Location" (GPS Auto-detect):**
   - User ke browser se GPS latitude/longitude nikal kar nearest city (Patna, Delhi, Mumbai, Bengaluru, etc.) auto-detect karne ka feature joda.
4. **"📲 Broadcast on WhatsApp" Feature:**
   - Request submit hone par 1-click me verified details ke sath WhatsApp share link generate karne ka feature banaya.
5. **Vercel 404 Routing Fix (`vercel.json`):**
   - Vercel par refresh karne par "This page doesn't exist" (404) aata tha. Humne SPA rewrites rule set karke ise permanently fix kiya.
6. **Linux Platform Fix for Vercel:**
   - Windows binding (`@rolldown/binding-win32-x64-msvc`) ko `optionalDependencies` me move kiya taaki Vercel Linux par bina kisi crash ke deploy ho sake.

---

## 5. Frontend Components & Features

### A. Data Freshness Engine (`frontend/src/utils/freshness.js`)
* **Function:** `evaluateFreshness(timestamp)`
* **Kaise kaam karta hai:**
  - Current time aur record ke `last_updated` time ka difference nikalta hai.
  - **< 24 Hours:** `Recently Updated` (Green badge - Stock fresh hai).
  - **24h - 72h:** `Needs Reconfirmation` (Yellow badge - Hospital me call karke confirm karein).
  - **> 72 Hours:** `Stale (> 72h)` (Red badge - Stock change hone ki high possibility hai).
  - **Future Timestamp:** `Clock Desynchronized`.

### B. Emergency Request & Validation (`frontend/src/utils/validation.js`)
* **Phone Validation (`validateIndianPhone`):**
  - Regex: `^(?:\+91|91|0)?[6-9]\d{9}$`
  - Yeh check karta hai ki number 10 digits ka ho aur 6, 7, 8, ya 9 se start ho.
* **Units Validation (`validateUnits`):**
  - 1 se 20 units ke beech ka positive whole number hona chahiye.

### C. Live Tracking & Privacy Protection (`TrackRequestPage.jsx`)
* **Tracking Code Generator:** Python/JS `secrets` module se unguessable code banata hai (jaise `RN-782194`).
* **PII Masking:** Kisi patient ki private details leak na ho, isliye public page par:
  - Phone: `+91 98765 43210` → `+91 98*** ***10`
  - Name: `Rajesh Sharma` → `Rajesh S***`

### D. Operator Dashboard (`OperatorDashboardPage.jsx`)
* Blood bank staff ke liye console:
  - **Stat Cards:** Total units, Low stock alerts, Pending requests, Freshness score.
  - **Inventory Modal:** Kisi bhi blood group ke units badhana/ghatana.
  - **Request Status Modal:** Request ka status `Contacted` ya `Fulfilled` karna aur timeline me coordinator note add karna.
  - **Audit Activity Panel:** Session me kiye gaye har badlaav ka live log.

---

## 6. Backend (FastAPI) APIs & Services

FastAPI backend me **Clean Architecture** use ki gayi hai:

1. **`GET /health`:** Database connection verify karta hai (`SELECT 1;`).
2. **`GET /api/v1/facilities`:** Verified hospitals ki list deta hai (city filter supported).
3. **`GET /api/v1/facilities/{id}`:** Hospital details aur uske 8 blood groups ka stock deta hai.
4. **`GET /api/v1/blood-availability`:** City aur blood group ke hisaab se stock search karta hai aur staleness calculate karta hai.
5. **`POST /api/v1/emergency-requests`:** Nayi emergency request database me save karta hai aur `RN-XXXXXX` code deta hai.
6. **`GET /api/v1/emergency-requests/{code}`:** Public tracking status aur chronological audit timeline deta hai (Masked PII ke sath).
7. **`POST /api/v1/auth/login`:** Operator email/password verify karke session token deta hai.
8. **`GET /api/v1/admin/requests`:** Hospital coordinators ke liye unmasked contact info ke sath requests ki list deta hai.
9. **`PATCH /api/v1/admin/requests/{id}`:** Request ka status update karta hai aur timeline event insert karta hai.
10. **`PATCH /api/v1/admin/inventory/{id}` & `POST /api/v1/admin/inventory`:** Blood stock units update karta hai aur timestamp refresh karta hai.

---

## 7. Database Architecture & Models

PostgreSQL me 4 primary relational tables hain:

1. **`facilities`:**
   - `id` (PK), `name`, `category`, `address`, `city`, `state`, `pincode`, `contact_phone`, `operating_hours`, `is_active`.
2. **`blood_inventory`:**
   - `id` (PK), `facility_id` (FK), `blood_group` (A+, B+, etc.), `units_available` (nullable - unverified stock ko zero nahi mante), `availability_status`, `last_updated`, `freshness_category`.
   - Unique Constraint: `(facility_id, blood_group)` - ek hospital me ek group ka ek hi entry hoti hai.
3. **`emergency_requests`:**
   - `id` (PK), `tracking_reference` (Unique, non-sequential), `requester_name`, `contact_phone`, `city`, `blood_group`, `units_required`, `urgency_level`, `status`.
4. **`request_timeline_events`:**
   - `id` (PK), `request_id` (FK), `status`, `description`, `event_timestamp`.

---

## 8. End-to-End Workflow

```text
[ Patient / User ]
       │
       ▼ (1. Search Blood: City = "Patna", Group = "O+")
[ BloodSearchPage ] ───► Evaluates Data Freshness (<24h Green, >72h Red)
       │
       ▼ (2. Stock Kam Hai -> Fill Emergency Request)
[ RequestForm ] ───────► Validates Phone (+91) & Generates Code (RN-782194)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
[ Broadcast on WhatsApp ]  [ TrackRequestPage ]   [ Operator Dashboard ]
(Share link with donors)   (See live timeline)    (Staff updates status to
                                                   "Contacted" / "Fulfilled")
```

---

## 9. Deployment Guide

### A. Local Machine Par Run Karna:
```powershell
# Frontend chalana:
cd frontend
npm install
npm run dev
# Browser me: http://localhost:5173

# Backend chalana:
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Swagger API docs: http://localhost:8000/docs
```

### B. Vercel Hosting & SPA Fix:
React Router Single Page Applications me jab koi `/find-blood` par page refresh karta hai, toh Vercel 404 NOT_FOUND error deta hai. Isko theek karne ke liye humne **`vercel.json`** configure kiya:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Is rule se Vercel har request ko `index.html` par bhejta hai aur React Router client-side par sahi page load karta hai.

---

## 10. Viva & Project Presentation FAQs

**Q1: Aapke project me 'Data Freshness Engine' ka kya role hai?**  
*Ans:* Healthcare me purana data dangerous ho sakta hai. Agar 3 din pehle hospital me 10 unit blood tha, toh ho sakta hai aaj khatam ho chuka ho. RaktNavi update time ke hisaab se records ko classify karta hai (Recently Updated, Needs Reconfirmation, Stale) taaki patient galat umeed me door travel na kare.

**Q2: Patient ki privacy kaise protect ki gayi hai?**  
*Ans:* Public tracking endpoints par phone number (`+91 98*** ***10`) aur patient ka naam (`Rajesh S***`) mask kar diya jata hai. Saath hi tracking reference sequential (1, 2, 3) nahi hota balki cryptographically random token (`RN-XXXXXX`) hota hai jisse enumeration attack na ho sake.

**Q3: Dual-Mode Architecture kya hai?**  
*Ans:* Project bina kisi database ya backend server ke bhi full interactive **Demo Mode** me chalta hai (client-side in-memory + `localStorage` persistence ke sath), aur ek environment toggle (`VITE_DEMO_MODE=false`) se real FastAPI + PostgreSQL backend se connect ho jata hai.

**Q4: Missing units ko '0' kyu nahi maana gaya?**  
*Ans:* Database me `units_available` nullable (None) hai. Agar kisi blood bank ne exact unit count share nahi kiya, toh system use zero nahi manta balki "Group Listed without exact count" dikhata hai taaki log call karke pata kar sakein.
