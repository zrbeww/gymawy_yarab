Gymawy - Fitness Tracking Web Application

Overview

Gymawy helps gym-goers track workouts, sets, reps, and weights; browse an exercise library; and monitor progress with charts. This repo contains a React + Vite + Tailwind frontend and an Express + TypeScript + Prisma backend with PostgreSQL.

Quick Start

Prerequisites
- Node.js 18+ and npm
- Docker (for PostgreSQL) or a local Postgres instance

1) Environment
- Copy `backend/.env.example` to `backend/.env` and adjust values.

2) Database
- Start Postgres with Docker:
  - `docker compose up -d db`
- Initialize Prisma:
  - `cd backend`
  - `npm install`
  - `npm run prisma:migrate`
  - `npm run prisma:seed`

3) Backend
- From `backend/`: `npm run dev`

4) Frontend
- From `frontend/`:
  - `npm install`
  - `npm run dev`

Default URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

Features (MVP)
- JWT email/password auth (signup/login)
- Exercise library: list, search, filters, details, YouTube/Vimeo embed
- Custom exercises (pending admin approval)
- Workout logging: workouts, sets, reps, weight
- Progress stats endpoints; frontend charts (line/bar)
- Dark/light mode
- Admin panel basics: approve/reject custom exercises

Tech
- Frontend: Vite + React + TypeScript + Tailwind CSS + React Router + Recharts
- Backend: Express + TypeScript + Prisma + Zod + JWT
- DB: PostgreSQL (Docker Compose)

Scripts
- backend
  - `npm run dev` – start API in watch mode
  - `npm run build` – compile TypeScript
  - `npm run start` – run compiled server
  - `npm run prisma:migrate` – push/migrate schema
  - `npm run prisma:seed` – seed exercise data

Environment
- `backend/.env`
  - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gymawy"`
  - `JWT_SECRET="change_me"`
  - `PORT=4000`
  - `APP_ORIGIN="http://localhost:5173"`
  - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
  - `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` (optional)

Deploy
- Frontend: Vercel/Netlify
- Backend: Render/Fly.io/AWS ECS. Provision Postgres and set `DATABASE_URL`.

Notes
- OAuth is scaffolded as placeholders; JWT email/password works out of the box.
- This repo is scaffolded to run quickly once Node and Docker are available.


