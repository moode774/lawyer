-- Applied to live project 2026-07-31 via MCP (migration: finance_module_records_categories_storage)
CREATE TABLE public.finance_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind TEXT NOT NULL CHECK (kind IN ('expense', 'income')),
  name_ar TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, name_ar)
);

CREATE TABLE public.finance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind TEXT NOT NULL CHECK (kind IN ('expense', 'income')),
  category_id UUID NOT NULL REFERENCES public.finance_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (vat_amount >= 0),
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'transfer'
    CHECK (payment_method IN ('cash', 'transfer', 'card', 'cheque', 'other')),
  party_name TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  matter_id UUID REFERENCES public.matters(id) ON DELETE SET NULL,
  notes TEXT,
  attachment_path TEXT,
  attachment_name TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_finance_records_date ON public.finance_records(record_date);
CREATE INDEX idx_finance_records_kind ON public.finance_records(kind);
CREATE INDEX idx_finance_records_category ON public.finance_records(category_id);
CREATE INDEX idx_finance_records_client ON public.finance_records(client_id);

ALTER TABLE public.finance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage finance categories" ON public.finance_categories
  FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage finance records" ON public.finance_records
  FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));

INSERT INTO public.finance_categories (kind, name_ar, sort_order) VALUES
  ('expense', 'إيجار المكتب', 10),
  ('expense', 'كهرباء', 20),
  ('expense', 'ماء', 30),
  ('expense', 'إنترنت واتصالات', 40),
  ('expense', 'رواتب وأجور', 50),
  ('expense', 'اشتراكات تقنية وبرمجيات', 60),
  ('expense', 'دومين واستضافة', 70),
  ('expense', 'رسوم حكومية وتراخيص', 80),
  ('expense', 'تسويق وإعلان', 90),
  ('expense', 'قرطاسية ومستلزمات مكتبية', 100),
  ('expense', 'ضيافة ونظافة', 110),
  ('expense', 'مواصلات وانتقالات', 120),
  ('expense', 'مصروفات أخرى', 900),
  ('income', 'أتعاب استشارات', 10),
  ('income', 'أتعاب قضايا', 20),
  ('income', 'أتعاب صياغة عقود ولوائح', 30),
  ('income', 'إيرادات أخرى', 900);

INSERT INTO storage.buckets (id, name, public)
VALUES ('finance-attachments', 'finance-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Staff read finance attachments" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'finance-attachments' AND (SELECT private.is_staff()));
CREATE POLICY "Staff upload finance attachments" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'finance-attachments' AND (SELECT private.is_staff()));
CREATE POLICY "Staff delete finance attachments" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'finance-attachments' AND (SELECT private.is_staff()));
