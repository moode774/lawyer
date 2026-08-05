CREATE INDEX IF NOT EXISTS idx_bank_reconciliations_completed_by ON public.bank_reconciliations(completed_by);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_finance_record ON public.bank_transactions(finance_record_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_bank_account ON public.invoice_payments(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_invoice_payments_created_by ON public.invoice_payments(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON public.invoices(created_by);
CREATE INDEX IF NOT EXISTS idx_invoices_matter ON public.invoices(matter_id);
CREATE INDEX IF NOT EXISTS idx_finance_records_invoice ON public.finance_records(invoice_id);
