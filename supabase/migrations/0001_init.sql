-- Syllabify — initial schema, RLS policies, triggers
-- Run this in the Supabase SQL editor (or via `supabase db push`).

-- =====================================================================
-- Extensions
-- =====================================================================
create extension if not exists "pgcrypto";

-- =====================================================================
-- Tables
-- =====================================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  role        text default 'student' check (role in ('student', 'admin')),
  is_verified boolean default false,
  created_at  timestamptz default now()
);

-- Categories
create table if not exists public.categories (
  id          uuid default gen_random_uuid() primary key,
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz default now()
);

-- Courses
create table if not exists public.courses (
  id            uuid default gen_random_uuid() primary key,
  title         text not null,
  slug          text not null unique,
  description   text,
  thumbnail_url text,
  category_id   uuid references public.categories(id) on delete set null,
  is_published  boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Materials (PDFs, videos, notes per course)
create table if not exists public.materials (
  id                   uuid default gen_random_uuid() primary key,
  course_id            uuid references public.courses(id) on delete cascade,
  title                text not null,
  type                 text check (type in ('pdf', 'video', 'note')),
  cloudinary_public_id text,
  cloudinary_url       text,
  content              text,
  order_index          integer default 0,
  is_published         boolean default false,
  created_at           timestamptz default now()
);

-- Enrollments
create table if not exists public.enrollments (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references public.profiles(id) on delete cascade,
  course_id   uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique (user_id, course_id)
);

-- Progress
create table if not exists public.progress (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade,
  material_id   uuid references public.materials(id) on delete cascade,
  completed     boolean default false,
  last_accessed timestamptz default now(),
  unique (user_id, material_id)
);

-- Helpful indexes
create index if not exists idx_courses_category on public.courses(category_id);
create index if not exists idx_materials_course on public.materials(course_id);
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_progress_user on public.progress(user_id);

-- =====================================================================
-- Helper: is the current request the configured admin?
-- =====================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =====================================================================
-- New-user trigger: auto-create a profile row on signup
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, is_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.is_verified in sync once email is confirmed
create or replace function public.handle_user_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null then
    update public.profiles set is_verified = true where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update of email_confirmed_at on auth.users
  for each row execute function public.handle_user_confirmed();

-- Keep courses.updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_courses_updated on public.courses;
create trigger on_courses_updated
  before update on public.courses
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================

-- Profiles ------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Categories ----------------------------------------------------------
alter table public.categories enable row level security;

create policy "Anyone authenticated can read categories"
  on public.categories for select
  to authenticated
  using (true);

-- Courses -------------------------------------------------------------
alter table public.courses enable row level security;

create policy "Read published courses"
  on public.courses for select
  to authenticated
  using (is_published = true);

-- Materials -----------------------------------------------------------
alter table public.materials enable row level security;

create policy "Enrolled users read published materials"
  on public.materials for select
  to authenticated
  using (
    is_published = true
    and exists (
      select 1 from public.enrollments
      where enrollments.user_id = auth.uid()
        and enrollments.course_id = materials.course_id
    )
  );

-- Enrollments ---------------------------------------------------------
alter table public.enrollments enable row level security;

create policy "Users read own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Users create own enrollments"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users delete own enrollments"
  on public.enrollments for delete
  using (auth.uid() = user_id);

-- Progress ------------------------------------------------------------
alter table public.progress enable row level security;

create policy "Users read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- NOTE: All admin writes go through the Supabase *service role* client
-- (server-side only), which bypasses RLS. No client-side write policies
-- are granted, so students can never mutate courses/materials.
