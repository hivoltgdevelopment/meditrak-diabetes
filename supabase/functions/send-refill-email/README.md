
# send-refill-email

Supabase Edge Function to send a refill request email using Resend.

## Local Dev
```bash
supabase functions serve --env-file ../../env/.edge-functions.local
```
POST JSON to `http://localhost:54321/functions/v1/send-refill-email`.
