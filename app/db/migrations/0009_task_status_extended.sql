-- Postgres requires each ALTER TYPE ... ADD VALUE to run outside a transaction
-- block when using certain clients, but Supabase/psql handles them fine sequentially.

ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'backlog';
ALTER TYPE task_status ADD VALUE IF NOT EXISTS 'in_review';

-- Update the column default to 'todo'
ALTER TABLE public.tasks ALTER COLUMN status SET DEFAULT 'todo';

NOTIFY pgrst, 'reload schema';
