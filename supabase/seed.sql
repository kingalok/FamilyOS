insert into public.people (
  id,
  full_name,
  role,
  relationship,
  email,
  phone,
  notes,
  metadata
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Alok Sharma',
    'Family coordinator',
    'Parent',
    'alok@example.com',
    '+44 7700 900001',
    'Keeps the household systems moving and likes clean automation.',
    '{"home_base":"myworld","preferences":{"dashboard":"tasks-first"}}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Shilpa',
    'Operations lead',
    'Parent',
    'shilpa@example.com',
    '+44 7700 900002',
    'Owns many school and home routines.',
    '{"focus_areas":["school","health","family-calendar"]}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Aarav',
    'Student',
    'Child',
    null,
    null,
    'Primary school schedule and activity planning.',
    '{"school_year":"Year 8","clubs":["football","science"]}'::jsonb
  )
on conflict (id) do update
set
  full_name = excluded.full_name,
  role = excluded.role,
  relationship = excluded.relationship,
  email = excluded.email,
  phone = excluded.phone,
  notes = excluded.notes,
  metadata = excluded.metadata;

insert into public.events (
  id,
  title,
  description,
  category,
  status,
  event_start,
  event_end,
  location,
  owner_person_id,
  tags,
  metadata
)
values
  (
    '10000000-0000-0000-0000-000000000001',
    'Aarav parent-teacher meeting',
    'School progress review and planning for the next term.',
    'school',
    'confirmed',
    now() + interval '2 days',
    now() + interval '2 days 1 hour',
    'Westbrook School',
    '00000000-0000-0000-0000-000000000002',
    array['school', 'aarav'],
    '{"room":"B12"}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Family grocery reset',
    'Review pantry staples and restock for the week.',
    'home',
    'planned',
    now() + interval '4 days',
    now() + interval '4 days 2 hours',
    'Local supermarket',
    '00000000-0000-0000-0000-000000000001',
    array['shopping', 'weekly'],
    '{"repeat_hint":"weekly"}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Aarav football practice',
    'Evening training session.',
    'activity',
    'planned',
    now() + interval '1 day',
    now() + interval '1 day 90 minutes',
    'Community sports ground',
    '00000000-0000-0000-0000-000000000003',
    array['sports', 'routine'],
    '{"kit_required":true}'::jsonb
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  status = excluded.status,
  event_start = excluded.event_start,
  event_end = excluded.event_end,
  location = excluded.location,
  owner_person_id = excluded.owner_person_id,
  tags = excluded.tags,
  metadata = excluded.metadata;

insert into public.tasks (
  id,
  title,
  description,
  category,
  status,
  priority,
  due_at,
  owner_person_id,
  related_event_id,
  tags,
  metadata
)
values
  (
    '20000000-0000-0000-0000-000000000001',
    'Upload school forms',
    'Submit the signed school activity and emergency contact forms.',
    'school',
    'open',
    'high',
    now() + interval '1 day',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    array['school', 'admin'],
    '{"channel":"school-portal"}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Plan weekly meals',
    'Draft dinner plan for the next seven days before the grocery trip.',
    'home',
    'open',
    'medium',
    now() + interval '3 days',
    '00000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    array['meal-plan', 'shopping'],
    '{"servings":4}'::jsonb
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Order new football socks',
    'Current pair is worn out before next practice cycle.',
    'activity',
    'open',
    'low',
    now() - interval '1 day',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    array['sports', 'shopping'],
    '{"size":"junior"}'::jsonb
  )
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  status = excluded.status,
  priority = excluded.priority,
  due_at = excluded.due_at,
  owner_person_id = excluded.owner_person_id,
  related_event_id = excluded.related_event_id,
  tags = excluded.tags,
  metadata = excluded.metadata;

insert into public.knowledge_items (
  id,
  title,
  content,
  category,
  status,
  source,
  owner_person_id,
  tags,
  metadata
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'Morning school routine',
    'Wake Aarav at 6:45, breakfast by 7:10, leave the house at 7:45 with PE kit checked on Tuesdays.',
    'routine',
    'active',
    'family note',
    '00000000-0000-0000-0000-000000000002',
    array['school', 'routine'],
    '{"weekday_only":true}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Favourite grocery staples',
    'Milk, eggs, Greek yogurt, berries, chapati flour, lunchbox snacks, and dishwasher tablets.',
    'shopping',
    'active',
    'family note',
    '00000000-0000-0000-0000-000000000001',
    array['shopping', 'kitchen'],
    '{"store_preference":"Tesco"}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Football kit checklist',
    'Boots, shin pads, blue socks, water bottle, training top, and a lightweight rain jacket.',
    'activity',
    'active',
    'coach reminder',
    '00000000-0000-0000-0000-000000000003',
    array['sports', 'checklist'],
    '{"bag_location":"hall cupboard"}'::jsonb
  )
on conflict (id) do update
set
  title = excluded.title,
  content = excluded.content,
  category = excluded.category,
  status = excluded.status,
  source = excluded.source,
  owner_person_id = excluded.owner_person_id,
  tags = excluded.tags,
  metadata = excluded.metadata;
