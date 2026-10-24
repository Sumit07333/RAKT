# RaktNavi — System Architecture & Cloud Design

**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026  
**System:** RaktNavi (Cloud-Based Blood Availability & Emergency Request Management System)

---

## 1. High-Level Architecture Overview

RaktNavi is designed following a cloud-native, decoupled service-oriented architecture:

```
[ Clients: Web / Mobile Browser ]
             │
             ▼
    [ Nginx / CloudFront CDN ]
             │
     ┌───────┴────────────────────────┐
     ▼                                ▼
[ React Single Page App ]     [ FastAPI Backend Gateway ]
(Static S3 / Container)              │
                                     ▼
                            [ PostgreSQL Database ]
                                     ▲
                                     │
                             [ Redis Cache ]
                           (Freshness & Session)
```

1. **Frontend Presentation Layer (React + Vite):**
   - High-performance Single Page Application (SPA).
   - Component-driven architecture using Tailwind CSS and Lucide React.
   - Dual-Mode execution:
     - **Demo Mode:** In-memory, persistent session-level synthetic data store with search, filter, and request tracking.
     - **API Mode:** Integrated RESTful fetch layer communicating with the FastAPI backend.
   - Strict separation of data access through dedicated service modules (`apiClient`, `inventoryService`, `requestService`, `authService`).

2. **Backend Services Layer (Future FastAPI Implementation):**
   - Asynchronous Python REST API providing `/api/v1/` endpoints.
   - Pydantic models for validation of Indian phone numbers, blood groups, and timestamps.
   - Role-Based Access Control (RBAC) separating public search from authenticated blood bank operators.

3. **Persistence Layer (Future PostgreSQL & Cloud Storage):**
   - Relational model tracking facilities, inventory stock with precise update timestamps, emergency requests, and audit logs.
   - Read-replicas and regional clustering planned for high availability during disasters.

---

## 2. Cloud Computing Concepts in RaktNavi

As part of the IIT Patna Cloud Computing curriculum, the platform incorporates and demonstrates core cloud paradigms:

1. **Elastic Scalability & Statelesness:**
   - The frontend is completely stateless, deployable across distributed Edge CDN nodes (e.g. AWS CloudFront / Cloudflare).
   - Backend APIs run in stateless Docker containers orchestrated via ECS/EKS or Docker Compose.
2. **High Availability & Disaster Recovery:**
   - Multi-AZ database deployment strategy to ensure zero data loss during regional outages.
   - Containerized SPA fallback architecture preventing client-side routing breakdown.
3. **Data Freshness & Caching Invalidation:**
   - Time-to-Live (TTL) driven caching rules: Blood inventory records decay in freshness over time.
   - Client-side freshness evaluators dynamically classify data into fresh (<24h), cautionary (24-72h), and stale (>72h).
4. **Security & Privacy by Design:**
   - Zero client-side storage of confidential medical history or PII.
   - Strict environment separation (`.env.example` templates, environment secrets injected at runtime).
