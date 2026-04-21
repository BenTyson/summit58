create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- No user-facing RLS policies — accessed only via service role (admin dashboard + contact form insert)
alter table contact_submissions enable row level security;
