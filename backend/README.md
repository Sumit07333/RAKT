# RaktNavi Backend — Phase 1: Foundation and Database

This is the FastAPI backend service for **RaktNavi**, a Cloud-Based Blood Availability & Emergency Request Management System (IIT Patna — Cloud Computing Team Project).

---

## 1. Technology Stack

- **Python:** 3.11+
- **Framework:** FastAPI (asynchronous REST API)
- **Database Engine:** PostgreSQL
- **ORM:** SQLAlchemy 2.x
- **Schema Migrations:** Alembic
- **Data Validation:** Pydantic 2.x (separate models & schemas)
- **Testing:** pytest with FastAPI TestClient
- **Environment Management:** pydantic-settings & python-dotenv

---

## 2. Directory Architecture

```
backend/
├── alembic/
│   ├── env.py                             # Alembic migration environment
│   ├── script.py.mako                     # Migration revision template
│   └── versions/
│       └── 20261024_0001_initial_schema.py# DDL for facilities, blood_inventory, emergency_requests, request_timeline_events
├── alembic.ini                            # Migration configuration
├── app/
│   ├── api/
│   │   ├── deps.py                        # Database session injection dependencies
│   │   └── v1/
│   │       ├── router.py                  # Aggregated /api/v1 router
│   │       ├── facilities.py              # Facility endpoints (GET /facilities, GET /facilities/{id})
│   │       ├── blood_availability.py      # Stock endpoints (GET /blood-availability, /inventory alias)
│   │       └── emergency_requests.py      # Request endpoints (POST /emergency-requests, GET /emergency-requests/{ref})
│   ├── models/                            # SQLAlchemy 2.0 ORM Entities
│   │   ├── facility.py                    # Facility model
│   │   ├── blood_availability.py          # BloodAvailability model (strictly nullable units; stale tracking)
│   │   └── emergency_request.py           # EmergencyRequest & RequestTimelineEvent models
│   ├── schemas/                           # Pydantic 2.0 Validation & Response Contracts
│   │   ├── common.py                      # Standard envelope & error contracts
│   │   ├── facility.py                    # Facility DTOs
│   │   ├── blood_availability.py          # Stock DTOs & blood group enums
│   │   └── emergency_request.py           # Intake & privacy-masked tracking DTOs
│   ├── repositories/                      # Isolated Data Access Layer (DAL)
│   │   ├── facility_repository.py
│   │   ├── blood_availability_repository.py
│   │   └── emergency_request_repository.py
│   ├── services/                          # Business Logic Layer
│   │   ├── facility_service.py
│   │   ├── blood_availability_service.py  # Stale threshold evaluation (>24h flagged)
│   │   └── emergency_request_service.py   # Non-sequential reference generation & PII masking
│   ├── config.py                          # Type-safe settings loaded from environment
│   ├── database.py                        # Engine, sessionmaker, and get_db session dependency
│   └── main.py                            # FastAPI entrypoint, CORS, payload limits & error handling
├── tests/
│   ├── conftest.py                        # In-memory SQLite isolated fixtures & TestClient
│   ├── test_health.py                     # Health endpoint tests
│   ├── test_facilities.py                 # Facility listing, city filtering & 404 tests
│   ├── test_blood_availability.py         # Stock filters, null quantity handling, stale record tests
│   └── test_emergency_requests.py         # Intake validation, non-sequential reference, tracking & PII masking
├── .env.example                           # Template configuration (placeholders only)
├── pytest.ini                             # Pytest runner configuration
├── requirements.txt                       # Python dependencies
└── README.md
```

---

## 3. Database Models & Schema Design

### 3.1 Facility (`facilities`)
- `id` (VARCHAR(50), PK): Unique facility identifier (e.g. `fac-patna-01`).
- `name` (VARCHAR(255), NOT NULL, Indexed): Full organization name.
- `category` (VARCHAR(100), NOT NULL): Type of facility (e.g., Regional Blood Bank, Hospital Attached).
- `address`, `city`, `state`, `pincode`: Geographic location fields (indexed on `city`).
- `contact_phone`, `helpline_email`, `operating_hours`, `description`: Verified contact channels.
- `is_active` (BOOLEAN, Indexed): Active operating status.
- `is_demo_record` (BOOLEAN): Clearly flags synthetic demo records vs verified institutions.
- `created_at`, `updated_at`: UTC timestamps with timezone.

### 3.2 Blood Availability (`blood_inventory`)
- `id` (VARCHAR(50), PK): Unique inventory record ID.
- `facility_id` (VARCHAR(50), FK -> `facilities.id` ON DELETE CASCADE): Facility reference.
- `blood_group` (VARCHAR(10), NOT NULL, Indexed): Blood group (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- `units_available` (INTEGER, **NULLABLE**):
  - **Engineering Decision:** Only populated when explicitly verified by facility staff. Missing quantity is stored as `NULL` and **never** defaulted to zero or invented.
- `availability_status` (VARCHAR(50), NOT NULL): Status (`Available`, `Low Stock`, `Critically Low`, `Unavailable`).
- `last_updated` (TIMESTAMP WITH TIME ZONE, NOT NULL): Timestamp of latest stock verification.
- `freshness_category` (VARCHAR(50)): Stale records older than `STALE_THRESHOLD_HOURS` (24h) are dynamically identified as `Stale (Needs Reconfirmation)`.
- `verification_notes` (TEXT, Nullable): Coordinator notes.
- Unique Constraint: `(facility_id, blood_group)` to enforce one record per group per facility.

### 3.3 Emergency Request (`emergency_requests`)
- `id` (VARCHAR(50), PK): Internal UUID identifier.
- `tracking_reference` (VARCHAR(30), UNIQUE, Indexed): Cryptographically unguessable, non-sequential tracking code (e.g. `RN-782194` or `RN-894215`). Avoids sequential ID enumeration attacks.
- `requester_name` (VARCHAR(100), NOT NULL): Requester identity (protected in public endpoints).
- `contact_phone` (VARCHAR(30), NOT NULL): Contact phone (masked in public tracking endpoints).
- `blood_group` (VARCHAR(10), NOT NULL, Indexed): Required group.
- `units_required` (INTEGER, NOT NULL): Units needed (validated between 1 and 50).
- `city` (VARCHAR(100), NOT NULL, Indexed): Requested city.
- `urgency_level` (VARCHAR(50), NOT NULL): Urgency tier (`Normal`, `Urgent`, `Immediate / Critical`).
- `status` (VARCHAR(50), NOT NULL, Indexed): State lifecycle (`Pending`, `Contacted`, `Fulfilled`, `Cancelled`).
- `facility_preference_id` (VARCHAR(50), FK -> `facilities.id` ON DELETE SET NULL, Nullable).
- `created_at`, `updated_at`: UTC timestamps.

### 3.4 Request Timeline Event (`request_timeline_events`)
- `id` (SERIAL, PK): Auto-incrementing audit event ID.
- `request_id` (VARCHAR(50), FK -> `emergency_requests.id` ON DELETE CASCADE): Parent request.
- `status` (VARCHAR(50), NOT NULL): Milestone state.
- `description` (TEXT, NOT NULL): Chronological audit note.
- `event_timestamp` (TIMESTAMP WITH TIME ZONE, NOT NULL).

---

## 4. API Endpoints & Contract Specification

All public and coordination endpoints reside under versioned prefix `/api/v1` (with full backward-compatible route aliases for the frontend).

| Method | Canonical Route | Frontend Compatibility Alias | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | — | Health check and database connectivity verification |
| `GET` | `/api/v1/facilities` | — | List active facilities with optional `?city=` filter |
| `GET` | `/api/v1/facilities/{id}` | `/api/v1/inventory/{id}` | Facility details and cataloged blood inventory |
| `GET` | `/api/v1/blood-availability` | `/api/v1/inventory` | Search blood availability by `blood_group`, `city`, `status` |
| `POST` | `/api/v1/emergency-requests` | `/api/v1/requests` | Validate and register an emergency blood request |
| `GET` | `/api/v1/emergency-requests/{code}` | `/api/v1/requests/{code}` | Public status tracking using secure tracking reference |

### Privacy and Security Protections:
1. **Public Tracking Masking:** A tracking reference code is not an authorization credential. To protect citizen privacy, requester phone numbers are masked (e.g. `+91 98*** ***10`) and names are truncated (e.g. `Rajesh S***`) on public tracking responses.
2. **Payload Size Guard:** Incoming request bodies are restricted by `MAX_REQUEST_BODY_BYTES` (256 KB) via HTTP middleware to protect against denial-of-service payload abuse.
3. **Strict CORS Policy:** Wildcard origins with credentials are explicitly prohibited; allowed frontend origins are loaded strictly from the `ALLOWED_ORIGINS` environment variable.
4. **Safe Logging:** Requester personal contact information, phone numbers, and secrets are strictly excluded from application logs.

---

## 5. Local Setup and Installation

### 5.1 Prerequisites
- Python 3.11 installed
- PostgreSQL 14+ running locally or in Docker

### 5.2 Environment Configuration
Copy the configuration template to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your local PostgreSQL credentials:
```env
DATABASE_URL=postgresql+psycopg://<your_username>:<your_password>@localhost:5432/raktnavi_db
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 5.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 5.4 Database Migrations (Alembic)
Apply the initial schema to your PostgreSQL database:
```bash
alembic upgrade head
```

To review the raw SQL migration without executing:
```bash
alembic upgrade head --sql
```

### 5.5 Optional Demo Data Seeding
If setting up a development sandbox, run the demo SQL script in your database:
```bash
psql -U postgres -d raktnavi_db -f ../database/seed_demo_data.sql
```
*(Notice: Never seed synthetic demonstration records into production environments).*

### 5.6 Run the Application Locally
Start the FastAPI development server with Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`
- Health Endpoint: `http://localhost:8000/health`

---

## 6. Running Automated Tests

All tests run in-memory using an isolated SQLite database fixture, executing deterministically without requiring a live PostgreSQL instance:

```bash
pytest -v
```

Expected output:
```
tests/test_blood_availability.py::test_filter_availability_all PASSED
tests/test_blood_availability.py::test_filter_availability_by_blood_group PASSED
tests/test_blood_availability.py::test_filter_availability_by_city PASSED
tests/test_blood_availability.py::test_missing_units_not_treated_as_zero PASSED
tests/test_blood_availability.py::test_stale_record_detection PASSED
tests/test_blood_availability.py::test_frontend_inventory_alias PASSED
tests/test_emergency_requests.py::test_create_emergency_request_success PASSED
tests/test_emergency_requests.py::test_create_emergency_request_validation_failures PASSED
tests/test_emergency_requests.py::test_create_emergency_request_invalid_facility_preference PASSED
tests/test_emergency_requests.py::test_track_emergency_request_and_privacy_masking PASSED
tests/test_emergency_requests.py::test_track_emergency_request_not_found PASSED
tests/test_emergency_requests.py::test_frontend_requests_compatibility_alias PASSED
tests/test_emergency_requests.py::test_payload_size_limit_rejection PASSED
tests/test_facilities.py::test_list_facilities_returns_active_only PASSED
tests/test_facilities.py::test_list_facilities_filter_by_city PASSED
tests/test_facilities.py::test_list_facilities_filter_nonexistent_city PASSED
tests/test_facilities.py::test_get_facility_detail_found PASSED
tests/test_facilities.py::test_get_facility_detail_not_found PASSED
tests/test_health.py::test_health_check_endpoint PASSED

============================= 19 passed in 0.90s ==============================
```

---

## 7. Connecting the Existing Frontend

The frontend is already configured with dual-mode support via `VITE_DEMO_MODE` in `frontend/.env`:

1. In `frontend/.env` (or `web/.env`), set:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_DEMO_MODE=false
   ```
2. Start the backend:
   ```bash
   uvicorn app.main:app --port 8000
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. The frontend's `apiClient.js`, `inventoryService.js`, and `requestService.js` will immediately consume the live backend endpoints seamlessly.
