-- Phase 4: Contact Messages Table
-- Created: 2026-03-05
-- Purpose: Store contact form submissions for admin dashboard viewing

-- Create contact_messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null,
  email varchar(255) not null,
  message text not null,
  status varchar(20) not null default 'unread' check (status in ('unread', 'read', 'replied', 'archived')),
  ip_address varchar(45),
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add CHECK constraint for message length at database level
alter table public.contact_messages
add constraint contact_messages_message_length_check
check (length(message) <= 2000);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Create indexes
create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_contact_messages_status on public.contact_messages(status);
create index if not exists idx_contact_messages_email on public.contact_messages(email);

-- Trigger to auto-update updated_at
create or replace function public.handle_contact_message_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_contact_messages_updated
  before update on public.contact_messages
  for each row execute procedure public.handle_contact_message_updated_at();

-- RLS Policies

-- Policy A: Public can INSERT contact messages
-- Allows anon and authenticated users to submit the contact form
-- Enforces required fields and message length check via CHECK constraint
create policy "Public can insert contact messages"
  on public.contact_messages for insert
  with check (
    name is not null 
    and email is not null 
    and message is not null
    and length(message) <= 2000
  );

-- Policy B: Admin can SELECT all contact messages
-- Uses profiles table to check if user is admin
create policy "Admins can view all contact messages"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy C: Admin can UPDATE contact messages (status, etc.)
-- Restricts updates to status and updated_at only
create policy "Admins can update contact messages"
  on public.contact_messages for update
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    -- Only allow updating status column (and updated_at is auto-handled by trigger)
    (old.status is distinct from new.status)
    and (new.name = old.name)
    and (new.email = old.email)
    and (new.message = old.message)
    and (new.ip_address = old.ip_address)
    and (new.user_agent = old.user_agent)
    and (new.created_at = old.created_at)
  );

-- Policy D: Admin can DELETE contact messages
-- Optional: allow admins to delete spam/abusive messages
create policy "Admins can delete contact messages"
  on public.contact_messages for delete
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Note: No public SELECT, UPDATE, or DELETE policies exist
-- This ensures complete privacy of contact messages
