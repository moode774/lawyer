-- Applied to live project 2026-07-31 via MCP (migration: finance_debts_receivables_payables)
CREATE TABLE public.finance_debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction TEXT NOT NULL CHECK (direction IN ('receivable', 'payable')),
  party_name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount > 0),
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  due_date DATE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (paid_amount <= total_amount)
);
CREATE INDEX idx_finance_debts_direction ON public.finance_debts(direction);
CREATE INDEX idx_finance_debts_due ON public.finance_debts(due_date);

ALTER TABLE public.finance_records
  ADD COLUMN debt_id UUID REFERENCES public.finance_debts(id) ON DELETE SET NULL;

ALTER TABLE public.finance_debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage finance debts" ON public.finance_debts
  FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
