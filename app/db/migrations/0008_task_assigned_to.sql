-- Add assigned_to column to tasks (nullable FK to profiles)
ALTER TABLE public.tasks
  ADD COLUMN "assigned_to" uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- The existing tasks_update policy already allows the project owner to update
-- any task field, so no policy changes are needed.

NOTIFY pgrst, 'reload schema';
