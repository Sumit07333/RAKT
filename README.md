# RaktNavi — Cloud-Based Blood Availability & Emergency Request Management System

**Tagline:** Find Blood Availability Faster. Connect When It Matters.  
**Academic Context:** IIT Patna — Department of Computer Science & Engineering — Cloud Computing Team Project (2026)

---

> [!WARNING]
> **DEMO DATA NOTICE — NOT LIVE AVAILABILITY**  
> This platform is an educational software engineering prototype developed for cloud computing coursework evaluation. All inventory records, facility details, and phone numbers are synthetic simulations. RaktNavi **does not collect, supply, transport, process, or guarantee blood units**. Users must always confirm current availability directly with medical facilities before taking action.

---

## 1. Project Overview & Motivation

During critical medical emergencies, patients and caretakers often struggle to locate compatible blood availability information across regional blood centers and hospitals. The traditional search relies heavily on unindexed phone trees and unverified social media leads.

**RaktNavi** provides:
1. **Centralized Discovery:** Search blood component availability by city and blood group across cataloged centers with **Grid** and **Table** view modes.
2. **Data Freshness Classification:** Evaluates update timestamps dynamically into **Recently Updated** (< 24h), **Needs Reconfirmation** (24-72h), and **Stale** (> 72h) to avoid false security.
3. **📍 Use My Location (GPS Auto-Detect):** Browser geolocation matching nearest supported regional cities with a single click.
4. **Emergency Intake & Tracking:** Submit emergency requests with strict validation, generating unique unguessable tracking codes (`RN-XXXXXX`) with chronological audit timelines.
5. **📲 WhatsApp Emergency Broadcast:** One-click instant sharing of verified blood requirement alerts with live tracking links directly to donors on WhatsApp.
6. **Blood Bank Operator Portal:** Operator console for updating inventory stock, refreshing timestamps, managing incoming emergency requests (`Pending` → `Contacted` → `Fulfilled`), and viewing real-time session audit logs.
7. **Dual-Mode Execution:** Operates seamlessly in client-side **Demo Mode** (with `localStorage` persistence across browser refreshes) or connected directly to the **Python FastAPI + PostgreSQL** backend.

---

## 2. Technology Stack

- **Frontend Core:** React 19 with Vite 8 (JavaScript SPA)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS with custom design tokens for healthcare accessibility
- **Iconography:** Lucide React
- **Backend API:** Python 3.11+, FastAPI (asynchronous REST API)
- **ORM & Migrations:** SQLAlchemy 2.0 (Mapped ORM) & Alembic
- **Data Validation:** Pydantic v2 (DTO schemas and request validation)
- **Database & Cache:** PostgreSQL 15 (Relational persistence) & Redis 7 (Session & TTL Cache)
- **Containerization & Deployment:** Multi-stage Dockerfile, Nginx SPA fallback, and Docker Compose orchestration
- **Automated Testing:** Pytest (Backend SQLite in-memory fixtures) & Vite Production Build Verification

---

## 3. Brand Identity & Design Tokens

- **Primary Red:** `#C41315` (emergency CTAs, branding, critical alerts)
- **Deep Navy:** `#273741` (headings, navigation contrast, professional tone)
- **Interactive Bright Red:** `#E82A25` (hover emphasis, interactive icons)
- **Light Slate / Neutral:** `#EEF2F4` and `#F8FAFC` (card backgrounds and dashboard surfaces)
- **Typography:** Inter (via Google Fonts) with reliable system sans-serif fallback

---

## 4. Repository Structure

```text
RaktNavi/
├── frontend/                       # React 19 + Vite Single Page Application (SPA)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/                 # Brand logo & graphics
│   │   ├── components/
│   │   │   ├── common/             # Button, Input, Select, Badges, Toast, States
│   │   │   ├── navigation/         # Navbar, MobileMenu, Footer
│   │   │   ├── inventory/          # InventoryCard, InventoryFilters, InventoryTable
│   │   │   ├── requests/           # RequestForm, RequestStatusBadge, RequestTimeline
│   │   │   └── dashboard/          # InventoryModal, RequestStatusModal, AuditActivityPanel
│   │   ├── pages/                  # 8 Core Views + 404 Not Found
│   │   ├── services/               # apiClient, inventoryService, requestService, authService
│   │   ├── layouts/                # MainLayout with DemoDataBanner
│   │   ├── hooks/                  # useToast context hook
│   │   ├── data/                   # Synthetic demo facilities, inventory, and requests
│   │   ├── utils/                  # Freshness engine, date formatting, input validation
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile                  # Multi-stage production container build
│   ├── nginx.conf                  # SPA route fallback configuration
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                        # Python FastAPI Backend
│   ├── alembic/                    # Database migration environment & versions
│   ├── app/
│   │   ├── api/v1/                 # Endpoints (Facilities, Blood Stock, Requests, Auth, Admin)
│   │   ├── models/                 # SQLAlchemy 2.0 ORM Entities
│   │   ├── repositories/           # Isolated Data Access Layer (DAL)
│   │   ├── schemas/                # Pydantic v2 Contracts & Data Transfer Objects
│   │   ├── services/               # Core business logic & freshness classification
│   │   ├── config.py               # Settings loaded from environment
│   │   ├── database.py             # Database engine & session generator
│   │   └── main.py                 # FastAPI application, CORS, limits & error handlers
│   ├── tests/                      # Automated Pytest suite
│   ├── requirements.txt            # Python dependencies
│   └── alembic.ini
├── database/
│   └── seed_demo_data.sql          # PostgreSQL schema and initial synthetic seed records
├── deployment/
│   ├── docker-compose.yml          # Multi-container cloud topology (Frontend, Backend, Postgres, Redis)
│   └── aws/                        # AWS deployment architecture overview
├── docs/                           # Architectural specifications & documentation
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-specification.md
│   ├── test-plan.md
│   └── user-guide.md
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. API Endpoints Specification

All backend endpoints reside under versioned prefix `/api/v1` (with full backward-compatibility route aliases for frontend services):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check and database connectivity verification |
| `GET` | `/api/v1/facilities` | List verified facilities with optional `?city=` filter and pagination |
| `GET` | `/api/v1/facilities/{id}` | Facility contact details and complete blood inventory catalog |
| `GET` | `/api/v1/blood-availability` | Search blood stock by `blood_group`, `city`, and `status` with stale data flagging |
| `POST` | `/api/v1/emergency-requests` | Register emergency blood request; generates unique non-sequential reference (`RN-XXXXXX`) |
| `GET` | `/api/v1/emergency-requests/{code}` | Live request progress tracking with requester PII masking (`+91 98*** ***10`) |
| `POST` | `/api/v1/auth/login` | Operator authentication and session token issuance |
| `GET` | `/api/v1/admin/requests` | Coordinator queue listing all emergency requests with unmasked contact info |
| `PATCH` | `/api/v1/admin/requests/{id}` | Update request status (`Pending` → `Contacted` → `Fulfilled`) and append audit notes |
| `PATCH` | `/api/v1/admin/inventory/{id}` | Update blood units and availability status; automatically refreshes timestamp |
| `POST` | `/api/v1/admin/inventory` | Upsert blood stock record for facility and blood group |

---

## 6. Running Locally

### 6.1 Frontend (React + Vite)

```powershell
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To verify production bundle build:
```powershell
npm run build
```

---

### 6.2 Backend (FastAPI + Python)

```powershell
# 1. Navigate to backend folder
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Run FastAPI server with Uvicorn
uvicorn app.main:app --reload --port 8000
```

- **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

### 6.3 Dual-Mode Execution Configuration

To connect the Frontend directly to the live FastAPI backend instead of demo mode, edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_DEMO_MODE=false
```

---

## 7. Docker Deployment

### Run Complete Integrated Cloud Stack
```powershell
cd deployment
docker compose up -d
```

This launches the full topology:
- **`raktnavi-frontend`:** Nginx container serving React SPA on [http://localhost:3000](http://localhost:3000)
- **`raktnavi-backend`:** FastAPI REST service on [http://localhost:8000](http://localhost:8000)
- **`postgres-db`:** PostgreSQL 15 database on port `5432` with pre-seeded demo records
- **`redis-cache`:** Redis 7 cache on port `6379`

---

## 8. Verification & Test Suite

### Automated Backend Tests:
```powershell
cd backend
pytest -v
```

### Production Build Verification:
```powershell
cd frontend
npm run build
# Output: ✓ 1984 modules transformed. Built cleanly in ~12s with 0 errors.
```

---

## 9. Security & Privacy Protections

1. **Public Tracking PII Masking:** Requesters' phone numbers (`+91 98*** ***10`) and names (`Rajesh S***`) are strictly masked on public tracking responses to prevent unauthorized exposure.
2. **Payload Size Guard:** Incoming request bodies are restricted by `MAX_REQUEST_BODY_BYTES` (256 KB) via HTTP middleware to protect against denial-of-service abuse.
3. **CORS Boundary Enforcement:** Wildcard origins with credentials are explicitly prohibited; origins are bound to authorized endpoints.
4. **Unguessable Tracking Codes:** Cryptographically secure non-sequential tokens (`secrets` module) prevent enumeration attacks.
