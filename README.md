# MediTrack Diabetes

Repo scaffold optimized for **Supabase + Resend + VS Code** with an **Expo (React Native)** mobile client.  
Owner: `hivoltgdevelopment` • Date: 2025-08-14

## Stack
- **Client**: Expo (React Native + TypeScript)
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **Email**: Resend (transactional emails)
- **CI/CD**: GitHub Actions (lint, typecheck, build)
- **Dev**: VS Code project settings + tasks

## Quick Start
```bash
# 1) Install deps
npm i -g supabase@latest
pnpm i || npm i

# 2) Start Supabase locally (Docker required)
supabase start

# 3) Apply DB schema
supabase db reset

# 4) Run mobile app (choose iOS/Android/Web)
pnpm --filter app-mobile start

# 5) Start edge functions (in another terminal)
supabase functions serve --env-file ./env/.edge-functions.local
```
> Create and fill `.env.local` + `./env/.edge-functions.local` from `env/.env.example`.

## Monorepo layout
```
apps/
  app-mobile/           # Expo app
packages/
  shared/               # Shared types & utilities
supabase/
  migrations/           # SQL migrations
  functions/
    send-refill-email/  # Resend email via Edge Functions
docs/
  PRD.md
  api.md
.env/                   # env files (ignored by git)
.vscode/                # VS Code settings & tasks
```

## Scripts
- `pnpm dev` — start Expo (mobile) + functions (concurrently)
- `pnpm typecheck` — TypeScript across workspace
- `pnpm lint` — ESLint/Prettier

## Notes
- Do **NOT** commit `.env*` files.
- Replace placeholder bundle IDs/package names as needed.

## New in this update
- Magic link auth
- Days remaining view & refill requests via Edge Function
- Inventory & expiration screen
- CSV export for reports
- Emergency card with on-device QR
- Health integration stubs
