REVOKE ALL ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.save_marketing_credentials(p_platform TEXT, p_credentials TEXT)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, vault, pg_temp
AS $$
DECLARE v_id UUID; v_name TEXT;
BEGIN
  IF p_platform NOT IN ('meta','google','tiktok','snapchat') OR length(p_credentials) < 5 THEN RAISE EXCEPTION 'بيانات الربط غير صالحة'; END IF;
  v_name := 'marketing_' || p_platform || '_credentials';
  SELECT id INTO v_id FROM vault.secrets WHERE name = v_name;
  IF v_id IS NULL THEN
    SELECT vault.create_secret(p_credentials, v_name, 'Encrypted marketing platform credentials') INTO v_id;
  ELSE
    PERFORM vault.update_secret(v_id, p_credentials, v_name, 'Encrypted marketing platform credentials');
  END IF;
  UPDATE public.marketing_connections SET vault_secret_id=v_id, updated_at=now() WHERE platform=p_platform;
  RETURN v_id;
END $$;

REVOKE ALL ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_marketing_credentials(TEXT,TEXT) TO service_role;
