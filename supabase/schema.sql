-- Chele Towing Supabase schema
-- Recommended: run this only in a new, dedicated Chele Towing Supabase project.
-- This script is intentionally non-destructive: no DROP, DELETE, or TRUNCATE.

do $$
begin
  if to_regclass('public.chele_towing_schema_metadata') is null and (
    to_regclass('public.vehicle_leads') is not null
    or to_regclass('public.site_content') is not null
    or to_regclass('public.testimonials') is not null
    or to_regclass('public.gallery_images') is not null
    or exists (select 1 from storage.buckets where id = 'vehicle-photos')
  ) then
    raise exception 'Chele Towing installation stopped: one or more table or bucket names are already in use. Create a separate Supabase project.';
  end if;
end
$$;

create extension if not exists "pgcrypto";

create table if not exists public.chele_towing_schema_metadata (
  id integer primary key default 1 check (id = 1),
  installed_at timestamptz not null default now()
);

insert into public.chele_towing_schema_metadata (id)
values (1)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_type
    join pg_namespace on pg_namespace.oid = pg_type.typnamespace
    where pg_namespace.nspname = 'public' and pg_type.typname = 'vehicle_lead_status'
  ) then
    create type public.vehicle_lead_status as enum (
      'new', 'contacted', 'negotiating', 'accepted', 'rejected', 'picked_up', 'paid'
    );
  end if;
end
$$;

create table if not exists public.vehicle_leads (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  vehicle_year integer not null,
  make text not null,
  model text not null,
  vehicle_condition text not null,
  has_title boolean not null default false,
  has_catalytic boolean not null default false,
  has_key boolean not null default false,
  runs boolean not null default false,
  estimated_price_min integer not null,
  estimated_price_max integer not null,
  photos text[] not null default '{}',
  notes text,
  status public.vehicle_lead_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  testimonial_text text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.vehicle_leads enable row level security;
alter table public.site_content enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_images enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicle_leads' and policyname = 'Anyone can submit Chele Towing vehicle leads') then
    create policy "Anyone can submit Chele Towing vehicle leads" on public.vehicle_leads for insert to anon, authenticated with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicle_leads' and policyname = 'Admins can read Chele Towing vehicle leads') then
    create policy "Admins can read Chele Towing vehicle leads" on public.vehicle_leads for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'vehicle_leads' and policyname = 'Admins can update Chele Towing vehicle leads') then
    create policy "Admins can update Chele Towing vehicle leads" on public.vehicle_leads for update to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_content' and policyname = 'Anyone can read Chele Towing site content') then
    create policy "Anyone can read Chele Towing site content" on public.site_content for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_content' and policyname = 'Admins can create Chele Towing site content') then
    create policy "Admins can create Chele Towing site content" on public.site_content for insert to authenticated with check (id = 1);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'site_content' and policyname = 'Admins can update Chele Towing site content') then
    create policy "Admins can update Chele Towing site content" on public.site_content for update to authenticated using (id = 1) with check (id = 1);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'testimonials' and policyname = 'Anyone can read active Chele Towing testimonials') then
    create policy "Anyone can read active Chele Towing testimonials" on public.testimonials for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'testimonials' and policyname = 'Admins can manage Chele Towing testimonials') then
    create policy "Admins can manage Chele Towing testimonials" on public.testimonials for all to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gallery_images' and policyname = 'Anyone can read active Chele Towing gallery images') then
    create policy "Anyone can read active Chele Towing gallery images" on public.gallery_images for select to anon, authenticated using (is_active = true or auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'gallery_images' and policyname = 'Admins can manage Chele Towing gallery images') then
    create policy "Admins can manage Chele Towing gallery images" on public.gallery_images for all to authenticated using (true) with check (true);
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Anyone can upload Chele Towing vehicle photos') then
    create policy "Anyone can upload Chele Towing vehicle photos" on storage.objects for insert to anon, authenticated with check (bucket_id = 'vehicle-photos');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public can view Chele Towing vehicle photos') then
    create policy "Public can view Chele Towing vehicle photos" on storage.objects for select to public using (bucket_id = 'vehicle-photos');
  end if;
end
$$;
