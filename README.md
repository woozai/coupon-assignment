# Digital Coupon Marketplace

## Overview

This project includes:

- admin coupon management
- public customer browsing and purchase flow
- reseller REST API protected by `Authorization: Bearer <api-key>`
- MongoDB persistence
- Docker support for backend, frontend, and MongoDB

## Stack

- Backend: `Node.js`, `Express`, `TypeScript`, `MongoDB`
- Frontend: `React`, `Vite`, `TypeScript`
- Containers: `Docker`, `docker compose`

## Environment Setup

### Backend

Create `backend/.env` from `backend/.env.example`.

Required values:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-coupon-marketplace
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=your-bcrypt-hash
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

## Run With Docker

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

### 2. Start the backend

```powershell
cd backend
npm install
npm run dev
```

### 3. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

## Local Access

- Admin login uses `ADMIN_EMAIL` and the password that matches `ADMIN_PASSWORD_HASH`
- Reseller API uses `RESELLER_API_KEY`

Example reseller request:

```bash
curl -H "Authorization: Bearer your-reseller-api-key" http://localhost:4000/api/v1/products
```

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

## CI

GitHub Actions checks:

- backend install
- backend tests
- backend build
- frontend install
- frontend build
