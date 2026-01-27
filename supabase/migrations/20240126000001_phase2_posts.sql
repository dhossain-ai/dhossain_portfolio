
-- Create posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content_markdown text not null,
  cover_image text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  seo_title text,
  seo_description text,
  canonical_url text,
  reading_time int,
  featured boolean not null default false
);

-- Enable RLS
alter table posts enable row level security;

-- Create policies

-- Public can view published posts
create policy "Public can view published posts"
  on posts for select
  using ( status = 'published' );

-- Admins can do everything
create policy "Admins can do everything on posts"
  on posts for all
  using (
    auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

-- Trigger to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_posts_updated
  before update on posts
  for each row execute procedure public.handle_updated_at();
