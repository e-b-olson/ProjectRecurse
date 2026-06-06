-- Task status enum
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

-- Tasks table
CREATE TABLE "tasks" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "project_id"  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "title"       text NOT NULL,
  "description" text,
  "status"      task_status NOT NULL DEFAULT 'todo',
  "created_by"  uuid NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now(),
  "updated_at"  timestamp with time zone DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Anyone who can see the project can see its tasks
CREATE POLICY "tasks_select"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
        AND (projects.creator_id = auth.uid() OR projects.owner_id = auth.uid())
    )
  );

-- Only the project owner can insert tasks
CREATE POLICY "tasks_insert"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
        AND projects.owner_id = auth.uid()
    )
  );

-- Only the project owner can update tasks
CREATE POLICY "tasks_update"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
        AND projects.owner_id = auth.uid()
    )
  );

-- Only the project owner can delete tasks
CREATE POLICY "tasks_delete"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
        AND projects.owner_id = auth.uid()
    )
  );

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

NOTIFY pgrst, 'reload schema';
