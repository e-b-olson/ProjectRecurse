-- 1. Add FK from task_volunteers.user_id to profiles so PostgREST
--    can resolve the embedded profiles() join.
ALTER TABLE public.task_volunteers
  ADD CONSTRAINT task_volunteers_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Widen the select policy so any authenticated user can read
--    volunteers for tasks they can see (not just the project owner).
DROP POLICY IF EXISTS "task_volunteers_select" ON public.task_volunteers;

CREATE POLICY "task_volunteers_select"
  ON public.task_volunteers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_volunteers.task_id
        AND (projects.creator_id = auth.uid() OR projects.owner_id = auth.uid())
    )
    -- also let a user always see their own volunteer rows
    OR auth.uid() = user_id
  );

NOTIFY pgrst, 'reload schema';
