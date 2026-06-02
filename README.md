# Digital Coupon Marketplace

## What This Project Is

A coupon marketplace with:

- admin product management
- public customer browsing and purchase flow
- reseller Bearer API-key protected API
- MongoDB persistence
- full Docker setup for backend, frontend, and MongoDB

## Main Stack

- Backend: `Node.js`, `Express`, `TypeScript`, `MongoDB`
- Frontend: `React`, `Vite`, `TypeScript`
- Containers: `Docker`, `docker compose`

## Environment Files

### Backend

Create `backend/.env` from `backend/.env.example`.

Important values:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-coupon-marketplace
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=strong_password_hash_here
JWT_SECRET=replace-with-a-secure-jwt-secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:5173
RESELLER_API_KEY=replace-with-a-secure-reseller-api-key
```

### Frontend

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Run Everything With Docker

From the repo root:

```powershell
docker compose up --build
```

App URLs:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`
- health: `http://localhost:4000/health`

Stop everything:

```powershell
docker compose down
```

## Run Locally

### 1. Start MongoDB

```powershell
docker compose up -d mongo
```

### 2. Start backend

```powershell
cd backend
npm install
npm run dev
```

### 3. Start frontend

```powershell
cd frontend
npm install
npm run dev
```

## Admin Login

Admin login is backed by the values in `backend/.env`.

The tracked repository should not include a real password value.

If you change `ADMIN_PASSWORD_HASH` in `backend/.env`, the local admin password changes accordingly.

## Useful Commands

### Backend

```powershell
cd backend
npm test
npm run build
```

### Frontend

```powershell
cd frontend
npm run build
```
