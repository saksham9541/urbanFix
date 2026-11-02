# UrbanFix AI — Smart Civic Issue Reporting and Resolution System

UrbanFix AI is an intelligent civic engineering platform designed to streamline municipal issue tracking, automated vision-based complaint categorization, and SLA-bound department routing.

---

## 1. System Architecture & Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Axios, React Router, Lucide React, Leaflet & React Leaflet.
- **Backend**: Java 21 LTS, Spring Boot 3.4.x (Modular Monolith), Spring Data JPA, PostgreSQL 17, Redis 7 Alpine, Flyway Database Migrations, Spring Security (Stateless).
- **AI Service**: Python 3.12, FastAPI, Uvicorn, Pydantic (prepared for YOLO-based civic defect detection).
- **DevOps**: Docker Compose, Git, GitHub Actions CI/CD.

```text
urbanFix/
├── frontend/                     # React 18 + Vite + Tailwind CSS + Leaflet
├── backend/                      # Java 21 + Spring Boot 3.4 Modular Monolith
├── ai-service/                   # Python 3.12 + FastAPI Inference Microservice
├── infrastructure/               # Docker Compose (PostgreSQL 17, Redis 7)
│   ├── docker-compose.yml
│   ├── .env                      # Local environment secrets (Git-ignored)
│   └── .env.example              # Template credentials
├── docs/                         # Architecture, Setup & API Documentation
│   ├── architecture.md
│   ├── phase1-setup.md
│   └── api-documentation.md
├── .github/workflows/
│   └── ci.yml                    # Automated GitHub Actions CI pipeline
├── .gitignore                    # Comprehensive multi-stack ignore rules
└── README.md
```

---

## 2. Quickstart Guide (Phase 1)

### Step 1: Start Infrastructure (PostgreSQL & Redis)
Ensure Docker Desktop is running, then execute in PowerShell:
```powershell
cd C:\Users\Hp\urbanFix\infrastructure
docker compose up -d
```
Verify containers:
```powershell
docker exec urbanfix-postgres pg_isready -U urbanfix -d urbanfix
docker exec urbanfix-redis redis-cli ping
```

### Step 2: Start Spring Boot Backend
```powershell
cd C:\Users\Hp\urbanFix\backend

# Export credentials from infrastructure/.env (PowerShell)
$envData = Get-Content ..\infrastructure\.env | ConvertFrom-StringData
$env:POSTGRES_PASSWORD = $envData.POSTGRES_PASSWORD
$env:POSTGRES_USER = "urbanfix"
$env:POSTGRES_DB = "urbanfix"

# Launch Backend
.\mvnw.cmd spring-boot:run
```
Test health endpoint:
```powershell
curl.exe http://localhost:8080/api/health
# Response: {"status":"UP","service":"UrbanFix Backend","version":"1.0.0"}
```

### Step 3: Start Frontend (React + Vite)
In a separate terminal:
```powershell
cd C:\Users\Hp\urbanFix\frontend
npm run dev
```
Open `http://localhost:5173` in your browser. The live navbar badge will report `Backend: Online`.

### Step 4: Start Python AI Service
In a separate terminal:
```powershell
cd C:\Users\Hp\urbanFix\ai-service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Test health endpoint:
```powershell
curl.exe http://localhost:8000/health
# Response: {"status":"healthy","service":"UrbanFix AI Service","version":"1.0.0"}
```

---

## 3. Automated Tests

- **Backend (JUnit + Mockito + MockMvc)**:
  ```powershell
  cd backend
  .\mvnw.cmd clean test
  ```
- **Frontend Production Build**:
  ```powershell
  cd frontend
  npm run build
  ```
- **AI Service (Unittest)**:
  ```powershell
  cd ai-service
  python -m unittest discover tests
  ```

---

## 4. Phase 2 Roadmap
- **Security & RBAC**: JWT token generation, refresh tokens, role-based security (`ROLE_CITIZEN`, `ROLE_OFFICER`, `ROLE_ADMIN`).
- **Complaints Module**: GPS-tagged issue submission, image upload to S3/Cloud Storage, tracking IDs.
- **Department & SLA Engine**: Auto-routing tickets to municipal departments and tracking resolution deadlines.
- **AI Vision Pipeline**: Training and integrating YOLOv8 model for real-time pothole and garbage detection.
