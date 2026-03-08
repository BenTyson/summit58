create table peak_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  peak_id uuid references peaks(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, peak_id)
);

alter table peak_watchlist enable row level security;

create policy "Users can view own watchlist" on peak_watchlist
  for select using (auth.uid() = user_id);
create policy "Users can manage own watchlist" on peak_watchlist
  for all using (auth.uid() = user_id);
