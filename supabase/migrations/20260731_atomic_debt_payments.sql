-- يسجل دفعة الذمة والقيد المالي في معاملة PostgreSQL واحدة.
-- الدالة SECURITY INVOKER، لذلك تبقى سياسات RLS مطبقة على المستدعي.
CREATE OR REPLACE FUNCTION public.record_debt_payment(
  p_debt_id UUID,
  p_amount NUMERIC,
  p_record_date DATE,
  p_payment_method TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_debt public.finance_debts%ROWTYPE;
  v_category_id UUID;
  v_record_id UUID;
  v_kind TEXT;
  v_fallback_name TEXT;
BEGIN
  IF NOT (SELECT private.is_staff()) THEN
    RAISE EXCEPTION 'غير مصرح بتنفيذ عملية مالية' USING ERRCODE = '42501';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'مبلغ الدفعة يجب أن يكون أكبر من صفر';
  END IF;
  IF p_record_date IS NULL THEN
    RAISE EXCEPTION 'تاريخ الدفعة مطلوب';
  END IF;
  IF p_payment_method NOT IN ('cash', 'transfer', 'card', 'cheque', 'other') THEN
    RAISE EXCEPTION 'طريقة الدفع غير صحيحة';
  END IF;

  SELECT * INTO v_debt
  FROM public.finance_debts
  WHERE id = p_debt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'الذمة غير موجودة';
  END IF;
  IF p_amount > (v_debt.total_amount - v_debt.paid_amount) THEN
    RAISE EXCEPTION 'مبلغ الدفعة يتجاوز المتبقي';
  END IF;

  v_kind := CASE WHEN v_debt.direction = 'receivable' THEN 'income' ELSE 'expense' END;
  v_fallback_name := CASE WHEN v_kind = 'income' THEN 'إيرادات أخرى' ELSE 'مصروفات أخرى' END;

  SELECT id INTO v_category_id
  FROM public.finance_categories
  WHERE kind = v_kind AND is_active = true
  ORDER BY (name_ar = v_fallback_name) DESC, sort_order DESC
  LIMIT 1;

  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'لا يوجد تصنيف مالي نشط لنوع الدفعة';
  END IF;

  INSERT INTO public.finance_records (
    kind, category_id, title, amount, vat_amount, record_date,
    payment_method, party_name, client_id, debt_id, created_by
  ) VALUES (
    v_kind,
    v_category_id,
    CASE WHEN v_debt.direction = 'receivable' THEN 'تحصيل دفعة — ' ELSE 'سداد دفعة — ' END || v_debt.title,
    p_amount,
    0,
    p_record_date,
    p_payment_method,
    v_debt.party_name,
    v_debt.client_id,
    v_debt.id,
    (SELECT auth.uid())
  ) RETURNING id INTO v_record_id;

  UPDATE public.finance_debts
  SET paid_amount = paid_amount + p_amount, updated_at = now()
  WHERE id = v_debt.id;

  RETURN v_record_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_debt_payment(UUID, NUMERIC, DATE, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_debt_payment(UUID, NUMERIC, DATE, TEXT) TO authenticated;

-- حماية أثر المراجعة: لا تُحذف ذمة لها دفعات، ولا يُعدّل/يحذف قيد أنشأته دفعة ذمة.
CREATE OR REPLACE FUNCTION public.protect_debt_financial_history()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF TG_TABLE_NAME = 'finance_debts' AND TG_OP = 'DELETE' AND OLD.paid_amount > 0 THEN
    RAISE EXCEPTION 'لا يمكن حذف ذمة لها دفعات مسجلة؛ استخدم إجراء عكس دفعة';
  END IF;
  IF TG_TABLE_NAME = 'finance_records' AND OLD.debt_id IS NOT NULL AND TG_OP IN ('UPDATE', 'DELETE') THEN
    RAISE EXCEPTION 'القيد مرتبط بدفعة ذمة ولا يمكن تعديله أو حذفه مباشرة';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.protect_debt_financial_history() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_paid_debt_delete ON public.finance_debts;
CREATE TRIGGER protect_paid_debt_delete
BEFORE DELETE ON public.finance_debts
FOR EACH ROW EXECUTE FUNCTION public.protect_debt_financial_history();

DROP TRIGGER IF EXISTS protect_debt_record_change ON public.finance_records;
CREATE TRIGGER protect_debt_record_change
BEFORE UPDATE OR DELETE ON public.finance_records
FOR EACH ROW EXECUTE FUNCTION public.protect_debt_financial_history();
