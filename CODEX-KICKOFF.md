# MediTrack Diabetes – Codex Kickoff Instructions

**Project:** MediTrack Diabetes – Prescription & Inventory Tracker for Diabetics  
**Repo:** `hivoltgdevelopment/meditrack-diabetes` (public)  

## Sprint 1 Goal
Connect `Home`, `Add`, `Reminders`, and `Inventory` screens to Supabase with live data and end-to-end notifications (no styling changes).  

## Tasks
1. **Replace mock data** with live Supabase queries/mutations for the four screens above.  
2. Apply **RLS** so each user only accesses their own data.  
3. Implement **email notifications** via Resend (`send-refill-email`).  
4. Implement **push notifications** via Expo (`send-low-stock-push`) using tokens in `user_push_tokens`.  
5. Test on both **mobile (Expo)** and **web dashboard** builds.  

## Resources
- **Supabase Tables:** `prescriptions`, `inventory`, `reminders`, `user_profiles`, `user_settings`, `user_push_tokens`
- **Env Vars:**  
  - `SUPABASE_URL`  
  - `SUPABASE_ANON_KEY`  
  - `RESEND_API_KEY`  
  - Expo Push Notification keys  
- **Notes:**  
  - Use `pnpm` for installs (local cache if network blocked).  
  - Test with Supabase CLI for Edge Functions.  
  - No styling changes — functionality only.  

## Acceptance Criteria
- All four screens pull and write data to Supabase.  
- Email and push notifications fire from UI actions and scheduled jobs.  
- Functionality verified on mobile and web.  
