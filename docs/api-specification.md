# RaktNavi — API Specification & Contract Document

**Version:** 1.0.0-draft  
**Target Backend:** Python FastAPI + PostgreSQL  
**Base URL:** `http://localhost:8000` (configurable via `VITE_API_BASE_URL`)  
**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026

---

## 1. General Conventions

- **Data Interchange Format:** JSON (`application/json; charset=utf-8`)
- **Authentication:** Bearer JWT in `Authorization` header (`Authorization: Bearer <token>`) for `/admin/` routes.
- **Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested blood inventory record was not found.",
    "details": null
  }
}
```

---

## 2. Public Endpoints

### 2.1 Health Check
- **Endpoint:** `GET /health`
- **Description:** Verifies service availability.
- **Response:**
```json
{
  "status": "healthy",
  "service": "raktnavi-api",
  "timestamp": "2026-10-24T08:30:00Z"
}
```

### 2.2 Search Blood Inventory
- **Endpoint:** `GET /api/v1/inventory`
- **Query Parameters:**
  - `city` (string, optional): Filter by city name (e.g. `Patna`, `Delhi`, case-insensitive).
  - `blood_group` (string, optional): One of `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
  - `status` (string, optional): One of `Available`, `Low Stock`, `Critically Low`, `Unavailable`.
  - `limit` (integer, default: 50)
  - `offset` (integer, default: 0)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 20,
    "records": [
      {
        "id": "inv-001",
        "facilityId": "fac-patna-01",
        "facilityName": "Patna Central Red Cross Blood Center",
        "city": "Patna",
        "address": "Demo Block B, Bailey Road",
        "contactPhone": "+91 612 2200001",
        "bloodGroup": "O+",
        "unitsAvailable": 14,
        "availabilityStatus": "Available",
        "lastUpdated": "2026-10-24T06:30:00Z",
        "operatingHours": "24/7 Emergency Service",
        "isDemo": true
      }
    ]
  }
}
```

### 2.3 Get Facility Details by ID
- **Endpoint:** `GET /api/v1/inventory/{id}`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "facility": {
      "id": "fac-patna-01",
      "name": "Patna Central Red Cross Blood Center",
      "category": "Regional Blood Bank",
      "city": "Patna",
      "address": "Demo Block B, Bailey Road",
      "contactPhone": "+91 612 2200001",
      "helplineEmail": "patna-demo@raktnavi.iitp.ac.in",
      "operatingHours": "24/7 Emergency Service"
    },
    "inventory": [
      {
        "bloodGroup": "O+",
        "unitsAvailable": 14,
        "availabilityStatus": "Available",
        "lastUpdated": "2026-10-24T06:30:00Z"
      }
    ]
  }
}
```

### 2.4 Create Emergency Request
- **Endpoint:** `POST /api/v1/requests`
- **Request Body:**
```json
{
  "requesterName": "Guardian Rajesh",
  "contactPhone": "+91 98765 43210",
  "city": "Patna",
  "bloodGroup": "O-",
  "unitsRequired": 2,
  "facilityPreferenceId": "fac-patna-01",
  "urgencyLevel": "Immediate / Critical",
  "additionalNotes": "Urgent standby for surgical procedure."
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "requestCode": "RN-DEMO-782194",
    "status": "Pending",
    "createdAt": "2026-10-24T08:35:00Z",
    "message": "Emergency request registered. Note: Demo mode simulation only."
  }
}
```

### 2.5 Track Emergency Request
- **Endpoint:** `GET /api/v1/requests/{code}`
- **Path Parameter:** `code` (e.g. `RN-DEMO-782194`)
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "requestCode": "RN-DEMO-782194",
    "requesterName": "Guardian Rajesh",
    "city": "Patna",
    "bloodGroup": "O-",
    "unitsRequired": 2,
    "urgencyLevel": "Immediate / Critical",
    "status": "Pending",
    "createdAt": "2026-10-24T06:30:00Z",
    "timeline": [
      {
        "status": "Pending",
        "timestamp": "2026-10-24T06:30:00Z",
        "description": "Emergency request registered in system queue."
      }
    ]
  }
}
```

---

## 3. Operator / Admin Endpoints (Protected)

### 3.1 Operator Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Request Body:**
```json
{
  "email": "operator@raktnavi.iitp.ac.in",
  "password": "SecretPassword123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "op-01",
    "name": "Patna Center Operator",
    "facilityId": "fac-patna-01"
  }
}
```

### 3.2 Update Inventory Record
- **Endpoint:** `PATCH /api/v1/admin/inventory/{id}`
- **Request Body:**
```json
{
  "unitsAvailable": 12,
  "availabilityStatus": "Available"
}
```

### 3.3 Update Request Status
- **Endpoint:** `PATCH /api/v1/admin/requests/{id}`
- **Request Body:**
```json
{
  "status": "Contacted",
  "note": "Spoke to attending nurse to verify demo availability."
}
```

---

## 4. Demo Mode vs. API Mode Behavior

| Behavior | Demo Mode (`VITE_DEMO_MODE=true` / Backend Unreachable) | API Mode (`VITE_DEMO_MODE=false`) |
| :--- | :--- | :--- |
| **Data Source** | In-memory synthetic dataset (`src/data/demoInventory.js`) | HTTP Fetch requests to `VITE_API_BASE_URL` |
| **Notice Banner** | Persistent: "DEMO DATA — NOT LIVE AVAILABILITY" | Only displayed if backend flags records as synthetic |
| **Request Creation** | In-memory store; generates `RN-DEMO-XXXXXX` | Persisted to PostgreSQL via REST API |
| **Network Error** | Does not occur; instant client responses | Handled gracefully with retry and error states (no silent demo swap) |
