-- Optional demo seed: a few categories and published courses so the
-- catalogue isn't empty on first run. Safe to run multiple times.

insert into public.categories (name, slug, description) values
  ('Computer Science', 'computer-science', 'Programming, algorithms, and systems.'),
  ('Mathematics',      'mathematics',      'Calculus, algebra, and statistics.'),
  ('Engineering',      'engineering',      'Core engineering fundamentals.'),
  ('Career & Skills',  'career-skills',    'CV writing, interviews, and soft skills.')
on conflict (slug) do nothing;

insert into public.courses (title, slug, description, is_published, category_id)
select
  v.title, v.slug, v.description, true, c.id
from (values
  ('Introduction to Python', 'introduction-to-python',
   'Start coding from zero. Variables, loops, functions, and your first programs.', 'computer-science'),
  ('Data Structures & Algorithms', 'data-structures-and-algorithms',
   'The toolkit every developer needs: arrays, trees, graphs, and Big-O thinking.', 'computer-science'),
  ('Calculus I', 'calculus-i',
   'Limits, derivatives, and integrals explained clearly for first-year students.', 'mathematics'),
  ('Ace Your First Job Interview', 'ace-your-first-job-interview',
   'Practical prep for fresh graduates: CVs, portfolios, and interview answers.', 'career-skills')
) as v(title, slug, description, cat_slug)
join public.categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;
