-- webinar_waitlist: Agency Systems workshop waitlist
create table if not exists public.webinar_waitlist (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  work_email text not null,
  agency_website text not null,
  selected_process text not null,
  other_process text,
  source_path text,
  created_at timestamptz not null default now(),
  constraint webinar_waitlist_work_email_key unique (work_email),
  constraint webinar_waitlist_email_format check (work_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint webinar_waitlist_process_check check (
    selected_process in (
      'Client reporting',
      'Lead qualification',
      'Call QA',
      'Campaign setup',
      'Appointment handover',
      'Other'
    )
  )
);

create index if not exists webinar_waitlist_created_at_idx
  on public.webinar_waitlist (created_at desc);

alter table public.webinar_waitlist enable row level security;

revoke all on table public.webinar_waitlist from anon, authenticated;
grant all on table public.webinar_waitlist to service_role;
