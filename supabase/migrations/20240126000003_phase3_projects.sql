
-- Projects table for Phase 3 CMS

create table projects (
    id uuid primary key default gen_random_uuid(),
    
    -- Core Info
    title text not null,
    slug text unique not null,
    year int not null,
    subtitle text,
    summary text not null,
    overview text not null,
    
    -- Status & Visibility
    status_public text not null default 'draft', -- 'draft' | 'published'
    badge text, -- 'beta' | 'featured' | 'shipped' | null
    featured boolean not null default false,
    published_at timestamptz,
    
    -- Meta Info
    role text, -- 'Solo Developer', 'Founder', etc.
    project_type text, -- 'Web + Admin', etc.
    
    -- Tech & Platforms (Arrays)
    platforms text[] not null default '{}',
    stack text[] not null default '{}',
    tags text[] not null default '{}',
    
    -- Links
    live_url text,
    code_url text,
    android_url text,
    ios_url text,
    
    -- Content Arrays
    key_features text[] not null default '{}',
    challenges text[] not null default '{}',
    contributions text[] not null default '{}',
    
    -- Media
    cover_image text,
    gallery_images text[] not null default '{}',
    
    -- SEO
    seo_title text,
    seo_description text,
    canonical_url text,
    
    -- System
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- RLS Policies
alter table projects enable row level security;

-- Public: Read only published projects
create policy "Public projects are viewable by everyone"
    on projects for select
    using ( status_public = 'published' );

-- Admin: Full access (CRUD)
create policy "Admins can do everything with projects"
    on projects for all
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Trigger for updated_at
create trigger update_projects_updated_at
    before update on projects
    for each row
    execute function update_updated_at_column();
