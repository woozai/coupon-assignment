# Digital Coupon Marketplace

## Overview

This repository contains a digital coupon marketplace assignment built in phases.

The planned stack is:

- `Node.js`
- `Express`
- `MongoDB`
- `React`
- `Vite`
- `TypeScript`
- `Docker`

The system supports:

- admin product management
- customer coupon browsing and purchase
- reseller coupon browsing and purchase through a secured REST API

## Current Status

The repository is currently in setup and planning mode.

What already exists:

- project spec
- phased implementation docs
- coding rules
- backend folder structure
- frontend folder structure

What is next:

- Phase 1 backend foundation
- backend bootstrap files
- environment config
- database connection
- middleware and error handling

## Repository Structure

```text
/
  backend/
  frontend/
  docs/
  skills/
  Nexus Exercise – Digital Coupon Marketplace.docx
```

## Important Docs

- `docs/project-spec.md`
- `docs/project-phases.md`
- `docs/phase-1-spec.md`
- `docs/phase-1-task.md`
- `docs/codex-rules.md`

## Working Approach

The project is split into phases so implementation can be done slowly and correctly:

1. backend foundation
2. core backend domain and CRUD
3. purchase flow, auth, and tests
4. frontend, Docker, and final polish

Do not move to the next phase until the current phase is stable and reviewed.

## Docker Goal

The final solution must be fully Dockerized, including:

- backend
- frontend
- MongoDB

Normal project startup should work through Docker without requiring extra manual local setup outside Docker.

## Notes

- Use TypeScript for both backend and frontend
- Do not use `any`
- Keep files under `250` lines when possible
- Keep code modular, readable, and well named
- Add comments only where they improve clarity
