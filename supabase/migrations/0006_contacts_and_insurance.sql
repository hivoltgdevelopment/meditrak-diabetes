-- add provider and pharmacy contacts, and insurance cost field

-- Provider contacts table
create table if not exists provider_contacts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table provider_contacts enable row level security;
create policy "own provider_contacts" on provider_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Extend pharmacies for user specific contacts
alter table pharmacies add column if not exists user_id uuid references users(id) on delete cascade;
alter table pharmacies add column if not exists email text;
alter table pharmacies add column if not exists created_at timestamptz default now();
alter table pharmacies add column if not exists updated_at timestamptz default now();
drop policy if exists "read pharmacies" on pharmacies;
create policy "own pharmacies" on pharmacies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Insurance cost tracking on prescriptions
alter table prescriptions add column if not exists insurance_cost numeric(10,2);
