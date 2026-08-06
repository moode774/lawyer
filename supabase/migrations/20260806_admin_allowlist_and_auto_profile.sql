-- قائمة البريد المخوّل بصلاحية الإدارة + إنشاء ملف التعريف تلقائيًا عند إنشاء الحساب.
--
-- سبب وجوده: كان إنشاء حساب في Supabase لا يُنشئ صفًا في profiles، فيدخل المستخدم
-- ببيانات صحيحة ثم يُرفض من لوحة الإدارة بلا سبب ظاهر. الآن يُنشأ الملف تلقائيًا،
-- وتُمنح الصلاحية الإدارية فقط للبريد المدرج في القائمة أدناه.

create table if not exists public.admin_allowlist (
  email        text primary key,
  full_name_ar text not null,
  role         text not null default 'super_admin'
                 check (role in ('super_admin', 'lawyer', 'staff', 'marketing')),
  added_at     timestamptz not null default now()
);

comment on table public.admin_allowlist is
  'البريد المخوّل بصلاحية إدارية. أي حساب خارجها يُعامل كعميل تلقائيًا.';

insert into public.admin_allowlist (email, full_name_ar, role) values
  ('mnzar7162@gmail.com',  'محمد عبد السلام',      'super_admin'),
  ('lawyernouh@gmail.com', 'المحامي أحمد بن نوح', 'super_admin')
on conflict (email) do update
  set full_name_ar = excluded.full_name_ar,
      role         = excluded.role;

create or replace function public.handle_new_auth_user() returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  v_allow public.admin_allowlist%rowtype;
begin
  select * into v_allow
    from public.admin_allowlist
   where lower(email) = lower(new.email);

  insert into public.profiles (id, email, full_name_ar, role)
  values (
    new.id,
    new.email,
    coalesce(v_allow.full_name_ar, new.raw_user_meta_data ->> 'full_name', 'عميل بن نوح'),
    coalesce(v_allow.role, 'client')
  )
  on conflict (id) do update
    set email        = excluded.email,
        full_name_ar = excluded.full_name_ar,
        role         = excluded.role;

  return new;
end;
$fn$;

drop trigger if exists trg_handle_new_auth_user on auth.users;
create trigger trg_handle_new_auth_user
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- مزامنة الحسابات القائمة مع القائمة
update public.profiles p
   set role         = a.role,
       full_name_ar = a.full_name_ar
  from public.admin_allowlist a
 where lower(p.email) = lower(a.email)
   and (p.role is distinct from a.role or p.full_name_ar is distinct from a.full_name_ar);

alter table public.admin_allowlist enable row level security;

drop policy if exists "Staff read allowlist" on public.admin_allowlist;
create policy "Staff read allowlist" on public.admin_allowlist
  for select to authenticated using ((select private.is_staff()));

revoke all on public.admin_allowlist from anon, authenticated;
grant select on public.admin_allowlist to authenticated;
