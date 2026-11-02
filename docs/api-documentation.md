# UrbanFix AI — API Documentation

## 1. Backend REST Endpoints (Port 8080)

Base URL: `http://localhost:8080/api`

### 1.1 Public Health Check
- **Endpoint**: `GET /api/health`
- **Auth**: None (Public)
- **Response**: `200 OK`
```json
{
  "status": "UP",
  "service": "UrbanFix Backend",
  "version": "1.0.0"
}
```

### 1.2 Error Response Format
Centralized error responses returned by `GlobalExceptionHandler`:
```json
{
  "timestamp": "2026-11-02T18:00:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for request",
  "path": "/api/complaints",
  "details": [
    "title: must not be blank",
    "category: must not be null"
  ]
}
```

### 1.3 Upcoming Phase 2 Endpoints
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Citizen registration |
| `/api/auth/login` | POST | Public | Authenticate & issue JWT |
| `/api/users/me` | GET | Authenticated | Retrieve current user profile |
| `/api/complaints` | POST | ROLE_CITIZEN | Submit civic issue report |
| `/api/complaints` | GET | Authenticated | Query civic issues (filtered by role) |
| `/api/departments` | GET | Authenticated | List municipal departments |
| `/api/assignments` | POST | ROLE_ADMIN / OFFICER | Assign ticket to officer with SLA |

---

## 2. AI Vision Service (Port 8000)

Base URL: `http://localhost:8000`

### 2.1 AI Health Check
- **Endpoint**: `GET /health`
- **Auth**: None (Public)
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "service": "UrbanFix AI Service",
  "version": "1.0.0"
}
```

### 2.2 Model Inference Stub (Phase 2/3 Preparation)
- **Endpoint**: `POST /predict`
- **Request**:
```json
{
  "image_url": "https://example.com/pothole.jpg",
  "category_hint": "Roads"
}
```
- **Response**: `200 OK`
```json
{
  "issue_type": "Roads",
  "confidence": 0.92,
  "detected_items": [
    {
      "label": "pothole",
      "confidence": 0.92,
      "box": null
    }
  ],
  "severity": "MEDIUM"
}
```
