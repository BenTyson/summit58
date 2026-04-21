-- Fix: SECURITY DEFINER trigger functions must schema-qualify tables AND pin
-- search_path. Without this, Supabase auth (running as supabase_auth_admin)
-- triggers fail with "relation does not exist" because the caller's search_path
-- doesn't include `public`. Cause of "Database error creating new user".

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net, pg_temp
AS $function$
BEGIN
  BEGIN
    PERFORM net.http_post(
      url := 'https://saltgoat.co/api/webhooks/user-signup',
      body := jsonb_build_object(
        'type', 'INSERT',
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(NEW)::jsonb,
        'old_record', NULL
      ),
      headers := '{"Content-Type":"application/json","Authorization":"Bearer 7755037c11997b7e318c15dc1d217e7735b5e40a25ac0e21"}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$function$;
