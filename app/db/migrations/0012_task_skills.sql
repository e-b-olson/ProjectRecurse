-- Project-scoped skills and task ↔ skill associations
ALTER TABLE "skills" ADD COLUMN "project_id" uuid REFERENCES projects(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX "skills_project_name_unique" ON "skills" ("project_id", lower("name"));

CREATE TABLE "task_skills" (
  "task_id" uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  "skill_id" uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY ("task_id", "skill_id")
);

GRANT SELECT, INSERT, DELETE ON public.skills TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.task_skills TO authenticated;

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_skills ENABLE ROW LEVEL SECURITY;

-- Project members can read skills scoped to their project
CREATE POLICY "skills_select"
  ON public.skills
  FOR SELECT
  TO authenticated
  USING (
    project_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = skills.project_id
        AND (projects.creator_id = auth.uid() OR projects.owner_id = auth.uid())
    )
  );

-- Project owner or any task creator in the project can add project-scoped skills
CREATE POLICY "skills_insert"
  ON public.skills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IS NOT NULL
    AND (
      EXISTS (
        SELECT 1 FROM projects
        WHERE projects.id = skills.project_id
          AND projects.owner_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM tasks
        WHERE tasks.project_id = skills.project_id
          AND tasks.created_by = auth.uid()
      )
    )
  );

-- Anyone who can see the task's project can see its skill links
CREATE POLICY "task_skills_select"
  ON public.task_skills
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_skills.task_id
        AND (projects.creator_id = auth.uid() OR projects.owner_id = auth.uid())
    )
  );

-- Task creator or project owner can attach skills to a task
CREATE POLICY "task_skills_insert"
  ON public.task_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_skills.task_id
        AND (tasks.created_by = auth.uid() OR projects.owner_id = auth.uid())
    )
    AND EXISTS (
      SELECT 1 FROM skills
      JOIN tasks ON tasks.project_id = skills.project_id
      WHERE skills.id = task_skills.skill_id
        AND tasks.id = task_skills.task_id
        AND skills.project_id IS NOT NULL
    )
  );

-- Task creator or project owner can remove skills from a task
CREATE POLICY "task_skills_delete"
  ON public.task_skills
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_skills.task_id
        AND (tasks.created_by = auth.uid() OR projects.owner_id = auth.uid())
    )
  );

NOTIFY pgrst, 'reload schema';
