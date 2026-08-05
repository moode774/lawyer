-- Applied to live project 2026-07-31 via MCP (migration: link_identity_and_client_user_id)
-- 1) Referential integrity: profiles.id -> auth.users.id
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_auth_users_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2) Link clients to their auth account
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);

-- 3) Replace email-based client policies with user_id-based ones
DROP POLICY IF EXISTS "Clients view own record" ON public.clients;
DROP POLICY IF EXISTS "Clients view own matters" ON public.matters;
DROP POLICY IF EXISTS "Clients view visible documents" ON public.documents;

CREATE POLICY "Clients view own record" ON public.clients
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Clients view own matters" ON public.matters
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Clients view visible documents" ON public.documents
  FOR SELECT TO authenticated
  USING (visibility = 'client'
     AND client_id IN (SELECT id FROM public.clients WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Clients view own appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = (SELECT auth.uid())));

CREATE POLICY "Clients view own portal messages" ON public.messages
  FOR SELECT TO authenticated
  USING (channel = 'portal'
     AND client_id IN (SELECT id FROM public.clients WHERE user_id = (SELECT auth.uid())));

-- 4) Self-claim by matching last 9 digits of the Saudi mobile number
CREATE OR REPLACE FUNCTION public.claim_client_account()
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  my_phone text;
  claimed_id uuid;
BEGIN
  SELECT u.phone INTO my_phone FROM auth.users u WHERE u.id = auth.uid();
  IF my_phone IS NULL OR length(regexp_replace(my_phone, '\D', '', 'g')) < 9 THEN
    RETURN NULL;
  END IF;

  SELECT id INTO claimed_id FROM public.clients WHERE user_id = auth.uid() LIMIT 1;
  IF claimed_id IS NOT NULL THEN RETURN claimed_id; END IF;

  UPDATE public.clients c
     SET user_id = auth.uid(), updated_at = now()
   WHERE c.user_id IS NULL
     AND right(regexp_replace(c.phone, '\D', '', 'g'), 9)
         = right(regexp_replace(my_phone, '\D', '', 'g'), 9)
  RETURNING c.id INTO claimed_id;

  RETURN claimed_id;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_client_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_client_account() TO authenticated;
