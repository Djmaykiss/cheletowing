-- Chele Towing Supabase schema
create extension if not exists "pgcrypto";

create type public.vehicle_lead_status as enum (
  'new', 'contacted', 'negotiating', 'accepted', 'rejected', 'picked_up', 'paid'
);

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

alter table public.vehicle_leads enable row level security;
alter table public.site_content enable row level security;

create policy "Anyone can submit vehicle leads"
on public.vehicle_leads for insert to anon, authenticated with check (true);

create policy "Admins can read vehicle leads"
on public.vehicle_leads for select to authenticated using (true);

create policy "Admins can update vehicle leads"
on public.vehicle_leads for update to authenticated using (true) with check (true);

create policy "Anyone can read site content"
on public.site_content for select to anon, authenticated using (true);

create policy "Admins can update site content"
on public.site_content for insert to authenticated with check (id = 1);

create policy "Admins can edit site content"
on public.site_content for update to authenticated using (id = 1) with check (id = 1);

insert into storage.buckets (id, name, public)
values ('vehicle-photos', 'vehicle-photos', true)
on conflict (id) do update set public = true;

create policy "Anyone can upload vehicle photos"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'vehicle-photos');

create policy "Public can view vehicle photos"
on storage.objects for select to public
using (bucket_id = 'vehicle-photos');
