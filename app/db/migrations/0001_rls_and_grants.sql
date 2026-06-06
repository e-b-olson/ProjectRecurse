-- Grant PostgREST (anon + authenticated roles) access to the public schema
-- and to the beta_registrations table so Supabase can expose it via its API.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Only grant INSERT to anon — RLS policies further restrict what is allowed,
-- but it's better practice to not grant more than necessary in the first place.
GRANT INSERT ON public.beta_registrations TO anon;

-- Enable Row Level Security
ALTER TABLE public.beta_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated visitors) to insert a registration
CREATE POLICY "allow_public_insert"
  ON public.beta_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Reload PostgREST schema cache so the table becomes visible immediately
NOTIFY pgrst, 'reload schema';
