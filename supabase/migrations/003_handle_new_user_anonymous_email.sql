-- Anonymous auth users may have null email; public.users.email is NOT NULL.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;
