-- ربط حساب الجوال بسجل العميل داخل trigger التسجيل فقط، وإزالة RPC المكشوفة.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_client_id UUID;
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name_ar, role)
  VALUES (
    new.id,
    COALESCE(new.email, new.id::text || '@phone.local'),
    new.phone,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'عميل بن نوح'),
    'client'
  )
  ON CONFLICT (id) DO UPDATE
    SET phone = COALESCE(excluded.phone, public.profiles.phone);

  IF new.phone IS NOT NULL THEN
    SELECT min(c.id) INTO v_client_id
    FROM public.clients c
    WHERE c.user_id IS NULL
      AND right(regexp_replace(c.phone, '\D', '', 'g'), 9)
          = right(regexp_replace(new.phone, '\D', '', 'g'), 9)
    HAVING count(*) = 1;

    IF v_client_id IS NOT NULL THEN
      UPDATE public.clients SET user_id = new.id, updated_at = now()
      WHERE id = v_client_id AND user_id IS NULL;
    END IF;
  END IF;
  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
DROP FUNCTION IF EXISTS public.claim_client_account();
