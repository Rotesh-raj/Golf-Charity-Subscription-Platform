-- Golf Charity Platform - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";

-- Prize pool (single row)
create table prize_pool (
  id serial primary key,
  amount numeric default 0,
  updated_at timestamp default now()
);

-- Charities
create table charities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  logo_url text,
  total_contribution numeric default 0,
  created_at timestamp default now()
);

-- Users
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  role text check (role in ('user', 'admin')) default 'user',
  charity_id uuid references charities(id),
  charity_contribution_pct numeric default 0.1 check (charity_contribution_pct >= 0.1 and charity_contribution_pct <= 1),
  created_at timestamp default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  stripe_sub_id text,
  status text check (status in ('active', 'canceled', 'past_due', 'trialing')) default 'trialing',
  plan text check (plan in ('monthly', 'yearly')),
  expires_at timestamp,
  charity_contribution numeric default 0,
  created_at timestamp default now()
);

-- Scores (6 unique numbers 1-45)
create table scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  numbers integer[] not null check (
    array_length(numbers, 1) = 6 and
    cardinality(array(select distinct unnest(numbers::int[]))) = 6 and
    (select min(unnest(numbers::int[]))) >= 1 and
    (select max(unnest(numbers::int[]))) <= 45
  ),
  created_at timestamp default now()
);

-- Draws
create table draws (
  id uuid primary key default uuid_generate_v4(),
  numbers integer[] not null check (array_length(numbers, 1) = 6),
  date timestamp not null,
  type text check (type in ('random', 'algo')) default 'random',
  status text default 'completed',
  is_simulation boolean default false,
  created_at timestamp default now()
);

-- Winners
create table winners (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid references draws(id),
  user_id uuid references users(id),
  match_count integer check (match_count between 3 and 5),
  prize_amount numeric default 0,
  status text check (status in ('pending', 'approved', 'paid', 'rejected')) default 'pending',
  created_at timestamp default now()
);

-- Winner verifications
create table winner_verifications (
  id uuid primary key default uuid_generate_v4(),
  winner_id uuid references winners(id) on delete cascade,
  proof_url text,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp default now()
);

-- Indexes
create index idx_users_email on users(email);
create index idx_subs_user on subscriptions(user_id);
create index idx_scores_user on scores(user_id);
create index idx_scores_created on scores(created_at desc);
create index idx_winners_status on winners(status);
create index idx_draws_date on draws(date desc);

-- Trigger for charity totals (on sub create/update)
create or replace function update_charity_total()
returns trigger as $$
begin
  update charities 
  set total_contribution = total_contribution + coalesce(new.charity_contribution - old.charity_contribution, new.charity_contribution)
  where id = (select charity_id from users u join subscriptions s on u.id = s.user_id where s.id = coalesce(new.id, old.id));
  return new;
end;
$$ language plpgsql;

create trigger charity_contribution_trigger
after insert or update of charity_contribution on subscriptions
for each row execute function update_charity_total();

-- RLS DISABLED for dev (enable in prod)
alter policy "Disable RLS" on users for all using (true);
-- Repeat for all tables

-- Storage bucket for proofs
-- Create manually in Supabase dashboard: bucket 'proofs', public false

