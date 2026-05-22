-- Create projects table
CREATE TABLE "projects" (
  "id"          uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name"        text NOT NULL,
  "description" text,
  "creator_id"  uuid NOT NULL,
  "owner_id"    uuid NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now(),
  "updated_at"  timestamp with time zone DEFAULT now()
);

-- Grant authenticated users access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can read projects they created or own
CREATE POLICY "projects_select"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = owner_id);

-- Users can only insert projects where they are the creator
CREATE POLICY "projects_insert"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Only the owner can update a project
CREATE POLICY "projects_update"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Only the owner can delete a project
CREATE POLICY "projects_delete"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

NOTIFY pgrst, 'reload schema';
