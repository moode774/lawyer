import { supabase } from './supabase'
import type { PaymentMethod } from './finance'

export interface InvoiceItemInput { description: string; quantity: number; unitPrice: number; vatRate: number }
export interface Invoice {
  id:string; number:string; clientId:string; clientName:string; matterId?:string; issueDate:string; dueDate:string;
  status:'draft'|'issued'|'partially_paid'|'paid'|'void'; subtotal:number; vatAmount:number; total:number; paid:number; notes?:string
}
export interface BankAccount { id:string; name:string; bankName:string; iban?:string; openingBalance:number; balance:number; active:boolean }
export interface BankTransaction { id:string; accountId:string; date:string; direction:'credit'|'debit'; amount:number; description:string; reference?:string; reconciled:boolean }
export interface Reconciliation { id:string; accountId:string; periodEnd:string; statementBalance:number; bookBalance:number; difference:number; status:'draft'|'completed' }

export async function listInvoiceClients() {
  const { data,error }=await supabase.from('clients').select('id,full_name,reference_number').order('full_name')
  if(error) throw new Error(error.message); return data||[]
}
export async function listInvoices():Promise<Invoice[]> {
  const {data,error}=await supabase.from('invoices').select('*,clients(full_name)').order('issue_date',{ascending:false})
  if(error) throw new Error(`تعذر تحميل الفواتير: ${error.message}`)
  return (data||[]).map((r:any)=>({id:r.id,number:r.invoice_number,clientId:r.client_id,clientName:r.clients?.full_name||'',matterId:r.matter_id||undefined,issueDate:r.issue_date,dueDate:r.due_date,status:r.status,subtotal:Number(r.subtotal),vatAmount:Number(r.vat_amount),total:Number(r.total_amount),paid:Number(r.paid_amount),notes:r.notes||undefined}))
}
export async function createInvoice(input:{clientId:string;matterId?:string;issueDate:string;dueDate:string;notes?:string;items:InvoiceItemInput[]}) {
  const {error}=await supabase.rpc('create_invoice',{p_client_id:input.clientId,p_matter_id:input.matterId||null,p_issue_date:input.issueDate,p_due_date:input.dueDate,p_notes:input.notes||'',p_items:input.items.map(i=>({description:i.description,quantity:i.quantity,unit_price:i.unitPrice,vat_rate:i.vatRate}))})
  if(error) throw new Error(`تعذر إنشاء الفاتورة: ${error.message}`)
}
export async function recordInvoicePayment(input:{invoiceId:string;amount:number;date:string;method:PaymentMethod;reference?:string;bankAccountId?:string}) {
  const {error}=await supabase.rpc('record_invoice_payment',{p_invoice_id:input.invoiceId,p_amount:input.amount,p_payment_date:input.date,p_method:input.method,p_reference:input.reference||'',p_bank_account_id:input.bankAccountId||null})
  if(error) throw new Error(`تعذر تسجيل السداد: ${error.message}`)
}
export async function listBankAccounts():Promise<BankAccount[]> {
  const {data,error}=await supabase.from('bank_accounts').select('*,bank_transactions(direction,amount)')
  if(error) throw new Error(`تعذر تحميل الحسابات: ${error.message}`)
  return (data||[]).map((r:any)=>{const balance=(r.bank_transactions||[]).reduce((n:number,t:any)=>n+(t.direction==='credit'?Number(t.amount):-Number(t.amount)),Number(r.opening_balance));return{id:r.id,name:r.name,bankName:r.bank_name,iban:r.iban||undefined,openingBalance:Number(r.opening_balance),balance,active:r.is_active}})
}
export async function createBankAccount(input:{name:string;bankName:string;iban?:string;openingBalance:number}) {
  const {error}=await supabase.from('bank_accounts').insert({name:input.name.trim(),bank_name:input.bankName.trim(),iban:input.iban?.trim()||null,opening_balance:input.openingBalance})
  if(error) throw new Error(`تعذر إنشاء الحساب: ${error.message}`)
}
export async function listBankTransactions(accountId?:string):Promise<BankTransaction[]> {
  let q=supabase.from('bank_transactions').select('*').order('transaction_date',{ascending:false});if(accountId)q=q.eq('bank_account_id',accountId)
  const {data,error}=await q;if(error)throw new Error(`تعذر تحميل الحركات: ${error.message}`)
  return(data||[]).map((r:any)=>({id:r.id,accountId:r.bank_account_id,date:r.transaction_date,direction:r.direction,amount:Number(r.amount),description:r.description,reference:r.reference||undefined,reconciled:r.reconciled}))
}
export async function addBankTransaction(input:{accountId:string;date:string;direction:'credit'|'debit';amount:number;description:string;reference?:string}) {
  const {error}=await supabase.from('bank_transactions').insert({bank_account_id:input.accountId,transaction_date:input.date,direction:input.direction,amount:input.amount,description:input.description.trim(),reference:input.reference?.trim()||null})
  if(error)throw new Error(`تعذر إضافة الحركة: ${error.message}`)
}
export async function reconcileBank(input:{accountId:string;periodEnd:string;statementBalance:number;notes?:string}) {
  const {error}=await supabase.rpc('reconcile_bank_account',{p_bank_account_id:input.accountId,p_period_end:input.periodEnd,p_statement_balance:input.statementBalance,p_notes:input.notes||''})
  if(error)throw new Error(`تعذر تنفيذ التسوية: ${error.message}`)
}
export async function listReconciliations():Promise<Reconciliation[]> {
  const {data,error}=await supabase.from('bank_reconciliations').select('*').order('period_end',{ascending:false});if(error)throw new Error(error.message)
  return(data||[]).map((r:any)=>({id:r.id,accountId:r.bank_account_id,periodEnd:r.period_end,statementBalance:Number(r.statement_balance),bookBalance:Number(r.book_balance),difference:Number(r.difference),status:r.status}))
}

export interface BusinessSettings { legalName:string;commercialRegistration:string;vatNumber:string;address:string;phone:string;email:string;iban:string;bankName:string;invoicePrefix:string;fiscalYearStart:number;vatRate:number }
export async function getBusinessSettings():Promise<BusinessSettings>{const{data,error}=await supabase.from('business_settings').select('*').eq('id',true).single();if(error)throw new Error(error.message);return{legalName:data.legal_name,commercialRegistration:data.commercial_registration||'',vatNumber:data.vat_number||'',address:data.address||'',phone:data.phone||'',email:data.email||'',iban:data.iban||'',bankName:data.bank_name||'',invoicePrefix:data.invoice_prefix,fiscalYearStart:data.fiscal_year_start,vatRate:Number(data.vat_rate)}}
export async function saveBusinessSettings(s:BusinessSettings){const{error}=await supabase.from('business_settings').update({legal_name:s.legalName,commercial_registration:s.commercialRegistration||null,vat_number:s.vatNumber||null,address:s.address||null,phone:s.phone||null,email:s.email||null,iban:s.iban||null,bank_name:s.bankName||null,invoice_prefix:s.invoicePrefix,fiscal_year_start:s.fiscalYearStart,vat_rate:s.vatRate,updated_at:new Date().toISOString()}).eq('id',true);if(error)throw new Error(error.message)}

export async function exportOperationalBackup(){
  const tables=['business_settings','clients','matters','appointments','documents','finance_categories','finance_records','finance_debts','invoices','invoice_items','invoice_payments','bank_accounts','bank_transactions','bank_reconciliations']
  const payload:Record<string,unknown>={exported_at:new Date().toISOString(),format:'bin-nouh-operational-backup-v1'}
  for(const table of tables){const{data,error}=await supabase.from(table).select('*');if(error)throw new Error(`تعذر تصدير ${table}: ${error.message}`);payload[table]=data||[]}
  return JSON.stringify(payload,null,2)
}
