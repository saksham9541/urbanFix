# Phase 1 Setup & Verification Guide

## 1. Prerequisites
- **Operating System**: Windows (with PowerShell) or Linux / WSL 2
- **Java**: OpenJDK 21 LTS (`Temurin-21.0.13` verified)
- **Node.js**: v20+ / v24 (`v24.18.0` verified)
- **Python**: 3.12+ (`3.12.10` verified)
- **Docker & Compose**: Docker Desktop 4.97+ / Engine 29.9+ / Compose v5.6+

## 2. Infrastructure Setup (Docker Compose)
Configuration path: `infrastructure/docker-compose.yml`

Services defined:
- **PostgreSQL 17**: Container `urbanfix-postgres`, exposed on port `5432`.
- **Redis 7 Alpine**: Container `urbanfix-redis`, exposed on port `6379`.

### Environment Configuration
The file `infrastructure/.env` holds sensitive credentials. A template is provided at `infrastructure/.env.example`:
```env
POSTGRES_DB=urbanfix
POSTGRES_USER=urbanfix
POSTGRES_PASSWORD=<your_secure_password>
POSTGRES_PORT=5432
REDIS_PORT=6379
```

### Start Containers
```powershell
Set-Location infrastructure
docker compose up -d
```

### Verify Container Health
```powershell
docker exec urbanfix-postgres pg_isready -U urbanfix -d urbanfix
docker exec urbanfix-redis redis-cli ping
```

---

## 3. Core Backend (Spring Boot 3.4 / Java 21)
Path: `backend/`

### Build and Run Tests
```powershell
Set-Location backend
.\mvnw.cmd clean test
```

### Run Locally
```powershell
# Load credentials from infrastructure/.env
$envData = Get-Content infrastructure/.env | ConvertFrom-StringData
$env:POSTGRES_PASSWORD = $envData.POSTGRES_PASSWORD
$env:POSTGRES_USER = "urbanfix"
$env:POSTGRES_DB = "urbanfix"

Set-Location backend
.\mvnw.cmd spring-boot:run
```

Endpoint tested:
`GET http://localhost:8080/api/health`
Expected Response:
```json
{
  "status": "UP",
  "service": "UrbanFix Backend",
  "version": "1.0.0"
}
```

---

## 4. Frontend (React + Vite + Tailwind CSS)
Path: `frontend/`

### Install Dependencies
```powershell
Set-Location frontend
npm install
```

### Production Build
```powershell
npm run build
```

### Start Development Server
```powershell
npm run dev
```
Access at `http://localhost:5173`.

---

## 5. AI Service (Python FastAPI)
Path: `ai-service/`

### Run Unit Tests
```powershell
Set-Location ai-service
python -m unittest discover tests
```

### Start AI Service
```powershell
Set-Location ai-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Endpoint tested:
`GET http://localhost:8000/health`

