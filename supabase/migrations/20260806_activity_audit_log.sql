-- سجل النشاط (Audit Log) — تسجيل كل عملية باسم منفّذها.
--
-- التنفيذ على مستوى قاعدة البيانات لا التطبيق، لأن:
--   1) لا يمكن نسيان استدعائه عند إضافة شاشة جديدة؛ التسجيل يقع تلقائيًا.
--   2) يلتقط أي تعديل حتى لو تمّ من لوحة Supabase مباشرة أو من سكربت خارجي.
--   3) السجل غير قابل للتعديل أو الحذف من التطبيق — وهذا شرط أساسي لأي أثر تدقيقي
--      في مكتب محاماة يخضع لالتزام السرية والمساءلة المهنية.

create table if not exists public.activity_log (
  id             uuid primary key default gen_random_uuid(),
  actor_id       uuid references auth.users(id) on delete set null,
  actor_name     text not null default 'غير معروف',
  actor_email    text,
  action         text not null check (action in ('insert', 'update', 'delete')),
  entity_type    text not null,
  entity_id      text,
  entity_label   text,
  changed_fields text[],
  old_data       jsonb,
  new_data       jsonb,
  created_at     timestamptz not null default now()
);

comment on table public.activity_log is 'أثر تدقيقي غير قابل للتعديل: من فعل ماذا ومتى.';

create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);
create index if not exists activity_log_actor_idx      on public.activity_log (actor_id, created_at desc);
create index if not exists activity_log_entity_idx     on public.activity_log (entity_type, entity_id);

-- الحقول التقنية التي لا معنى لعرضها كتغيير حقيقي
create or replace function public.audit_ignored_fields() returns text[]
language sql immutable as $$
  select array['updated_at', 'created_at', 'last_activity_at']::text[];
$$;

create or replace function public.log_activity() returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor   uuid := auth.uid();
  v_name    text;
  v_email   text;
  v_label   text;
  v_changed text[];
  v_old     jsonb;
  v_new     jsonb;
  v_row     jsonb;
begin
  if TG_OP = 'DELETE' then
    v_old := to_jsonb(OLD);
    v_new := null;
  elsif TG_OP = 'INSERT' then
    v_old := null;
    v_new := to_jsonb(NEW);
  else
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);

    select array_agg(e.key)
      into v_changed
      from jsonb_each(v_new) e
     where e.value is distinct from (v_old -> e.key)
       and not (e.key = any (public.audit_ignored_fields()));

    -- تعديل لم يغيّر شيئًا فعليًا لا يستحق سطرًا في السجل
    if v_changed is null then
      return NEW;
    end if;
  end if;

  v_row := coalesce(v_new, v_old);

  -- عنوان بشري للسجل بدل عرض معرّف لا يفهمه أحد
  v_label := coalesce(
    v_row ->> 'full_name_ar',
    v_row ->> 'full_name',
    v_row ->> 'name',
    v_row ->> 'title',
    v_row ->> 'reference_number',
    v_row ->> 'invoice_number',
    v_row ->> 'label'
  );

  if v_actor is not null then
    select p.full_name_ar, p.email
      into v_name, v_email
      from public.profiles p
     where p.id = v_actor;
  end if;

  insert into public.activity_log (
    actor_id, actor_name, actor_email, action,
    entity_type, entity_id, entity_label, changed_fields, old_data, new_data
  )
  values (
    v_actor,
    coalesce(v_name, case when v_actor is null then 'زائر الموقع (نموذج عام)' else 'مستخدم بلا ملف تعريف' end),
    v_email,
    lower(TG_OP),
    TG_TABLE_NAME,
    v_row ->> 'id',
    v_label,
    v_changed,
    v_old,
    v_new
  );

  return coalesce(NEW, OLD);
end;
$$;

revoke all on function public.log_activity() from public, anon, authenticated;

-- تركيب المتتبّع على كل جداول العمل
do $$
declare
  t text;
  audited text[] := array[
    'leads', 'clients', 'matters', 'tasks', 'documents', 'appointments',
    'contact_requests', 'messages', 'profiles', 'invoices', 'invoice_items',
    'invoice_payments', 'finance_records', 'finance_debts', 'bank_accounts',
    'bank_transactions', 'bank_reconciliations', 'business_settings',
    'automation_settings', 'marketing_campaigns'
  ];
begin
  foreach t in array audited loop
    if exists (select 1 from information_schema.tables
                where table_schema = 'public' and table_name = t) then
      execute format('drop trigger if exists trg_audit_%1$s on public.%1$I', t);
      execute format(
        'create trigger trg_audit_%1$s after insert or update or delete on public.%1$I
           for each row execute function public.log_activity()', t);
    end if;
  end loop;
end;
$$;

-- الحماية: قراءة لفريق المكتب فقط، ولا تعديل ولا حذف لأحد إطلاقًا.
alter table public.activity_log enable row level security;

drop policy if exists "Staff read activity log" on public.activity_log;
create policy "Staff read activity log" on public.activity_log
  for select to authenticated
  using ((select private.is_staff()));

revoke all on public.activity_log from anon, authenticated;
grant select on public.activity_log to authenticated;
