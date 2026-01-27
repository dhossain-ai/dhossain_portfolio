
# Supabase Setup

1.  Run the SQL in `supabase/migrations/20240126000000_phase1_profiles.sql` in your Supabase SQL Editor.
2.  Set your environment variables in `.env.local` (copy from `.env.example`).
3.  Sign up a new user via the /login page (or via Supabase dashboard).
4.  To make yourself an admin, run this in Supabase SQL Editor:

```sql
update profiles set role = 'admin' where id = 'YOUR_USER_ID';
```
