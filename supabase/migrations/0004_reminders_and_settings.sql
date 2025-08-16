-- ensure low_stock_threshold column
alter table if exists user_settings
  add column if not exists low_stock_threshold int not null default 5;

-- reminders table
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  fire_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table reminders enable row level security;
create policy "reminders_select_own" on reminders for select using (auth.uid() = user_id);
create policy "reminders_insert_own" on reminders for insert with check (auth.uid() = user_id);
