# Contact Messages - Phase 1 Implementation

## Overview

Phase 1 adds database storage for contact form submissions. This enables:

- Persistent storage of all contact messages
- Admin dashboard access to view/manage messages
- Row Level Security (RLS) for data protection

## Database Changes

### Table: `public.contact_messages`

| Column     | Type         | Constraints                            |
| ---------- | ------------ | -------------------------------------- |
| id         | uuid         | primary key, default gen_random_uuid() |
| name       | varchar(80)  | NOT NULL                               |
| email      | varchar(255) | NOT NULL                               |
| message    | text         | NOT NULL, max 2000 chars               |
| status     | varchar(20)  | NOT NULL, default 'unread'             |
| ip_address | varchar(45)  | NULL                                   |
| user_agent | text         | NULL                                   |
| created_at | timestamptz  | NOT NULL, default now()                |
| updated_at | timestamptz  | NOT NULL, default now()                |

**Status values:** `unread`, `read`, `replied`, `archived`

### Indexes

- `idx_contact_messages_created_at` (descending)
- `idx_contact_messages_status`
- `idx_contact_messages_email`

### RLS Policies

| Policy              | Who                     | Permissions                   |
| ------------------- | ----------------------- | ----------------------------- |
| Public can insert   | anon/auth users         | INSERT only (with validation) |
| Admins can view all | users with role='admin' | SELECT                        |
| Admins can update   | users with role='admin' | UPDATE (status only)          |
| Admins can delete   | users with role='admin' | DELETE                        |

---

## How to Apply Migration

### Option 1: Supabase CLI (Recommended)

```bash
# Make sure you have Supabase CLI installed
npm install -g supabase

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Option 2: Supabase Dashboard SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the contents of:
   `supabase/migrations/20240126000004_phase4_contact_messages.sql`
6. Click **Run**

---

## Verification Checklist

After applying migration, verify in Supabase Dashboard:

### 1. Table Created

- [ ] Table `contact_messages` appears in **Table Editor**
- [ ] All columns exist with correct types

### 2. Indexes Created

- [ ] `idx_contact_messages_created_at`
- [ ] `idx_contact_messages_status`
- [ ] `idx_contact_messages_email`

### 3. RLS Enabled

- [ ] Table has RLS enabled (shield icon)
- [ ] 4 policies exist:
  - `Public can insert contact messages`
  - `Admins can view all contact messages`
  - `Admins can update contact messages`
  - `Admins can delete contact messages`

### 4. Test Insert (as anon)

```sql
-- This should work (public insert)
insert into contact_messages (name, email, message)
values ('Test User', 'test@example.com', 'This is a test message.');
```

### 5. Test Admin Select (as authenticated admin)

- [ ] Login as admin user
- [ ] Run: `select * from contact_messages;`
- [ ] Should see the test record

---

## Next Steps (Phase 2)

Phase 2 will update the API route to:

1. Insert message into database after successful email send
2. Capture IP address and user agent
3. Handle database errors gracefully

Phase 3 will create the admin dashboard page to view/manage messages.
