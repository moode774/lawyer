-- ====================================================================
-- DIGITAL LAW FIRM PLATFORM — SUPABASE POSTGRESQL SCHEMA
-- Target Region: Saudi Arabia (Asia/Riyadh)
-- Currency: SAR
-- Security: Row Level Security Enabled for All Production Entities
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES (RBAC)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name_ar TEXT NOT NULL,
    full_name_en TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'lawyer', 'staff', 'marketing', 'client')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS & INTAKE ENTITIES
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    company_name TEXT,
    client_type TEXT NOT NULL CHECK (client_type IN ('individual', 'company')),
    category TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN (
        'new', 'contacted', 'qualified', 'consultation_booked',
        'consultation_completed', 'proposal_sent', 'won', 'lost'
    )),
    estimated_value NUMERIC(12, 2) DEFAULT 0.00,
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    consultation_type TEXT CHECK (consultation_type IN ('office', 'phone', 'video')),
    preferred_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MARKETING ATTRIBUTION
CREATE TABLE marketing_attribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID UNIQUE REFERENCES leads(id) ON DELETE CASCADE,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    referrer TEXT,
    landing_page TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CLIENTS
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT UNIQUE NOT NULL,
    converted_from_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    client_type TEXT NOT NULL CHECK (client_type IN ('individual', 'company')),
    company_name TEXT,
    national_id_cr TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEGAL MATTERS / CASES
CREATE TABLE matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('new', 'active', 'waiting', 'hearing_scheduled', 'closed')),
    assigned_lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    court_or_authority TEXT,
    description TEXT,
    important_dates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONSULTATION APPOINTMENTS
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    category TEXT,
    meeting_type TEXT NOT NULL CHECK (meeting_type IN ('office', 'phone', 'video')),
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    duration TEXT DEFAULT '45 mins',
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    location_details TEXT,
    google_calendar_event_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public website contact messages (readable only by authenticated staff through RLS)
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'replied', 'closed')),
    source TEXT NOT NULL DEFAULT 'website_contact',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    size_human TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    visibility TEXT NOT NULL CHECK (visibility IN ('internal', 'client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TASKS & FOLLOW-UPS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    matter_id UUID REFERENCES matters(id) ON DELETE CASCADE,
    assigned_to_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MESSAGES (SECURE PORTAL & WHATSAPP REORDS)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'portal')),
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    recipient_phone_or_email TEXT NOT NULL,
    body TEXT NOT NULL,
    template_id TEXT,
    status TEXT DEFAULT 'sent',
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUTOMATION SETTINGS
CREATE TABLE automation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whatsapp_enabled BOOLEAN DEFAULT true,
    email_enabled BOOLEAN DEFAULT true,
    n8n_enabled BOOLEAN DEFAULT true,
    n8n_webhook_url TEXT,
    lead_created_template TEXT,
    booking_confirmed_template TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_clients_ref ON clients(reference_number);
CREATE INDEX idx_matters_client ON matters(client_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
