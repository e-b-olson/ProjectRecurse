-- Extend tasks_update policy to also allow the assigned user to update the task.
-- This is needed so the assignee can transition status via the action buttons.
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
    OR
    -- assignee can update the task (e.g. transition status)
    auth.uid() = tasks.assigned_to
  );

NOTIFY pgrst, 'reload schema';
