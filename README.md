# Digital Law Firm Platform — Saudi Arabia ⚖️🇸🇦
### المنصة الرقمية والنظام التشغيلي المتكامل لمكاتب المحاماة في المملكة العربية السعودية

---

## 🌟 Overview / نبذة عن المشروع
منصة رقمية إنتاجية متكاملة مصممة خصيصًا لمكاتب المحاماة والمستشارين القانونيين في المملكة العربية السعودية. تجمع المنصة بين:
- **الموقع والتسويق القانوني الاحترافي** (Bilingual RTL Arabic / English)
- **نظام التقييم والطلب القانوني الذكي** (Smart Legal Intake)
- **جدولة الاستشارات وحجز المواعيد** (Native Consultation Booking)
- **إدارة علاقات العملاء وخط الأنابيب (CRM Kanban)**
- **إدارة القضايا والملفات والمرافعات** (Legal Matters Management)
- **بوابة عميل خاصة وآمنة** (Client Portal)
- **أتمتة الواتساب والبريد ومحرك n8n** (WhatsApp & Email Automation)
- **المساعد القانوني الداخلي بالذكاء الاصطناعي** (AI Legal Assistant)
- **تحليلات التسويق وإسناد الحملات** (UTM Marketing Attribution)

---

## 🛠️ Stack & Architecture / التقنيات المستعملة
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Saudi LegalTech Design System Tokens
- **Routing**: React Router v6
- **Database & Auth**: Supabase PostgreSQL + Row Level Security (RLS)
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 🚀 Quick Start / التشغيل السريع

### 1. التثبيت والتشغيل المحلي
```bash
# تثبيت الاعتمادات
npm install

# تشغيل خادم التطوير المحلي
npm run dev
```

افتح المتصفح على: `http://localhost:5173`

---

## 🔑 Demo Access / بيانات الدخول التجريبية

### 1. مركز عمليات المحاماة (Admin / Lawyer Dashboard)
- **رابط الدخول**: `/login` أو من زر "دخول النظام" بالهيدر
- **البريد الإلكتروني**: `lawyer@firm.com`
- **كلمة المرور**: `password123`

### 2. بوابة العميل (Client Portal)
- **الرابط**: `/portal`
- **البريد الإلكتروني**: `client@company.com`

---

## 📂 Project Structure / هيكل المشروع

```
src/
├── config/              # BRAND configurations & placeholders
├── data/                # Realistic Saudi Demo dataset
├── lib/                 # Store, Auth, i18n, Analytics, Attribution
├── components/
│   ├── ui/              # Design System Atomic UI components
│   └── shared/          # Brand Logo, Header, Footer
├── features/            # Feature domain logic & components
├── layouts/             # PublicLayout, AdminLayout, PortalLayout
├── pages/
│   ├── public/          # Public marketing & service pages
│   ├── admin/           # Dashboard, CRM, Matters, AI, Settings
│   └── portal/          # Client portal pages
└── supabase/            # Schema, RLS policies, seed SQL
```

---

## 🔒 Security & Privacy / الأمان والحوكمة
- **Row Level Security (RLS)**: تم تصميم سياسات RLS لعزل بيانات العملاء ومستندات المرافعات.
- **UTM Attribution**: تتبع كامل لمصادر الحملات الإعلانية Google Ads, X, WhatsApp دون المساس بسرية العميل.

---
© 2026 جميع الحقوق محفوظة — منصة المحاماة الرقمية | المملكة العربية السعودية.
