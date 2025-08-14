
-- 0001_init.sql
create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  first_name text,
  last_name text,
  role text check (role in ('user','caregiver','doctor','admin')) default 'user',
  emergency_contact jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Use Supabase Auth users and link profile
alter table users enable row level security;

create table if not exists pharmacies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_info jsonb,
  address text,
  api_link text
);
alter table pharmacies enable row level security;

create table if not exists prescriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  category text check (category in ('medication','supply')) not null,
  dosage text,
  frequency text,
  prescribing_doctor text,
  pharmacy_id uuid references pharmacies(id),
  start_date date,
  end_date date,
  refill_quantity integer default 0,
  remaining_quantity integer default 0,
  prescription_file text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table prescriptions enable row level security;

create table if not exists refill_requests (
  id uuid primary key default uuid_generate_v4(),
  prescription_id uuid references prescriptions(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  pharmacy_id uuid references pharmacies(id),
  status text check (status in ('pending','sent','confirmed','declined')) default 'pending',
  request_date timestamptz default now(),
  response_date timestamptz
);
alter table refill_requests enable row level security;

create table if not exists inventory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  prescription_id uuid references prescriptions(id) on delete cascade,
  lot_number text,
  expiration_date date,
  quantity integer default 0
);
alter table inventory enable row level security;

create table if not exists blood_glucose_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  value numeric(5,2) not null,
  recorded_at timestamptz not null default now(),
  source text check (source in ('manual','CGM','import')) default 'manual'
);
alter table blood_glucose_logs enable row level security;

create table if not exists insurance (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  provider_name text,
  policy_number text,
  coverage_details jsonb,
  created_at timestamptz default now()
);
alter table insurance enable row level security;

-- Basic RLS: user can access own rows
create policy "users self" on users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own prescriptions" on prescriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own inventory" on inventory
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own refill requests" on refill_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own logs" on blood_glucose_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own insurance" on insurance
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public read pharmacies (optional) + admin write
create policy "read pharmacies" on pharmacies
  for select using (true);
