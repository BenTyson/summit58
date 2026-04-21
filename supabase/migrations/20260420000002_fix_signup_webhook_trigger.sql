-- Fix: notify_user_signup trigger must not block user creation if pg_net is
-- unavailable or the HTTP call fails. Wrap in EXCEPTION so errors are swallowed.
CREATE OR REPLACE FUNCTION public.notify_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
