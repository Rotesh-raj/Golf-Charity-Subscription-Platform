-- Seed Data - Run after schema.sql

-- Prize pool
insert into prize_pool (amount) values (10000.00) on conflict (id) do update set amount = 10000.00;

-- Charities
insert into charities (id, name, description, logo_url) values
  ('550e8400-e29b-41d4-a716-446655440001', 'Red Cross', 'Humanitarian aid', 'https://example.com/redcross.jpg'),
  ('550e8400-e29b-41d4-a716-446655440002', 'WWF', 'Wildlife conservation', 'https://example.com/wwf.jpg'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cancer Research', 'Cancer research', 'https://example.com/cancer.jpg')
on conflict (id) do nothing;

-- Admin user
insert into users (id, email, password, role) values
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', '$2a$12$examplehashforadmin12345678901234567890', 'admin')
on conflict (id) do nothing;

-- Sample user
insert into users (email, password, charity_id, charity_contribution_pct) values
  ('user@example.com', '$2a$12$examplehashpassword12345678901234567890', '550e8400-e29b-41d4-a716-446655440001', 0.15)
returning id;

-- Sample sub (after user id known, manual adjust or run after)
-- insert into subscriptions (user_id, status, plan, expires_at) values (...);

-- Sample scores
-- insert into scores (user_id, numbers) values ((select id from users where email='user@example.com'), array[5,12,23,34,41,45]::int[] );

-- Sample draw
-- insert into draws (numbers, date) values (array[1,10,20,30,40,45]::int[], now());

-- Note: Full seed requires running step by step or adjust ids

