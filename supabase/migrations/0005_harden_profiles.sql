-- Syllabify — lock down profile self-service writes
--
-- Migration 0001 granted `authenticated` blanket table privileges, and the
-- "Users update own profile" RLS policy limits *rows* but not *columns*.
-- Combined, any signed-in user could update their own `role` to 'admin'
-- (or flip `is_verified`) straight from the browser console. `is_admin()`
-- trusts that column, so this was a privilege-escalation path.
--
-- Fix: users may update only their name, avatar, and learner track. Role
-- and verification flags are written exclusively by the service role and
-- the security-definer signup triggers.

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, avatar_url, track) on public.profiles to authenticated;

-- Signup inserts happen in handle_new_user(), which runs as its owner
-- (security definer), so revoking INSERT from clients does not affect it.
