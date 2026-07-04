-- Syllabify — learner tracks & course kinds
--
-- Splits the catalogue into three kinds of content and ties access to the
-- learner's track:
--   · university courses      → university students only
--   · graduate_brochure       → fresh graduates only (graduate trainee brochures)
--   · digital_skill           → everyone (programming, ML, design, …)
-- The track is chosen at signup (or later from the dashboard) and enforced
-- server-side in the enrol action.

-- Learner track on profiles ------------------------------------------------
alter table public.profiles
  add column if not exists track text
    check (track in ('student', 'graduate'));

-- Course kind ---------------------------------------------------------------
alter table public.courses
  add column if not exists kind text not null default 'university'
    check (kind in ('university', 'digital_skill', 'graduate_brochure'));

create index if not exists idx_courses_kind on public.courses(kind);

-- Store the track picked on the signup form (raw_user_meta_data->>'track').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, is_verified, track)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.email_confirmed_at is not null,
    case
      when new.raw_user_meta_data->>'track' in ('student', 'graduate')
        then new.raw_user_meta_data->>'track'
      else null
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
