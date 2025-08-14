
# API (Client + Edge Functions)

## Client Access Pattern
- All CRUD via Supabase JS client with RLS policies.
- Sensitive flows via Edge Functions.

## Functions
### POST /functions/v1/send-refill-email
Request:
```json
{
  "user_id": "uuid",
  "prescription_id": "uuid",
  "pharmacy_email": "string",
  "message": "string"
}
```
Response:
```json
{"ok": true, "id": "resend_message_id"}
```
Auth: `Authorization: Bearer <supabase-jwt>`
