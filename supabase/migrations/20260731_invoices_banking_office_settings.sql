-- بيانات المكتب والفواتير والحسابات البنكية والتسويات.
CREATE TABLE public.business_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id),
  legal_name TEXT NOT NULL DEFAULT 'مكتب بن نوح للمحاماة والاستشارات القانونية',
  commercial_registration TEXT,
  vat_number TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  iban TEXT,
  bank_name TEXT,
  invoice_prefix TEXT NOT NULL DEFAULT 'INV',
  next_invoice_number BIGINT NOT NULL DEFAULT 1 CHECK (next_invoice_number > 0),
  fiscal_year_start SMALLINT NOT NULL DEFAULT 1 CHECK (fiscal_year_start BETWEEN 1 AND 12),
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 15 CHECK (vat_rate BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.business_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  iban TEXT,
  opening_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  matter_id UUID REFERENCES public.matters(id) ON DELETE SET NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','partially_paid','paid','void')),
  subtotal NUMERIC(14,2) NOT NULL CHECK (subtotal >= 0),
  vat_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (vat_amount >= 0),
  total_amount NUMERIC(14,2) NOT NULL CHECK (total_amount >= 0),
  paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0 AND paid_amount <= total_amount),
  currency TEXT NOT NULL DEFAULT 'SAR' CHECK (currency = 'SAR'),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_invoices_status_due ON public.invoices(status,due_date);

CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(14,2) NOT NULL CHECK (unit_price >= 0),
  vat_rate NUMERIC(5,2) NOT NULL DEFAULT 15 CHECK (vat_rate BETWEEN 0 AND 100),
  line_subtotal NUMERIC(14,2) NOT NULL,
  line_vat NUMERIC(14,2) NOT NULL,
  line_total NUMERIC(14,2) NOT NULL
);
CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);

ALTER TABLE public.finance_records ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

CREATE TABLE public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE RESTRICT,
  transaction_date DATE NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('credit','debit')),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  reference TEXT,
  finance_record_id UUID REFERENCES public.finance_records(id) ON DELETE SET NULL,
  reconciled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bank_transactions_account_date ON public.bank_transactions(bank_account_id,transaction_date DESC);
CREATE INDEX idx_bank_transactions_unreconciled ON public.bank_transactions(bank_account_id) WHERE reconciled = false;

CREATE TABLE public.invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','transfer','card','cheque','other')),
  reference TEXT,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  finance_record_id UUID NOT NULL UNIQUE REFERENCES public.finance_records(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoice_payments_invoice ON public.invoice_payments(invoice_id);

CREATE TABLE public.bank_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE RESTRICT,
  period_end DATE NOT NULL,
  statement_balance NUMERIC(14,2) NOT NULL,
  book_balance NUMERIC(14,2) NOT NULL,
  difference NUMERIC(14,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','completed')),
  notes TEXT,
  completed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bank_account_id, period_end)
);

ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_reconciliations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage business settings" ON public.business_settings FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage bank accounts" ON public.bank_accounts FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage invoices" ON public.invoices FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage invoice items" ON public.invoice_items FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage invoice payments" ON public.invoice_payments FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage bank transactions" ON public.bank_transactions FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage bank reconciliations" ON public.bank_reconciliations FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));

CREATE POLICY "Clients view own invoices" ON public.invoices FOR SELECT TO authenticated
USING (client_id IN (SELECT id FROM public.clients WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "Clients view own invoice items" ON public.invoice_items FOR SELECT TO authenticated
USING (invoice_id IN (SELECT i.id FROM public.invoices i JOIN public.clients c ON c.id=i.client_id WHERE c.user_id=(SELECT auth.uid())));
CREATE POLICY "Clients view own invoice payments" ON public.invoice_payments FOR SELECT TO authenticated
USING (invoice_id IN (SELECT i.id FROM public.invoices i JOIN public.clients c ON c.id=i.client_id WHERE c.user_id=(SELECT auth.uid())));

CREATE POLICY "Clients send portal messages" ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  channel='portal' AND direction='inbound' AND sender_id=(SELECT auth.uid())
  AND client_id IN (SELECT id FROM public.clients WHERE user_id=(SELECT auth.uid()))
);

CREATE OR REPLACE FUNCTION public.create_invoice(
  p_client_id UUID, p_matter_id UUID, p_issue_date DATE, p_due_date DATE,
  p_notes TEXT, p_items JSONB
) RETURNS UUID LANGUAGE plpgsql SECURITY INVOKER SET search_path=''
AS $$
DECLARE v_id UUID; v_number TEXT; v_sub NUMERIC(14,2); v_vat NUMERIC(14,2); v_total NUMERIC(14,2); v_item JSONB;
BEGIN
  IF NOT (SELECT private.is_staff()) THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF p_due_date < p_issue_date THEN RAISE EXCEPTION 'تاريخ الاستحقاق يسبق تاريخ الإصدار'; END IF;
  IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items)=0 THEN RAISE EXCEPTION 'أضف بندًا واحدًا على الأقل'; END IF;
  SELECT invoice_prefix||'-'||to_char(p_issue_date,'YYYY')||'-'||lpad(next_invoice_number::text,5,'0') INTO v_number
  FROM public.business_settings WHERE id=true FOR UPDATE;
  UPDATE public.business_settings SET next_invoice_number=next_invoice_number+1,updated_at=now() WHERE id=true;
  SELECT round(sum((x->>'quantity')::numeric*(x->>'unit_price')::numeric),2),
         round(sum((x->>'quantity')::numeric*(x->>'unit_price')::numeric*COALESCE((x->>'vat_rate')::numeric,0)/100),2)
  INTO v_sub,v_vat FROM jsonb_array_elements(p_items) x;
  v_total:=v_sub+v_vat;
  INSERT INTO public.invoices(invoice_number,client_id,matter_id,issue_date,due_date,status,subtotal,vat_amount,total_amount,notes,created_by)
  VALUES(v_number,p_client_id,p_matter_id,p_issue_date,p_due_date,'issued',v_sub,v_vat,v_total,NULLIF(trim(p_notes),''),(SELECT auth.uid())) RETURNING id INTO v_id;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO public.invoice_items(invoice_id,description,quantity,unit_price,vat_rate,line_subtotal,line_vat,line_total)
    SELECT v_id,trim(v_item->>'description'),(v_item->>'quantity')::numeric,(v_item->>'unit_price')::numeric,COALESCE((v_item->>'vat_rate')::numeric,0),
      round((v_item->>'quantity')::numeric*(v_item->>'unit_price')::numeric,2),
      round((v_item->>'quantity')::numeric*(v_item->>'unit_price')::numeric*COALESCE((v_item->>'vat_rate')::numeric,0)/100,2),
      round((v_item->>'quantity')::numeric*(v_item->>'unit_price')::numeric*(1+COALESCE((v_item->>'vat_rate')::numeric,0)/100),2);
  END LOOP;
  RETURN v_id;
END; $$;
REVOKE ALL ON FUNCTION public.create_invoice(UUID,UUID,DATE,DATE,TEXT,JSONB) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.create_invoice(UUID,UUID,DATE,DATE,TEXT,JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.record_invoice_payment(
  p_invoice_id UUID,p_amount NUMERIC,p_payment_date DATE,p_method TEXT,p_reference TEXT,p_bank_account_id UUID
) RETURNS UUID LANGUAGE plpgsql SECURITY INVOKER SET search_path=''
AS $$
DECLARE v_inv public.invoices%ROWTYPE; v_cat UUID; v_fin UUID; v_payment UUID; v_new_paid NUMERIC;
BEGIN
  IF NOT (SELECT private.is_staff()) THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  SELECT * INTO v_inv FROM public.invoices WHERE id=p_invoice_id FOR UPDATE;
  IF NOT FOUND OR v_inv.status='void' THEN RAISE EXCEPTION 'الفاتورة غير متاحة'; END IF;
  IF p_amount<=0 OR p_amount>(v_inv.total_amount-v_inv.paid_amount) THEN RAISE EXCEPTION 'مبلغ السداد غير صحيح'; END IF;
  SELECT id INTO v_cat FROM public.finance_categories WHERE kind='income' AND is_active=true ORDER BY (name_ar='أتعاب قضايا') DESC,sort_order LIMIT 1;
  INSERT INTO public.finance_records(kind,category_id,title,amount,vat_amount,record_date,payment_method,party_name,client_id,matter_id,invoice_id,created_by)
  SELECT 'income',v_cat,'سداد فاتورة — '||v_inv.invoice_number,p_amount,0,p_payment_date,p_method,c.full_name,v_inv.client_id,v_inv.matter_id,v_inv.id,(SELECT auth.uid())
  FROM public.clients c WHERE c.id=v_inv.client_id RETURNING id INTO v_fin;
  INSERT INTO public.invoice_payments(invoice_id,amount,payment_date,payment_method,reference,bank_account_id,finance_record_id,created_by)
  VALUES(v_inv.id,p_amount,p_payment_date,p_method,NULLIF(trim(p_reference),''),p_bank_account_id,v_fin,(SELECT auth.uid())) RETURNING id INTO v_payment;
  IF p_bank_account_id IS NOT NULL THEN
    INSERT INTO public.bank_transactions(bank_account_id,transaction_date,direction,amount,description,reference,finance_record_id)
    VALUES(p_bank_account_id,p_payment_date,'credit',p_amount,'تحصيل '||v_inv.invoice_number,NULLIF(trim(p_reference),''),v_fin);
  END IF;
  v_new_paid:=v_inv.paid_amount+p_amount;
  UPDATE public.invoices SET paid_amount=v_new_paid,status=CASE WHEN v_new_paid>=total_amount THEN 'paid' ELSE 'partially_paid' END,updated_at=now() WHERE id=v_inv.id;
  RETURN v_payment;
END; $$;
REVOKE ALL ON FUNCTION public.record_invoice_payment(UUID,NUMERIC,DATE,TEXT,TEXT,UUID) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.record_invoice_payment(UUID,NUMERIC,DATE,TEXT,TEXT,UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.reconcile_bank_account(
  p_bank_account_id UUID,p_period_end DATE,p_statement_balance NUMERIC,p_notes TEXT
) RETURNS UUID LANGUAGE plpgsql SECURITY INVOKER SET search_path=''
AS $$
DECLARE v_opening NUMERIC; v_book NUMERIC; v_diff NUMERIC; v_id UUID;
BEGIN
  IF NOT (SELECT private.is_staff()) THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  SELECT opening_balance INTO v_opening FROM public.bank_accounts WHERE id=p_bank_account_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'الحساب البنكي غير موجود'; END IF;
  SELECT v_opening + COALESCE(sum(CASE WHEN direction='credit' THEN amount ELSE -amount END),0)
  INTO v_book FROM public.bank_transactions WHERE bank_account_id=p_bank_account_id AND transaction_date<=p_period_end;
  v_diff:=round(p_statement_balance-v_book,2);
  INSERT INTO public.bank_reconciliations(bank_account_id,period_end,statement_balance,book_balance,difference,status,notes,completed_by,completed_at)
  VALUES(p_bank_account_id,p_period_end,p_statement_balance,v_book,v_diff,CASE WHEN v_diff=0 THEN 'completed' ELSE 'draft' END,NULLIF(trim(p_notes),''),CASE WHEN v_diff=0 THEN (SELECT auth.uid()) END,CASE WHEN v_diff=0 THEN now() END)
  ON CONFLICT(bank_account_id,period_end) DO UPDATE SET statement_balance=excluded.statement_balance,book_balance=excluded.book_balance,difference=excluded.difference,status=excluded.status,notes=excluded.notes,completed_by=excluded.completed_by,completed_at=excluded.completed_at
  RETURNING id INTO v_id;
  IF v_diff=0 THEN UPDATE public.bank_transactions SET reconciled=true WHERE bank_account_id=p_bank_account_id AND transaction_date<=p_period_end; END IF;
  RETURN v_id;
END; $$;
REVOKE ALL ON FUNCTION public.reconcile_bank_account(UUID,DATE,NUMERIC,TEXT) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.reconcile_bank_account(UUID,DATE,NUMERIC,TEXT) TO authenticated;
