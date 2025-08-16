-- redeploy notify_low_stock to use low_stock_threshold
create or replace function notify_low_stock()
returns trigger language plpgsql as $$
declare
  threshold int;
  per_day numeric;
  days_left int;
  msg text;
begin
  select low_stock_threshold into threshold from user_settings where user_id = new.user_id;
  if threshold is null then threshold := 5; end if;

  select per_day_from_frequency(new.frequency) into per_day;
  if per_day is null or per_day = 0 then
    days_left := null;
  else
    days_left := floor(new.remaining_quantity / per_day);
  end if;

  if days_left is not null and days_left <= threshold then
    msg := 'Low stock: ' || new.name;
    perform net.http_post(
      url := 'http://localhost:54321/functions/v1/send-low-stock-push',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('user_id', new.user_id, 'body', msg)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_notify_low_stock on prescriptions;
create trigger trigger_notify_low_stock
after insert or update of remaining_quantity on prescriptions
for each row execute procedure notify_low_stock();
