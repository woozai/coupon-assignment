# Digital Coupon Marketplace

## Overview

This repository contains a digital coupon marketplace built for the Nexus assignment.

The system supports three flows:

- admin product management
- direct customer coupon browsing and purchase through the frontend
- external reseller coupon browsing and purchase through a JWT-protected REST API

## Stack

- Backend: `Node.js`, `Express`, `TypeScript`, `MongoDB`, `Mongoose`
- Frontend: `React`, `Vite`, `TypeScript`
- Containers: `Docker`, `docker compose`

## Features

- admin JWT login backed by env credentials
- admin create, list, update, and delete product flows
- public customer product list, details, and purchase flow
- reseller JWT-protected API
- server-side pricing enforcement
- atomic coupon sale protection
- hidden internal pricing and coupon value before purchase

## Project Structure

```text
/
  backend/
  frontend/
  docs/
  docker-compose.yml
  README.md
```

## Environment Files

### Backend

Create `backend/.env` based on `backend/.env.example`.

Required values:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-coupon-marketplace
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=strong_password_hash_here
JWT_SECRET=replace-with-a-secure-jwt-secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:5173
```

Notes:

- for local backend + Docker Mongo, use `mongodb://localhost:27017/digital-coupon-marketplace`
- for Docker Compose full stack, compose overrides the backend Mongo URI to `mongodb://mongo:27017/digital-coupon-marketplace`
- `ADMIN_PASSWORD_HASH` must be a bcrypt hash, not a plain password

### Frontend

Create `frontend/.env` based on `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Admin Login

The frontend admin page calls:

- `POST /api/admin/login`

The default local admin values currently used in development are:

- email: `admin@example.com`
- password: `admin123`

If you change the backend password hash in `backend/.env`, the login password changes accordingly.

## Run With Docker

Build and start the full stack:

```powershell
docker compose up --build
```

Services:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`
- backend health: `http://localhost:4000/health`
- MongoDB: `mongodb://localhost:27017`

Stop the stack:

```powershell
docker compose down
```

Rebuild from scratch:

```powershell
docker compose build --no-cache
docker compose up
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

## Useful Commands

### Backend

```powershell
cd backend
npm run build
npm test
```

### Frontend

```powershell
cd frontend
npm run build
```

## Main API Routes

### Public customer routes

- `GET /api/products`
- `GET /api/products/:productId`
- `POST /api/products/:productId/purchase`

### Admin routes

- `POST /api/admin/login`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:productId`
- `PUT /api/admin/products/:productId`
- `DELETE /api/admin/products/:productId`

### Reseller routes

- `GET /api/v1/products`
- `GET /api/v1/products/:productId`
- `POST /api/v1/products/:productId/purchase`

Reseller routes require:

```http
Authorization: Bearer <jwt-token>
```

## Docs

Important project docs:

- `docs/project-spec.md`
- `docs/project-phases.md`
- `docs/codex-rules.md`
- `docs/phase-4-task.md`

## Notes

- the backend test suite currently covers pricing, mappers, admin auth/CRUD, customer routes, reseller routes, and purchase behavior
- the project is intentionally structured with controllers, services, repositories, validators, middlewares, and mappers
- Docker vulnerability results depend heavily on the chosen base image tags, so rebuild images after Dockerfile changes before rescanning
