-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Security Principle: Strict Separation of Lawyer/Staff vs Client Access
-- ====================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Super Admins & Lawyer full access to profiles"
    ON profiles FOR ALL
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'lawyer', 'staff'));

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- 2. LEADS POLICIES (Internal Team Only)
CREATE POLICY "Legal team full access to leads"
    ON leads FOR ALL
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'lawyer', 'staff', 'marketing'));

-- 3. CLIENTS & MATTERS POLICIES
CREATE POLICY "Legal team full access to clients"
    ON clients FOR ALL
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'lawyer', 'staff'));

CREATE POLICY "Legal team full access to matters"
    ON matters FOR ALL
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'lawyer', 'staff'));

CREATE POLICY "Clients can view own legal matters in portal"
    ON matters FOR SELECT
    USING (client_id IN (
        SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    ));

-- 4. DOCUMENTS POLICIES
CREATE POLICY "Legal team full access to all documents"
    ON documents FOR ALL
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'lawyer', 'staff'));

CREATE POLICY "Clients can view only client-visible documents linked to their account"
    ON documents FOR SELECT
    USING (
        visibility = 'client' AND
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );
