
# PRD – MediTrack Diabetes (Distribution for Codex)

**Repo**: hivoltgdevelopment/meditrack-diabetes  
**Date**: 2025-08-14

## Objectives
Reduce missed doses, automate refills, track supplies, and generate adherence reports.

## Feature Map
- Prescription CRUD, inventory & expirations, refill alerts
- Provider & pharmacy contacts + refill requests
- Insurance cost tracking
- CGM integrations (Dexcom/Libre via device apps + HealthKit/Google Fit)
- Emergency card (QR + wallet pass)
- Reports (PDF/CSV)

## Platform
- Expo mobile app
- Supabase (DB/Auth/Edge Functions)
- Resend for transactional emails

## Data Entities
See `/supabase/migrations/0001_init.sql` for schema.

## API Surface
- Edge Functions: `send-refill-email`
- Client SDK: direct Supabase CRUD + RLS
- Future: webhook receiver for pharmacy confirmations

## Non-Functional
- HIPAA-minded patterns, but **do not store PHI unencrypted**. Use RLS + column-level encryption where applicable.
- PII/PHI export & delete requests supported

## Roadmap
- MVP → Integrations → AI
