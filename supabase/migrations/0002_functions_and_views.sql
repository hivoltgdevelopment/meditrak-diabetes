
-- 0002_functions_and_views.sql

-- Helper: compute per-day usage from frequency (simplistic)
create or replace function public.per_day_from_frequency(freq text)
returns numeric language sql immutable as $$
  select case
    when freq ilike 'once daily' then 1
    when freq ilike 'twice daily' then 2
    when freq ~* 'every (\d+)' then 1::numeric / nullif((regexp_match(freq, 'every (\d+)'))[1]::numeric,0)
    else null
  end;
$$;

create or replace view public.v_prescription_days_remaining as
select
  p.id,
  p.user_id,
  p.name,
  p.remaining_quantity,
  p.frequency,
  per_day_from_frequency(p.frequency) as per_day,
  case when per_day_from_frequency(p.frequency) is null or per_day_from_frequency(p.frequency)=0
       then null
       else floor(p.remaining_quantity / per_day_from_frequency(p.frequency))::int end as days_remaining
from prescriptions p;

-- Low stock threshold table (user configurable)
create table if not exists user_settings (
  user_id uuid primary key references users(id) on delete cascade,
  low_stock_days_threshold int default 5
);
alter table user_settings enable row level security;
create policy "own settings" on user_settings for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
