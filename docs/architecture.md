# UrbanFix AI — System Architecture (Phase 1)

## 1. Overview
**UrbanFix AI** is a smart civic issue reporting and automated municipal resolution platform designed to modernize urban maintenance through AI computer vision, geospatial intelligence, and transparent department SLAs.

```
+-------------------------------------------------------------------------+
|                              CITIZEN / WEB UI                           |
|                  React 18 + Vite + Tailwind CSS + Leaflet               |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP / REST (Port 8080)
                                     v
+------------------------------------+------------------------------------+
|                       URBANFIX CORE BACKEND                             |
|          Java 21 + Spring Boot 3.4 (Modular Monolith)                   |
|                                                                         |
|  [Security/JWT]  [Complaint Svc]  [Department Svc]  [Assignment Svc]   |
|  [Notification]  [Analytics Svc]  [AI Integration]  [Common / Errors]   |
+------------------+------------------------------+-----------------------+
                   |                              |
      JDBC / Flyway|                              | Lettuce (Port 6379)
                   v                              v
+------------------+-------------+  +-------------+-----------------------+
|          POSTGRESQL 17         |  |             REDIS 7                 |
|  (Relational Storage & Schema) |  |   (Pub/Sub, Caching & Session)      |
+--------------------------------+  +-------------------------------------+
                   ^
                   | REST (Port 8000)
+------------------+------------------------------------------------------+
|                         AI VISION SERVICE                               |
|                  Python 3.12 + FastAPI + YOLOv8/v11                     |
+-------------------------------------------------------------------------+
```

## 2. Component Design

### 2.1 Backend (Spring Boot 3.4 / Java 21)
- **Modular Monolith Architecture**: Divided into cohesive domain packages:
  - `auth`: Registration, authentication, JWT tokens (Phase 2).
  - `security`: CORS filters, stateless Spring Security filters, RBAC guards.
  - `user`: Citizen, Officer, and Administrator user models.
  - `complaint`: Civic issues, GPS coordinates, severity rankings.
  - `department`: Municipal departments (Roads, Sanitation, Electricity, etc.).
  - `assignment`: SLA tracking, officer ticket distribution.
  - `notification`: In-app and outbound alerts.
  - `analytics`: Resolution heatmaps and performance KPIs.
  - `ai`: HTTP client communicating with Python vision inference service.
  - `common`: Global exception handling, error response schema, health checks.

### 2.2 Frontend (React + Vite + Tailwind CSS)
- **Interactive UI**: Responsive, mobile-first design with Lucide icons.
- **Geospatial Mapping**: Leaflet and OpenStreetMap rendering issue hotspots and GPS pins.
- **Resilient Connectivity**: Axios client with centralized health polling and error interception.

### 2.3 AI Service (Python + FastAPI)
- Lightweight inference microservice serving computer vision models for automated defect detection (potholes, garbage dumps, broken streetlights).
- Exposes `GET /health` and `POST /predict`.

### 2.4 Infrastructure (Docker Compose)
- **PostgreSQL 17**: Main persistent relational store with Flyway migration versioning.
- **Redis 7 (Alpine)**: In-memory caching and real-time publish/subscribe message broker.

