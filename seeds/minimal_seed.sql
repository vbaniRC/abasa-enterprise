-- Minimal relational seed data for local development.
-- Auth-backed profiles are intentionally omitted because profile ids reference
-- auth.users and should be created by Supabase Auth flows.

begin;

insert into public.club (
  id,
  name,
  city,
  country,
  club_type,
  membership_type,
  rental_type,
  category,
  sluzbeni_email,
  sluzbeni_telefon
) values (
  '00000000-0000-4000-8000-000000000001',
  'ABASA Demo Club',
  'Zagreb',
  'Croatia',
  'amateur',
  'monthly',
  'none',
  'tennis',
  'demo@example.com',
  '+38510000001'
) on conflict (id) do nothing;

insert into public.programs (id, club_id, name, description) values
  (
    '00000000-0000-4000-8000-000000000101',
    '00000000-0000-4000-8000-000000000001',
    'Junior Tennis',
    'Introductory tennis program for junior members.'
  )
on conflict (id) do nothing;

insert into public.locations (id, club_id, name, address, city, description) values
  (
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000001',
    'Main Court',
    'Demo Street 1',
    'Zagreb',
    'Primary training court.'
  )
on conflict (id) do nothing;

insert into public.coaches (
  id,
  club_id,
  first_name,
  last_name,
  email,
  phone,
  oib,
  iban,
  cijena_po_satu
) values (
  '00000000-0000-4000-8000-000000000301',
  '00000000-0000-4000-8000-000000000001',
  'Demo',
  'Coach',
  'coach@example.com',
  '+38510000002',
  '00000000001',
  'HR0000000000000000000',
  25
) on conflict (id) do nothing;

insert into public.groups (
  id,
  club_id,
  program_id,
  name,
  level,
  age_group,
  description,
  min_age,
  max_age
) values (
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000101',
  'Demo Beginners',
  'beginner',
  '8-12',
  'Seeded beginner group.',
  8,
  12
) on conflict (id) do nothing;

insert into public.members (
  id,
  club_id,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth
) values (
  1001,
  '00000000-0000-4000-8000-000000000001',
  'Demo',
  'Member',
  'member@example.com',
  '+38510000003',
  '2014-01-15'
) on conflict (id) do nothing;

insert into public.parents (id, first_name, last_name, email, phone) values
  (1001, 'Demo', 'Parent', 'parent@example.com', '+38510000004')
on conflict (id) do nothing;

insert into public.members_parents (member_id, parent_id, relation) values
  (1001, 1001, 'parent')
on conflict (member_id, parent_id) do nothing;

insert into public.members_groups (member_id, group_id) values
  (1001, '00000000-0000-4000-8000-000000000401')
on conflict (member_id, group_id) do nothing;

insert into public.coaches_locations (coach_id, location_id) values
  (
    '00000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000201'
  )
on conflict (coach_id, location_id) do nothing;

insert into public.groups_locations (group_id, location_id) values
  (
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000201'
  )
on conflict (group_id, location_id) do nothing;

insert into public.schedule (
  id,
  group_id,
  coach_id,
  location_id,
  weekday,
  start_time,
  end_time
) values (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000301',
  '00000000-0000-4000-8000-000000000201',
  1,
  '17:00',
  '18:00'
) on conflict (id) do nothing;

insert into public.schedule_acceptance (id, schedule_id, coach_id, status) values
  (
    '00000000-0000-4000-8000-000000000601',
    '00000000-0000-4000-8000-000000000501',
    '00000000-0000-4000-8000-000000000301',
    'pending'
  )
on conflict (id) do nothing;

insert into public.attendance (
  id,
  schedule_id,
  member_id,
  coach_id,
  date,
  status
) values (
  '00000000-0000-4000-8000-000000000701',
  '00000000-0000-4000-8000-000000000501',
  1001,
  '00000000-0000-4000-8000-000000000301',
  current_date,
  'present'
) on conflict (id) do nothing;

insert into public.payments (
  id,
  member_id,
  amount,
  currency,
  month,
  year,
  status,
  note
) values (
  '00000000-0000-4000-8000-000000000801',
  1001,
  50,
  'EUR',
  1,
  2026,
  'paid',
  'Seed payment'
) on conflict (id) do nothing;

insert into public.notifications (
  id,
  group_id,
  member_id,
  coach_id,
  title,
  message
) values (
  '00000000-0000-4000-8000-000000000901',
  '00000000-0000-4000-8000-000000000401',
  1001,
  '00000000-0000-4000-8000-000000000301',
  'Welcome',
  'Welcome to the demo club.'
) on conflict (id) do nothing;

insert into public.competitions (
  id,
  club_id,
  name,
  description,
  location,
  start_date,
  end_date,
  type,
  category,
  discipline,
  organizer,
  status
) values (
  1001,
  '00000000-0000-4000-8000-000000000001',
  'Demo Competition',
  'Seeded competition record.',
  'Main Court',
  '2026-01-20',
  '2026-01-20',
  'club',
  'junior',
  'singles',
  'ABASA Demo Club',
  'najavljeno'
) on conflict (id) do nothing;

select setval(pg_get_serial_sequence('public.members', 'id'), greatest((select max(id) from public.members), 1));
select setval(pg_get_serial_sequence('public.parents', 'id'), greatest((select max(id) from public.parents), 1));
select setval(pg_get_serial_sequence('public.competitions', 'id'), greatest((select max(id) from public.competitions), 1));

commit;
