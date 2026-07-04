-- Syllabify — course levels, semesters, and general (GST) courses
--
-- University study runs across levels (100 to 600) and two semesters a year.
-- This splits the catalogue so a course can say exactly where it sits, and
-- adds a "general" flag for the year-one courses (Use of English, Nigerian
-- Peoples & Culture, Entrepreneurship, and so on) that every department in a
-- school takes together.
--
-- How the columns read for a university course:
--   · level      → 100, 200, 300, 400, 500 or 600 (null = not yet placed)
--   · semester   → 1 (first) or 2 (second)
--   · is_general → true for shared general-studies courses
--
-- A general course is defined once with is_general = true and department_id
-- left null, so it is not repeated under every department. Set university_id
-- to tie it to one school's general courses, or leave it null to share the
-- same general course across every university.

alter table public.courses
  add column if not exists level smallint
    check (level in (100, 200, 300, 400, 500, 600)),
  add column if not exists semester smallint
    check (semester in (1, 2)),
  add column if not exists is_general boolean not null default false;

create index if not exists idx_courses_level on public.courses(level);
create index if not exists idx_courses_semester on public.courses(semester);
-- General courses are read together often, so index just those rows.
create index if not exists idx_courses_general
  on public.courses(is_general) where is_general = true;
