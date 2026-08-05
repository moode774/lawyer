# تقرير الفحص الفني — منصة بن نوح للمحاماة
**التاريخ:** 2026-07-31 — فحص شامل قبل أي تعديل. لم يُجرَ أي تغيير على الكود.

---

## 1) ما يعمل فعليًا (مربوط بـ Supabase حقيقيًا)

| المكوّن | الحالة |
|---|---|
| نموذج الطلب القانوني `/legal-intake` | يكتب في جدول `leads` عبر `createLead()` — فشل Supabase يرمي خطأ (لا fallback صامت عند الإنشاء) ✅ |
| حجز موعد `/book` | يكتب في `appointments` عبر `createAppointment()` ✅ |
| نموذج التواصل | يكتب في `contact_requests` ✅ |
| قراءة Leads في الإدارة | `listLeads()` تقرأ من Supabase أولًا |
| تحديث حالة الـ Lead في Pipeline | `updateLeadStage()` تكتب في Supabase ✅ |
| دخول الإدارة `/admin-login` | بريد/كلمة مرور عبر `signInWithPassword` ✅ |
| دخول العميل `/login` | Phone OTP سعودي مع `normalizeSaudiPhone()` صحيح التنسيق (05 / 5 / +9665 → +9665) ✅ ولا يوجد fallback وهمي ✅ |
| توليد الصور التسويقية | Edge Function `generate-marketing-image` — المفتاح في Supabase Secrets، لا يصل للمتصفح في الإنتاج ✅ |
| RLS | مفعّل على 11 جدولًا في `policies.sql` مع دالة `private.is_staff()` (SECURITY DEFINER) ✅ |
| TypeScript | `tsc -b` يمر بدون أخطاء ✅ |
| README | الترميز UTF-8 سليم في النسخة الحالية (لا يحتاج إصلاح) ✅ |

## 2) ما هو تجريبي (LocalStorage / بيانات وهمية)

- **العملاء، القضايا، المستندات، المهام، الرسائل، الإشعارات، البحث العام، إحصاءات Dashboard**: كلها من `store` المتزامن المبني على LocalStorage + `data/demo.ts`. لا قراءة من Supabase إطلاقًا لهذه الكيانات.
- **بوابة العميل بالكامل**: كل الصفحات (`PortalHomePage`, `PortalMattersPage`, `PortalDocumentsPage`, `PortalAppointmentsPage`, `PortalProfilePage`) تستخدم المعرف الثابت `'c_1'` من بيانات demo — أي عميل يسجل دخوله يرى نفس البيانات الوهمية.
- **`createClientFromLead()`**: تنشئ العميل محليًا، ثم ترسل insert إلى Supabase بأسلوب fire-and-forget يتجاهل الفشل (`console.warn` فقط) — العميل قد "يُنشأ" في الواجهة دون أن يوجد في قاعدة البيانات.
- **مركز التسويق**: كامل الطبقة (`marketing/store.ts` 810 سطرًا) LocalStorage + `marketing-demo.ts` (655 سطرًا، معلّمة `demo: true`). **لا يوجد أي تكامل حقيقي مع Meta أو Google أو WhatsApp أو n8n** — الاتصالات والحملات والموافقات كلها عرض توضيحي.
- **إعدادات الأتمتة**: `getAutomationSettings()` ترجع قيمًا ثابتة (n8n webhook وهمي)، و`updateAutomationSettings()` **دالة فارغة لا تحفظ شيئًا**.
- **`getLead()` و`updateLeadNotes()`**: تقرآن/تكتبان محليًا فقط — صفحة تفاصيل الـ Lead قد لا تجد سجل Supabase الحقيقي، وملاحظاتها لا تُحفظ في القاعدة.

## 3) الثغرات والمخاطر (بالأولوية)

### حرجة
1. **`auth.tsx` سطر 58 — الدور الافتراضي admin**: `role: profile?.role === 'client' ? 'client' : 'admin'`. أي مستخدم موثّق بلا صف profile (وهو ما سيحدث لكل حساب OTP جديد إن لم يوجد trigger) يُعامل واجهيًا كـ admin ويدخل `/admin`. RLS يحميه من البيانات، لكن هذا عكس المطلوب تمامًا: **الافتراض يجب أن يكون client**.
2. **لا يوجد trigger لإنشاء profile في المستودع**: `schema.sql` لا يحتوي `handle_new_user`، وجدول `profiles` معرفه `uuid_generate_v4()` **غير مرتبط بـ `auth.users(id)`** ولا يوجد FK. ذُكر أن الـ trigger موجود في المشروع الحي — تعذّر التحقق (انظر بند 5).
3. **سياسات العميل مبنية على البريد الإلكتروني**: `Clients view own record/matters/documents` تطابق `clients.email = auth.jwt()->>'email'`. **حسابات Phone OTP لا تملك بريدًا** → العميل الحقيقي لن يرى أي شيء حتى لو رُبطت البوابة بـ Supabase. المطلوب عمود `user_id UUID REFERENCES auth.users(id)` في `clients` وسياسات على أساسه (أو المطابقة بالجوال الموحّد كحل انتقالي).
4. **أسرار في `.env` بصيغة `VITE_`**: يحتوي `VITE_OPENAI_API_KEY` و`VITE_OPENROUTER_API_KEY` — أي قيمة فيهما تُضمّن في حزمة المتصفح. الكود الحالي لا يستوردهما (جيد)، لكن وجودهما خطر ويجب حذفهما وتدوير المفاتيح إن كانت حقيقية. `.env` يظهر في `.gitignore`؟ يلزم التأكد + عدم مشاركته.
5. **Edge Function بلا فحص صلاحيات**: `generate-marketing-image` لا تتحقق من أن المستدعي staff — أي مستخدم موثّق (وأي زائر إن كان verify_jwt معطلًا) يستطيع استهلاك رصيد OpenAI. يلزم التحقق من JWT + دور staff داخل الدالة.

### متوسطة
6. **تضارب `messages.direction`**: الـ schema يقبل `inbound/outbound` بينما الكود المحلي يستخدم `incoming/outgoing` — أي ربط مستقبلي سيفشل على الـ CHECK.
7. **ازدواجية طبقة البيانات**: دوال async (Supabase) + facade متزامن (LocalStorage) في نفس الملف، والصفحات تخلط بينهما — مصدر الحقيقة غير واضح، وقراءات `listLeads/listAppointments` تسقط **بصمت** إلى البيانات المحلية عند فشل Supabase (مخالف لقاعدة عدم الرجوع الصامت في العمليات الحساسة).
8. **صفحة `LawyerPage`/`InsightsPage`** موجودة كملفات لكنها محوّلة `Navigate` إلى `/about` — كود ميت.
9. **رفع المستندات**: لا يوجد أي تكامل مع Supabase Storage — جدول `documents` موجود لكن لا رفع فعلي للملفات.
10. **جلسة المستخدم في `sessionStorage`** تُقرأ قبل التحقق من Supabase — نافذة قصيرة قد تعرض واجهة بدور قديم (الحماية الفعلية RLS، لكن يفضّل الاعتماد على `onAuthStateChange` فقط).

### تعذّر التحقق منه (يحتاج وصولًا/إعدادًا خارجيًا)
- **المشروع الحي**: الكود يشير إلى `rrmcpwlibolyxrpbikpu.supabase.co`، بينما موصل Supabase المتاح في هذه الجلسة مرتبط بحساب يضم مشاريع أخرى فقط (Yemen Marketplace, LifeOS). لذلك لم أستطع التحقق من: وجود trigger الـ profile فعليًا، حالة نشر الدالة، إعداد مزود SMS (Twilio/MessageBird…)، والـ migrations الحية. **مطلوب:** ربط موصل Supabase بالحساب الصحيح أو تزويدي بوصول للمشروع الفعلي.
- **مزود SMS**: بدون تفعيله في Supabase Auth → Phone، دخول العميل لن يعمل إنتاجيًا.
- **مفتاح `OPENAI_API_KEY` في Supabase Secrets**: يلزم التأكد من ضبطه ونشر الدالة.

## 4) بيانات غير مربوطة (خريطة الربط المطلوبة)

| الكيان | القراءة | الكتابة | المطلوب |
|---|---|---|---|
| leads | Supabase (مع fallback صامت) | Supabase ✅ | إزالة الـ fallback الصامت، ربط `getLead/updateLeadNotes` |
| appointments | Supabase (مع fallback) | Supabase ✅ | ربط تأكيد/إلغاء الموعد بالتحديث في القاعدة |
| clients | LocalStorage | fire-and-forget | ربط كامل + عمود `user_id` |
| matters | LocalStorage | لا شيء | ربط كامل CRUD |
| documents | LocalStorage | لا شيء | Supabase Storage + احترام `visibility` |
| tasks | LocalStorage | لا شيء | ربط كامل |
| messages | LocalStorage | لا شيء | ربط + توحيد `direction` |
| automation_settings | قيم ثابتة | لا شيء | ربط فعلي |
| بوابة العميل | demo `c_1` | — | ربط بهوية المستخدم الموثّق عبر `user_id` |
| مركز التسويق | demo كامل | LocalStorage | يبقى معلّمًا "تجريبي" حتى تتوفر تكاملات حقيقية |

## 5) أولويات الإكمال المقترحة

1. **أمن الهوية أولًا**: إصلاح افتراض الدور في `auth.tsx` (الافتراض client، والدخول الإداري يتطلب دور staff صريحًا من `profiles`)، + migration تربط `profiles.id` بـ `auth.users(id)` + trigger `handle_new_user` يفرض `role='client'` ويتجاهل أي role من `user_metadata`.
2. **ربط العميل بهويته**: عمود `clients.user_id` + سياسات RLS على أساسه (بدل البريد) + آلية ربط إدارية (مطابقة الجوال الموحّد عند التحويل من Lead).
3. **بوابة العميل الحقيقية**: استبدال `c_1` باستعلامات Supabase مقيدة بـ RLS (قضاياه، مستنداته `visibility='client'` فقط، مواعيده، رسائله).
4. **توحيد طبقة البيانات**: إكمال ربط clients/matters/tasks/documents/messages بـ Supabase، وإزالة الـ fallback الصامت من القراءات الحساسة، وفصل بيانات الـ demo خلف علم صريح.
5. **تحصين Edge Function** (فحص دور staff) + حذف مفاتيح `VITE_*` السرية وتدويرها.
6. **الإعداد الخارجي**: مزود SMS، `OPENAI_API_KEY` في Secrets، نشر الدالة، وحساب إداري مثبت الدور في `profiles`.
7. لاحقًا: رفع الملفات إلى Storage، الرسائل داخل البوابة، ثم وحدة الحسابات/الفواتير/التقارير الضريبية (غير موجودة إطلاقًا حاليًا — تحتاج تصميم schema جديد بmigrations).

## 6) ملاحظات الهوية والتصميم
الهوية الحالية ملتزمة بالمطلوب: كحلي `#102541/#1C2B48`، خط Tajawal للنصوص وAmiri للعناوين، RTL سليم، لمسات ذهبية محدودة (`#8a6b36`). لا حاجة لأي تغيير تصميمي.
