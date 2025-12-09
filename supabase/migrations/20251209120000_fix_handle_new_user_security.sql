-- Migration: Make handle_new_user SECURITY DEFINER
-- Date: 2025-12-09

-- Recreate the trigger function as SECURITY DEFINER so it can insert
-- into public.profiles even when RLS is enabled for that table.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Make sure the function is owned by a privileged role so it can bypass
-- row-level security when executed with security definer.
-- 'postgres' is commonly present in local Supabase; if your instance
-- uses a different owner adjust accordingly.

alter function public.handle_new_user() owner to postgres;

-- Grant EXECUTE to role 'auth' if it exists (some local setups don't create it)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'auth') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.handle_new_user() TO auth';
  END IF;
END
$$;
