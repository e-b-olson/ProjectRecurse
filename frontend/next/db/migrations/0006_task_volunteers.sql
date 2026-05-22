-- Join table: one row per (task, volunteer) pair
CREATE TABLE "task_volunteers" (
  "task_id"      uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  "user_id"      uuid NOT NULL,
  "volunteered_at" timestamp with time zone DEFAULT now(),
  PRIMARY KEY ("task_id", "user_id")
);

GRANT SELECT, INSERT, DELETE ON public.task_volunteers TO authenticated;

ALTER TABLE public.task_volunteers ENABLE ROW LEVEL SECURITY;

-- Anyone who can see the task's project can see its volunteers
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
  );

-- Any authenticated user can volunteer themselves (not others)
CREATE POLICY "task_volunteers_insert"
  ON public.task_volunteers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can withdraw their own volunteering; project owner can remove anyone
CREATE POLICY "task_volunteers_delete"
  ON public.task_volunteers
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_volunteers.task_id
        AND projects.owner_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';
