CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

CREATE TABLE IF NOT EXISTS public.marketing_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('meta','google','tiktok','snapchat')),
  account_name TEXT,
  account_id TEXT,
  status TEXT NOT NULL DEFAULT 'not_configured' CHECK (status IN ('connected','not_configured','error','expired')),
  scopes TEXT[] NOT NULL DEFAULT '{}',
  vault_secret_id UUID,
  token_status TEXT NOT NULL DEFAULT 'missing' CHECK (token_status IN ('valid','expired','missing')),
  connected_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('meta','google','tiktok','snapchat')),
  external_id TEXT,
  name TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT 'leads',
  service TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  budget_type TEXT NOT NULL DEFAULT 'total',
  budget NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
  spend NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (spend >= 0),
  impressions BIGINT NOT NULL DEFAULT 0,
  reach BIGINT NOT NULL DEFAULT 0,
  clicks BIGINT NOT NULL DEFAULT 0,
  leads BIGINT NOT NULL DEFAULT 0,
  conversions BIGINT NOT NULL DEFAULT 0,
  revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  audience JSONB NOT NULL DEFAULT '{}',
  ads JSONB NOT NULL DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(platform, external_id)
);

ALTER TABLE public.marketing_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage marketing connections" ON public.marketing_connections
  FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage marketing campaigns" ON public.marketing_campaigns
  FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_connections, public.marketing_campaigns TO authenticated;
REVOKE ALL ON public.marketing_connections, public.marketing_campaigns FROM anon;

INSERT INTO public.marketing_connections(platform)
VALUES ('meta'),('google'),('tiktok'),('snapchat') ON CONFLICT (platform) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_platform_status ON public.marketing_campaigns(platform,status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_created_at ON public.marketing_campaigns(created_at DESC);

CREATE OR REPLACE FUNCTION public.save_marketing_credentials(p_platform TEXT, p_credentials TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, vault, pg_temp
AS $$
DECLARE v_id UUID; v_name TEXT;
BEGIN
  IF NOT (SELECT private.is_staff()) THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF p_platform NOT IN ('meta','google','tiktok','snapchat') OR length(p_credentials) < 5 THEN RAISE EXCEPTION 'بيانات الربط غير صالحة'; END IF;
  v_name := 'marketing_' || p_platform || '_credentials';
  SELECT id INTO v_id FROM vault.secrets WHERE name = v_name;
  IF v_id IS NULL THEN
    SELECT vault.create_secret(p_credentials, v_name, 'Encrypted marketing platform credentials') INTO v_id;
  ELSE
    PERFORM vault.update_secret(v_id, p_credentials, v_name, 'Encrypted marketing platform credentials');
  END IF;
  UPDATE public.marketing_connections SET vault_secret_id=v_id, updated_at=now(), created_by=COALESCE(created_by,(SELECT auth.uid())) WHERE platform=p_platform;
  RETURN v_id;
END $$;

CREATE OR REPLACE FUNCTION public.read_marketing_credentials(p_platform TEXT)
RETURNS TEXT
LANGUAGE sql SECURITY DEFINER
SET search_path = public, vault, pg_temp
AS $$
  SELECT ds.decrypted_secret
  FROM public.marketing_connections mc
  JOIN vault.decrypted_secrets ds ON ds.id=mc.vault_secret_id
  WHERE mc.platform=p_platform
$$;

REVOKE ALL ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) TO authenticated;
REVOKE ALL ON FUNCTION public.read_marketing_credentials(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_marketing_credentials(TEXT) TO service_role;
