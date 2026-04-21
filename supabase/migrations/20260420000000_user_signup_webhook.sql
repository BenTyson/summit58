-- Fires an HTTP POST to /api/webhooks/user-signup on every new profile.
-- The handler sends a welcome email and subscribes the user to the newsletter.

CREATE OR REPLACE FUNCTION public.notify_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER "on_profile_created_send_welcome"
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_user_signup();
