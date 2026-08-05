-- Production RLS policies. The live project also records these as managed migrations.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_staff() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role IN ('super_admin', 'lawyer', 'staff', 'marketing')
  );
$$;
REVOKE ALL ON FUNCTION private.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_staff() TO authenticated;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit legal requests" ON leads FOR INSERT TO anon
WITH CHECK (status = 'new' AND assigned_staff_id IS NULL AND estimated_value = 0);
CREATE POLICY "Public can submit appointments" ON appointments FOR INSERT TO anon
WITH CHECK (status = 'pending' AND client_id IS NULL AND google_calendar_event_id IS NULL AND appointment_date >= CURRENT_DATE);
CREATE POLICY "Public can submit contact requests" ON contact_requests FOR INSERT TO anon
WITH CHECK (status = 'new' AND source = 'website_contact');

CREATE POLICY "Staff manage profiles" ON profiles FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Users view own profile" ON profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
CREATE POLICY "Staff manage leads" ON leads FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage clients" ON clients FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage matters" ON matters FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage appointments" ON appointments FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage contact requests" ON contact_requests FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage documents" ON documents FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage tasks" ON tasks FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage messages" ON messages FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage attribution" ON marketing_attribution FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));
CREATE POLICY "Staff manage automation settings" ON automation_settings FOR ALL TO authenticated USING ((SELECT private.is_staff())) WITH CHECK ((SELECT private.is_staff()));

CREATE POLICY "Clients view own record" ON clients FOR SELECT TO authenticated USING (email = (SELECT auth.jwt()->>'email'));
CREATE POLICY "Clients view own matters" ON matters FOR SELECT TO authenticated USING (client_id IN (SELECT id FROM clients WHERE email = (SELECT auth.jwt()->>'email')));
CREATE POLICY "Clients view visible documents" ON documents FOR SELECT TO authenticated USING (visibility = 'client' AND client_id IN (SELECT id FROM clients WHERE email = (SELECT auth.jwt()->>'email')));

-- بوابة العميل: قراءة فقط، ومقصورة على سجلات العميل نفسه (لا إدراج ولا تعديل ولا حذف).
CREATE POLICY "Clients view own appointments" ON appointments FOR SELECT TO authenticated
USING (client_id IN (SELECT id FROM clients WHERE email = (SELECT auth.jwt()->>'email')));

CREATE POLICY "Clients view own portal messages" ON messages FOR SELECT TO authenticated
USING (
  channel = 'portal'
  AND client_id IN (SELECT id FROM clients WHERE email = (SELECT auth.jwt()->>'email'))
);

GRANT INSERT ON leads, appointments, contact_requests TO anon;
REVOKE SELECT, UPDATE, DELETE ON leads, appointments, contact_requests FROM anon;

-- إغلاق أي صلاحية عامة متبقية على الجداول الحساسة (السرية المهنية).
REVOKE ALL ON clients, matters, documents, tasks, messages, profiles, marketing_attribution, automation_settings FROM anon;

-- تخزين المستندات: دلو خاص لا يُقرأ إلا عبر روابط موقّعة قصيرة الأجل من الخادم.
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-documents', 'case-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Staff manage case documents" ON storage.objects;
CREATE POLICY "Staff manage case documents" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'case-documents' AND (SELECT private.is_staff()))
WITH CHECK (bucket_id = 'case-documents' AND (SELECT private.is_staff()));
