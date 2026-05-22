-- Allow task creators to update their own task's description
-- (project owners can already update any task via the existing policy)
DROP POLICY IF EXISTS "tasks_update" ON public.tasks;

CREATE POLICY "tasks_update"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    -- project owner can update any task
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
        AND projects.owner_id = auth.uid()
    )
    OR
    -- task creator can update their own task
    auth.uid() = tasks.created_by
  );

NOTIFY pgrst, 'reload schema';
