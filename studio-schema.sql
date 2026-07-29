-- Creatively Grow studio: client video galleries
-- Videos live in Bunny Stream (library 715384); this stores the records.

create extension if not exists "pgcrypto";

create table if not exists galleries (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  client_name  text not null,
  title        text,
  note         text,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists gallery_videos (
  id          uuid primary key default gen_random_uuid(),
  gallery_id  uuid not null references galleries(id) on delete cascade,
  bunny_guid  text not null,
  title       text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists gallery_videos_gallery_idx on gallery_videos(gallery_id, sort_order);
create index if not exists galleries_slug_idx on galleries(slug);

-- Lock the tables down. All reads and writes go through the server
-- using the service_role key, which bypasses RLS. No anon access.
alter table galleries enable row level security;
alter table gallery_videos enable row level security;
