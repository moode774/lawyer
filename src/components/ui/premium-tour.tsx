import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check, HelpCircle, Settings2, Clock } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

// --- Types ---
export interface TourStep {
  id: string
  targetId: string // The DOM element ID to highlight
  route?: string // The route this step belongs to (e.g., '/admin/pipeline')
  title: string
  whatIsIt: string
  whatDoesItDo: string
  whenToUse: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface TourContextType {
  isActive: boolean
  startTour: () => void
  endTour: () => void
  hasCompleted: boolean
}

// --- Exhaustive Steps Definition ---
export const TOUR_STEPS: TourStep[] = [
  // --- AdminLayout (Sidebar Navigation) ---
  { id: 'step-sidebar', targetId: 'tour-step-sidebar', route: '/admin', title: 'القائمة الجانبية (Sidebar)', whatIsIt: 'العمود الفقري للنظام وأداة التنقل الرئيسية.', whatDoesItDo: 'تحتوي على أزرار للوصول إلى كل قسم من أقسام المكتب بسرعة.', whenToUse: 'استخدمها دائماً للتنقل بين الصفحات المختلفة.' },
  { id: 'nav-admin', targetId: 'tour-nav-admin', route: '/admin', title: 'مركز العمليات', whatIsIt: 'الشاشة الرئيسية للنظام.', whatDoesItDo: 'تعطيك نظرة شاملة على أداء المكتب والإحصائيات.', whenToUse: 'عند دخول النظام أو لتفقد سير العمل العام.', placement: 'left' },
  { id: 'nav-pipeline', targetId: 'tour-nav-pipeline', route: '/admin', title: 'خط الصفقات CRM', whatIsIt: 'نظام إدارة العملاء المحتملين.', whatDoesItDo: 'يتتبع مراحل تحويل الاستفسارات إلى عملاء متعاقدين.', whenToUse: 'لمتابعة الطلبات الجديدة والمفاوضات القائمة.', placement: 'left' },
  { id: 'nav-leads', targetId: 'tour-nav-leads', route: '/admin', title: 'العملاء المحتملون', whatIsIt: 'سجل الطلبات التفصيلي.', whatDoesItDo: 'يعرض الاستفسارات كجدول تفصيلي بدلاً من بطاقات كانبان.', whenToUse: 'عند الرغبة في فرز أو تصدير بيانات الطلبات الجديدة.', placement: 'left' },
  { id: 'nav-bookings', targetId: 'tour-nav-bookings', route: '/admin', title: 'إدارة المواعيد', whatIsIt: 'أجندة المكتب الذكية.', whatDoesItDo: 'تنظم جدول الاستشارات والاجتماعات مع العملاء.', whenToUse: 'لتفقد ارتباطات اليوم أو حجز موعد جديد.', placement: 'left' },
  { id: 'nav-clients', targetId: 'tour-nav-clients', route: '/admin', title: 'سجل العملاء', whatIsIt: 'قاعدة بيانات عملائك المتعاقدين.', whatDoesItDo: 'تحتوي على ملفات العملاء كاملة (أفراد وشركات).', whenToUse: 'للوصول لبيانات عميل، أو إضافة عميل جديد.', placement: 'left' },
  { id: 'nav-matters', targetId: 'tour-nav-matters', route: '/admin', title: 'القضايا والمعاملات', whatIsIt: 'القلب النابض للعمل القانوني.', whatDoesItDo: 'تُدار من خلالها ملفات الترافع، العقود، والاستشارات.', whenToUse: 'لمتابعة تطور قضية، رفع جلسة، أو تحديث ملف.', placement: 'left' },
  { id: 'nav-tasks', targetId: 'tour-nav-tasks', route: '/admin', title: 'المهام والمتابعات', whatIsIt: 'لوحة مهام الفريق.', whatDoesItDo: 'تنظيم مهام المحامين وتحديد المواعيد النهائية.', whenToUse: 'لتوزيع المهام على الفريق أو متابعة إنجازك الشخصي.', placement: 'left' },
  { id: 'nav-documents', targetId: 'tour-nav-documents', route: '/admin', title: 'مكتبة المستندات', whatIsIt: 'الخزينة السحابية الآمنة.', whatDoesItDo: 'حفظ اللوائح، العقود، والوثائق بشكل آمن ومشفر.', whenToUse: 'لرفع ملف جديد أو استرجاع ملف قديم.', placement: 'left' },
  { id: 'nav-finance', targetId: 'tour-nav-finance', route: '/admin', title: 'الإدارة المالية', whatIsIt: 'صندوق مالية المكتب.', whatDoesItDo: 'تسجيل الإيرادات، المصروفات، والفواتير.', whenToUse: 'عند استلام دفعة من عميل أو صرف مبلغ.', placement: 'left' },
  { id: 'nav-ai', targetId: 'tour-nav-ai', route: '/admin', title: 'المساعد الذكي AI', whatIsIt: 'محاميك الرقمي المساعد.', whatDoesItDo: 'يحلل العقود، يستخرج المهل، ويبني تسلسلات زمنية.', whenToUse: 'عندما تحتاج مساعدة في تلخيص مستند طويل.', placement: 'left' },
  { id: 'nav-settings', targetId: 'tour-nav-settings', route: '/admin', title: 'إعدادات النظام', whatIsIt: 'لوحة تحكم المسؤول.', whatDoesItDo: 'إدارة الصلاحيات، الفروع، وإعدادات المكتب.', whenToUse: 'لتغيير شعار المكتب أو إضافة مستخدم جديد.', placement: 'left' },
  { id: 'nav-support', targetId: 'tour-nav-support', route: '/admin', title: 'المساعدة الفورية', whatIsIt: 'زر الدعم الفني.', whatDoesItDo: 'يفتح لك قنوات التواصل مع فريق دعم النظام.', whenToUse: 'إذا واجهتك مشكلة تقنية أو كان لديك استفسار.', placement: 'left' },
  { id: 'nav-profile', targetId: 'tour-nav-profile', route: '/admin', title: 'الملف الشخصي', whatIsIt: 'هويتك في النظام.', whatDoesItDo: 'لتسجيل الخروج وتعديل بياناتك الخاصة.', whenToUse: 'عند انتهاء الدوام وترغب بتسجيل الخروج.', placement: 'left' },
  { id: 'step-search', targetId: 'tour-step-search', route: '/admin', title: 'البحث الشامل', whatIsIt: 'محرك بحث متطور وسريع.', whatDoesItDo: 'يبحث في كل شيء (عملاء، قضايا، فواتير) بضغطة زر.', whenToUse: 'استخدمه للوصول الفوري لأي ملف بدلاً من التصفح اليدوي.', placement: 'bottom' },
  { id: 'step-notifications', targetId: 'tour-step-notifications', route: '/admin', title: 'التنبيهات', whatIsIt: 'مركز الإشعارات المباشرة.', whatDoesItDo: 'ينبهك بالطلبات الجديدة والمواعيد القادمة.', whenToUse: 'راجعها يومياً لمعرفة التحديثات الطارئة.', placement: 'bottom' },

  // --- Dashboard ---
  { id: 'dashboard-add', targetId: 'tour-step-add-new', route: '/admin', title: 'زر الإضافة السريعة', whatIsIt: 'اختصار المهام السريعة.', whatDoesItDo: 'يفتح نموذجاً لإنشاء قضية أو كيان جديد فوراً.', whenToUse: 'للإضافة بسرعة دون مغادرة الشاشة الرئيسية.', placement: 'left' },
  { id: 'dashboard-stats-leads', targetId: 'tour-dashboard-stats', route: '/admin', title: 'بطاقة الطلبات', whatIsIt: 'إحصائية حية.', whatDoesItDo: 'تعرض عدد الطلبات الواردة هذا الشهر.', whenToUse: 'لمراقبة أداء الحملات التسويقية والاستقطاب.', placement: 'bottom' },
  { id: 'dashboard-stats-comp', targetId: 'tour-dashboard-completed-stats', route: '/admin', title: 'بطاقة الاستشارات المكتملة', whatIsIt: 'إحصائية الإنجاز.', whatDoesItDo: 'عدد الاستشارات التي تم الانتهاء منها بنجاح.', whenToUse: 'لقياس حجم العمل المنجز.', placement: 'bottom' },
  { id: 'dashboard-stats-active', targetId: 'tour-dashboard-active-stats', route: '/admin', title: 'بطاقة القضايا النشطة', whatIsIt: 'إحصائية العمل الجاري.', whatDoesItDo: 'توضح كم قضية مفتوحة حالياً في المكتب.', whenToUse: 'لمعرفة العبء الحالي على المحامين.', placement: 'bottom' },
  { id: 'dashboard-stats-conv', targetId: 'tour-dashboard-conv-stats', route: '/admin', title: 'معدل التحويل', whatIsIt: 'مؤشر أداء (KPI).', whatDoesItDo: 'يقيس نسبة تحويل الطلبات إلى عملاء فعليين.', whenToUse: 'لتقييم كفاءة إغلاق الصفقات.', placement: 'bottom' },
  { id: 'dashboard-appointments', targetId: 'tour-dashboard-appointments', route: '/admin', title: 'جدول مواعيد اليوم', whatIsIt: 'ملخص يومي للاجتماعات.', whatDoesItDo: 'يعرض الاستشارات والمواعيد المجدولة لهذا اليوم.', whenToUse: 'أول ما تتفقده صباحاً لترتيب جدولك.', placement: 'top' },
  { id: 'dashboard-tasks', targetId: 'tour-dashboard-tasks', route: '/admin', title: 'المهام العاجلة', whatIsIt: 'قائمة أولويات العمل.', whatDoesItDo: 'يبرز المهام التي اقترب موعد تسليمها.', whenToUse: 'لمعرفة ما يجب إنجازه فوراً.', placement: 'top' },
  { id: 'dashboard-leads', targetId: 'tour-dashboard-leads', route: '/admin', title: 'أحدث الاستفسارات', whatIsIt: 'شريط الطلبات المباشر.', whatDoesItDo: 'يعرض آخر العملاء الذين تواصلوا مع المكتب.', whenToUse: 'للرد السريع على العملاء الجدد لضمان عدم خسارتهم.', placement: 'top' },
  { id: 'dashboard-activity', targetId: 'tour-dashboard-activity', route: '/admin', title: 'سجل النشاط المباشر', whatIsIt: 'رقابة على تحركات النظام.', whatDoesItDo: 'يسجل أي عملية إضافة أو تعديل قام بها الفريق.', whenToUse: 'لمتابعة نشاط الموظفين وحركة العمل.', placement: 'top' },

  // --- Pipeline ---
  { id: 'pipeline-list-btn', targetId: 'tour-pipeline-list-btn', route: '/admin/pipeline', title: 'زر العرض الجدولي', whatIsIt: 'مغير العرض.', whatDoesItDo: 'يحول عرض البطاقات إلى جدول بيانات تفصيلي.', whenToUse: 'إذا كنت تفضل عرض القوائم التقليدي على البطاقات.', placement: 'bottom' },
  { id: 'pipeline-filter', targetId: 'tour-pipeline-filter', route: '/admin/pipeline', title: 'شريط الفلترة للطلبات', whatIsIt: 'أداة تصفية.', whatDoesItDo: 'تمكنك من البحث بالاسم أو فلترة الطلبات حسب التخصص.', whenToUse: 'عندما تمتلئ اللوحة بالعملاء وتريد التركيز.', placement: 'bottom' },
  { id: 'pipeline-col-new', targetId: 'tour-pipeline-col-new', route: '/admin/pipeline', title: 'عمود الطلبات الجديدة', whatIsIt: 'نقطة الانطلاق (Kanban Column).', whatDoesItDo: 'تظهر هنا جميع الاستفسارات الجديدة التي تحتاج رداً.', whenToUse: 'اسحب بطاقة العميل من هنا إلى العمود التالي.', placement: 'right' },

  // --- Clients ---
  { id: 'clients-search', targetId: 'tour-clients-search', route: '/admin/clients', title: 'البحث السريع للعملاء', whatIsIt: 'شريط بحث مخصص.', whatDoesItDo: 'يبحث في قاعدة بيانات العملاء برقم الجوال أو الهوية.', whenToUse: 'للعثور على عميل محدد بسرعة.', placement: 'bottom' },
  { id: 'clients-table', targetId: 'tour-clients-table', route: '/admin/clients', title: 'جدول العملاء', whatIsIt: 'الأرشيف الشامل.', whatDoesItDo: 'يعرض تفاصيل كل عميل مع زر لفتح ملفه المستقل.', whenToUse: 'لاستعراض بيانات العملاء أو النقر لفتح ملف عميل معين.', placement: 'top' },

  // --- Matters ---
  { id: 'matters-add', targetId: 'tour-matters-add', route: '/admin/matters', title: 'زر إضافة قضية', whatIsIt: 'منشئ القضايا.', whatDoesItDo: 'يفتح نموذج تسجيل قضية جديدة أو عقد أو استشارة.', whenToUse: 'بعد توقيع العقد مع العميل وتجهيز الأوراق.', placement: 'bottom' },
  { id: 'matters-filter', targetId: 'tour-matters-filter', route: '/admin/matters', title: 'فلترة القضايا', whatIsIt: 'أداة تصفية القضايا.', whatDoesItDo: 'فرز القضايا حسب الحالة أو حسب المحامي.', whenToUse: 'لتنظيم العرض والتركيز على الملفات المفتوحة.', placement: 'bottom' },
  { id: 'matters-table', targetId: 'tour-matters-table', route: '/admin/matters', title: 'جدول القضايا', whatIsIt: 'عرض تفصيلي لملفات الترافع.', whatDoesItDo: 'يحتوي على كافة القضايا وآخر الجلسات المرتبطة بها.', whenToUse: 'انقر على أي صف لفتح التفاصيل الكاملة للقضية.', placement: 'top' },

  // --- Tasks ---
  { id: 'tasks-add', targetId: 'tour-tasks-add', route: '/admin/tasks', title: 'زر إضافة مهمة', whatIsIt: 'منشئ المهام.', whatDoesItDo: 'يسمح بتكليف محامي بمهمة معينة.', whenToUse: 'لإسناد صياغة مذكرات أو حضور جلسات للموظفين.', placement: 'bottom' },
  { id: 'tasks-filter', targetId: 'tour-tasks-filter', route: '/admin/tasks', title: 'تبويبات المهام', whatIsIt: 'فلتر المهام.', whatDoesItDo: 'يفرز المهام (الكل، قيد التنفيذ، مكتملة).', whenToUse: 'لمتابعة ما تم إنجازه وما هو متأخر.', placement: 'bottom' },
  { id: 'tasks-list', targetId: 'tour-tasks-list', route: '/admin/tasks', title: 'قائمة المهام', whatIsIt: 'عرض مهام اليوم.', whatDoesItDo: 'تعرض المهام مع إمكانية التأشير عليها كمكتملة.', whenToUse: 'ضع علامة "صح" بجوار المهمة فور إنجازها.', placement: 'top' },

  // --- Finance ---
  { id: 'finance-add-income', targetId: 'tour-finance-add-income', route: '/admin/finance', title: 'إضافة إيراد (Income)', whatIsIt: 'زر تسجيل المقبوضات.', whatDoesItDo: 'يسجل الدفعات المستلمة من العملاء ويفصل الضريبة تلقائياً.', whenToUse: 'عند استلام أتعاب أو دفعة نقدية/حوالة.', placement: 'bottom' },
  { id: 'finance-add-expense', targetId: 'tour-finance-add-expense', route: '/admin/finance', title: 'إضافة مصروف (Expense)', whatIsIt: 'زر تسجيل المدفوعات.', whatDoesItDo: 'يسجل مصاريف المكتب (رواتب، إيجار، قرطاسية).', whenToUse: 'عند الدفع لمورد أو مصاريف إدارية.', placement: 'bottom' },
  { id: 'finance-summary', targetId: 'tour-finance-summary', route: '/admin/finance', title: 'ملخص الحركة المالية', whatIsIt: 'لوحة المؤشرات المالية.', whatDoesItDo: 'تحسب آلياً إجمالي الإيرادات ناقص المصروفات لتعطيك الصافي.', whenToUse: 'دائماً قبل اتخاذ قرارات مالية تخص المكتب.', placement: 'bottom' },
  { id: 'finance-export', targetId: 'tour-finance-export', route: '/admin/finance', title: 'زر التصدير (Export)', whatIsIt: 'منشئ التقارير.', whatDoesItDo: 'يصدر الجدول المالي بصيغة Excel/CSV لمدقق الحسابات.', whenToUse: 'في نهاية الربع المالي أو نهاية السنة لغايات الضريبة.', placement: 'bottom' },
  { id: 'finance-table', targetId: 'tour-finance-table', route: '/admin/finance', title: 'السجل المالي المفصل', whatIsIt: 'دفتر الأستاذ.', whatDoesItDo: 'يسجل كل حركة مالية مع المرفقات المؤيدة.', whenToUse: 'لمراجعة القيود والتأكد من مطابقتها للرصيد البنكي.', placement: 'top' },

  // --- AI ---
  { id: 'ai-input', targetId: 'tour-ai-input', route: '/admin/ai', title: 'مربع الاستفسارات الذكية', whatIsIt: 'عقلك الاصطناعي المساعد.', whatDoesItDo: 'يسمح لك بكتابة أي سؤال حول مستند مرفوع ليجيبك.', whenToUse: 'عندما تواجه عقداً طويلاً وتريد استخراج بند.', placement: 'bottom' },
  { id: 'ai-run', targetId: 'tour-ai-run', route: '/admin/ai', title: 'زر التنفيذ والتحليل', whatIsIt: 'مُشغل المعالجة.', whatDoesItDo: 'يرسل طلبك لخوادم الذكاء الاصطناعي لتحليله والرد الموثق.', whenToUse: 'بعد كتابة استفسارك واختيار المستند.', placement: 'top' },

  // --- Library ---
  { id: 'library-upload', targetId: 'tour-library-upload', route: '/admin/documents', title: 'زر رفع المستندات', whatIsIt: 'بوابة الإدخال السحابية.', whatDoesItDo: 'يرفع الملفات ويشفرها لحمايتها من الوصول غير المصرح به.', whenToUse: 'لرفع مستند جديد لمكتبة النظام وحفظه بأمان.', placement: 'bottom' },

  // --- Settings ---
  { id: 'settings-whatsapp', targetId: 'tour-tab-whatsapp', route: '/admin/settings', title: 'أتمتة الواتساب', whatIsIt: 'ربط النظام بالواتساب.', whatDoesItDo: 'يرسل إشعارات آلية للعملاء عند تغيير حالة قضاياهم أو طلباتهم.', whenToUse: 'تفعيلها لتحسين تواصل المكتب مع العملاء تلقائياً.', placement: 'bottom' },
  { id: 'settings-email', targetId: 'tour-tab-email', route: '/admin/settings', title: 'أتمتة البريد الإلكتروني', whatIsIt: 'ربط البريد.', whatDoesItDo: 'يرسل الفواتير والتنبيهات الرسمية للعملاء.', whenToUse: 'تفعيلها لإرسال المستندات عبر الإيميل.', placement: 'bottom' },
  { id: 'settings-n8n', targetId: 'tour-tab-n8n', route: '/admin/settings', title: 'ربط n8n', whatIsIt: 'محرك الربط الخارجي.', whatDoesItDo: 'يرسل أحداث النظام لأي تطبيق خارجي تستخدمه.', whenToUse: 'عند الحاجة لربط النظام بتطبيقات أخرى.', placement: 'bottom' },
  { id: 'settings-tour', targetId: 'tour-tab-tour', route: '/admin/settings', title: 'إعادة تشغيل الجولة', whatIsIt: 'زر تشغيل الجولة.', whatDoesItDo: 'يسمح لك بإعادة الجولة الإرشادية لتعلم النظام.', whenToUse: 'عند نسيان ميزة معينة أو لتدريب موظف جديد.', placement: 'bottom' },

  // --- Office Settings ---
  { id: 'office-form', targetId: 'tour-office-form', route: '/admin/settings/office', title: 'بيانات المكتب الرسمية', whatIsIt: 'الهوية المؤسسية.', whatDoesItDo: 'تُستخدم هذه البيانات في ترويسة الفواتير والعقود.', whenToUse: 'تأكد من صحتها لتكون فواتيرك معتمدة ضريبياً.', placement: 'top' },
  { id: 'office-backup', targetId: 'tour-office-backup', route: '/admin/settings/office', title: 'النسخة الاحتياطية', whatIsIt: 'تصدير البيانات.', whatDoesItDo: 'يحمل لك كافة بيانات المكتب كملف احتياطي (JSON).', whenToUse: 'دورياً لضمان أمان بياناتك أو قبل التحديثات.', placement: 'bottom' },
  { id: 'office-save', targetId: 'tour-office-save', route: '/admin/settings/office', title: 'حفظ الإعدادات', whatIsIt: 'زر الحفظ.', whatDoesItDo: 'يحفظ أي تعديلات قمت بها على بيانات المكتب.', whenToUse: 'بعد كل تعديل في البيانات.', placement: 'bottom' },

  // --- Marketing ---
  { id: 'marketing-tabs', targetId: 'tour-marketing-tabs', route: '/admin/marketing', title: 'أقسام التسويق', whatIsIt: 'تبويبات الإدارة.', whatDoesItDo: 'للتنقل بين ملخص الأداء، الحملات، واستوديو الذكاء الاصطناعي.', whenToUse: 'لتصفح أدوات التسويق المختلفة.', placement: 'bottom' },
  { id: 'marketing-stat', targetId: 'tour-marketing-stat-spend', route: '/admin/marketing', title: 'أداء التسويق', whatIsIt: 'مؤشرات الأداء.', whatDoesItDo: 'تعرض الإنفاق والعائد والمشاهدات للحملات.', whenToUse: 'لتقييم نجاح حملاتك الإعلانية.', placement: 'bottom' },
  { id: 'marketing-new', targetId: 'tour-marketing-new-campaign', route: '/admin/marketing', title: 'حملة جديدة', whatIsIt: 'إنشاء إعلان.', whatDoesItDo: 'لإطلاق حملة تسويقية جديدة.', whenToUse: 'عند بدء ترويج لخدماتك.', placement: 'bottom' },
  { id: 'marketing-ai', targetId: 'tour-marketing-ai-studio-btn', route: '/admin/marketing', title: 'استوديو الذكاء الاصطناعي', whatIsIt: 'صانع المحتوى.', whatDoesItDo: 'يولد لك أفكار ونصوص إعلانية بالذكاء الاصطناعي.', whenToUse: 'عندما تبحث عن أفكار تسويقية مبتكرة.', placement: 'bottom' },

  // --- Bookings ---
  { id: 'bookings-search', targetId: 'tour-bookings-search', route: '/admin/bookings', title: 'بحث المواعيد', whatIsIt: 'شريط البحث.', whatDoesItDo: 'يبحث في سجل المواعيد عن اسم محدد.', whenToUse: 'للوصول السريع لموعد عميل.', placement: 'bottom' },
  { id: 'bookings-list', targetId: 'tour-bookings-list', route: '/admin/bookings', title: 'قائمة المواعيد', whatIsIt: 'سجل المواعيد.', whatDoesItDo: 'يعرض كل المواعيد، وقتها، ونوعها.', whenToUse: 'لمراجعة الجدول اليومي والأسبوعي.', placement: 'top' },

  // --- Banking ---
  { id: 'banking-accounts', targetId: 'tour-banking-accounts-grid', route: '/admin/finance/banking', title: 'الحسابات البنكية', whatIsIt: 'أرصدة البنوك.', whatDoesItDo: 'توضح رصيد كل حساب بنكي مسجل.', whenToUse: 'لمراقبة السيولة في البنوك.', placement: 'bottom' },
  { id: 'banking-new-tx', targetId: 'tour-banking-new-tx', route: '/admin/finance/banking', title: 'إضافة حركة', whatIsIt: 'تسجيل حركة.', whatDoesItDo: 'لإضافة إيداع أو سحب في حساب بنكي.', whenToUse: 'عند حدوث حركة في البنك لم تُسجل آلياً.', placement: 'bottom' },
  { id: 'banking-new-rec', targetId: 'tour-banking-new-rec', route: '/admin/finance/banking', title: 'تسوية بنكية', whatIsIt: 'مطابقة الأرصدة.', whatDoesItDo: 'تطابق رصيد النظام مع كشف البنك.', whenToUse: 'نهاية كل شهر للتأكد من دقة الحسابات.', placement: 'bottom' },
  { id: 'banking-tx-table', targetId: 'tour-banking-tx-table', route: '/admin/finance/banking', title: 'سجل الحركات', whatIsIt: 'تفاصيل العمليات.', whatDoesItDo: 'يعرض كل العمليات السابقة لكل حساب.', whenToUse: 'لمراجعة وتدقيق الحركات السابقة.', placement: 'top' },

  // --- Debts ---
  { id: 'debts-metrics', targetId: 'tour-debts-metrics', route: '/admin/finance/debts', title: 'إحصائيات الذمم', whatIsIt: 'المركز المالي.', whatDoesItDo: 'يوضح ما لك من ديون وما عليك من التزامات.', whenToUse: 'لمعرفة موقفك المالي بسرعة.', placement: 'bottom' },
  { id: 'debts-new-payable', targetId: 'tour-debts-new-payable', route: '/admin/finance/debts', title: 'التزام علينا', whatIsIt: 'تسجيل دين.', whatDoesItDo: 'يضيف التزام مالي يجب عليك سداده.', whenToUse: 'عند شراء شيء بالآجل.', placement: 'bottom' },
  { id: 'debts-new-receivable', targetId: 'tour-debts-new-receivable', route: '/admin/finance/debts', title: 'مستحق لنا', whatIsIt: 'تسجيل مطالبة.', whatDoesItDo: 'يضيف دين لك عند عميل أو جهة.', whenToUse: 'عند تقديم خدمة دون استلام كامل الأتعاب.', placement: 'bottom' },
  { id: 'debts-lists', targetId: 'tour-debts-lists', route: '/admin/finance/debts', title: 'قوائم الذمم', whatIsIt: 'تفاصيل الديون.', whatDoesItDo: 'تعرض كل المستحقات والالتزامات بالتفصيل.', whenToUse: 'لمتابعة تحصيل الديون المتأخرة.', placement: 'top' },

  // --- Invoices ---
  { id: 'invoices-metrics', targetId: 'tour-invoices-metrics', route: '/admin/finance/invoices', title: 'ملخص الفواتير', whatIsIt: 'مؤشرات الفوترة.', whatDoesItDo: 'يعرض إجمالي الفواتير والمبالغ المحصلة والمتبقية.', whenToUse: 'لمتابعة أداء التحصيل.', placement: 'bottom' },
  { id: 'invoices-new', targetId: 'tour-invoices-new', route: '/admin/finance/invoices', title: 'فاتورة جديدة', whatIsIt: 'إصدار فاتورة.', whatDoesItDo: 'يفتح نموذج إصدار فاتورة ضريبية.', whenToUse: 'عند مطالبة العميل بدفعة أو أتعاب.', placement: 'bottom' },
  { id: 'invoices-table', targetId: 'tour-invoices-table', route: '/admin/finance/invoices', title: 'سجل الفواتير', whatIsIt: 'قائمة الفواتير.', whatDoesItDo: 'يعرض كل الفواتير المُصدرة وحالاتها.', whenToUse: 'لتسجيل سداد لفاتورة أو مراجعتها.', placement: 'top' },

  // --- Finance Reports ---
  { id: 'reports-metrics', targetId: 'tour-reports-metrics', route: '/admin/finance/reports', title: 'ملخص السنة', whatIsIt: 'أداء العام.', whatDoesItDo: 'يلخص الإيرادات والمصروفات للسنة المختارة.', whenToUse: 'لتقييم الأداء المالي السنوي.', placement: 'bottom' },
  { id: 'reports-tax-calc', targetId: 'tour-reports-tax-calc', route: '/admin/finance/reports', title: 'حاسبة الإقرار', whatIsIt: 'الضريبة.', whatDoesItDo: 'يحسب ضريبة القيمة المضافة المستحقة بناءً على القيود.', whenToUse: 'عند تجهيز الإقرار الضريبي ربع السنوي.', placement: 'top' },
  { id: 'reports-ledger', targetId: 'tour-reports-ledger', route: '/admin/finance/reports', title: 'سجل القيود', whatIsIt: 'تفاصيل القيود.', whatDoesItDo: 'ينقلك لصفحة القيود المالية المفصلة.', whenToUse: 'إذا احتجت مراجعة تفاصيل الحركات.', placement: 'bottom' },

  // --- Analytics ---
  { id: 'analytics-kpi', targetId: 'tour-analytics-kpi', route: '/admin/analytics', title: 'مؤشرات التحليلات', whatIsIt: 'نظرة عامة.', whatDoesItDo: 'تعرض ملخص الزيارات، الطلبات، والعائد.', whenToUse: 'لمعرفة كفاءة استثماراتك في التسويق.', placement: 'bottom' },
  { id: 'analytics-chart-1', targetId: 'tour-analytics-chart-1', route: '/admin/analytics', title: 'مصادر الطلبات', whatIsIt: 'توزيع القنوات.', whatDoesItDo: 'يوضح من أين يأتي معظم عملائك المحتملين.', whenToUse: 'لتحديد أي القنوات الإعلانية أكثر جدوى.', placement: 'top' },
  { id: 'analytics-chart-2', targetId: 'tour-analytics-chart-2', route: '/admin/analytics', title: 'النمو المالي', whatIsIt: 'تطور الإيرادات.', whatDoesItDo: 'يعرض كيف تنمو إيراداتك بمرور الأشهر.', whenToUse: 'لتحليل استقرار نمو المكتب مالياً.', placement: 'top' },
]

// --- Context ---
const TourContext = createContext<TourContextType | undefined>(undefined)

export const useTour = () => {
  const context = useContext(TourContext)
  if (!context) throw new Error('useTour must be used within TourProvider')
  return context
}

// --- Provider Component ---
export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const { user } = useAuth()
  const { pathname } = useLocation()

  /**
   * الجولة التعريفية تشرح شاشات لوحة الإدارة، فلا يجوز أن تظهر لزائر الموقع.
   * الشرط ثلاثي: مستخدم إداري + داخل مسار /admin + لم يُنهِ الجولة سابقًا.
   */
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin-login'
  const mayRunTour = user?.role === 'admin' && isAdminArea

  useEffect(() => {
    setHasCompleted(localStorage.getItem('lawyer_tour_completed') === 'true')
  }, [])

  useEffect(() => {
    if (!mayRunTour) {
      // الخروج من منطقة الإدارة يُنهي أي جولة جارية فورًا
      setIsActive(false)
      return
    }
    if (localStorage.getItem('lawyer_tour_completed') === 'true') return
    if (window.innerWidth <= 768) return

    const t = setTimeout(() => setIsActive(true), 2000)
    return () => clearTimeout(t)
  }, [mayRunTour])

  const startTour = () => {
    if (!mayRunTour) return
    setCurrentStepIndex(0)
    setIsActive(true)
  }

  const endTour = () => {
    setIsActive(false)
    setHasCompleted(true)
    localStorage.setItem('lawyer_tour_completed', 'true')
  }

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((p) => p + 1)
    } else {
      endTour()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((p) => p - 1)
    }
  }

  return (
    <TourContext.Provider value={{ isActive, startTour, endTour, hasCompleted }}>
      {children}
      <AnimatePresence>
        {isActive && mayRunTour && (
          <TourOverlay
            step={TOUR_STEPS[currentStepIndex]}
            totalSteps={TOUR_STEPS.length}
            currentIndex={currentStepIndex}
            onNext={nextStep}
            onPrev={prevStep}
            onClose={endTour}
          />
        )}
      </AnimatePresence>
    </TourContext.Provider>
  )
}

// --- Overlay Component (The Premium UI) ---
function TourOverlay({
  step,
  totalSteps,
  currentIndex,
  onNext,
  onPrev,
  onClose,
}: {
  step: TourStep
  totalSteps: number
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
}) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  // 1. Handle Auto-Navigation
  useEffect(() => {
    if (step.route && location.pathname !== step.route) {
      setIsNavigating(true)
      setTargetRect(null)
      navigate(step.route)
    } else {
      setIsNavigating(false)
    }
  }, [step.route, location.pathname, navigate])

  // 2. Handle Positioning
  useEffect(() => {
    if (isNavigating) return

    let timeoutId: ReturnType<typeof setTimeout>
    let retryCount = 0

    const updatePosition = () => {
      const el = document.getElementById(step.targetId)
      if (el) {
        // Scroll to element gently if not in viewport
        const rect = el.getBoundingClientRect()
        // Adding a bit of padding so it scrolls into a nice view
        if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        
        // Wait a frame for scrolling to settle
        setTimeout(() => {
          const newRect = el.getBoundingClientRect()
          setTargetRect(newRect)
          
          // Calculate Smart Tooltip Position
          const tooltipWidth = 400
          // Use actual height if mounted, otherwise fallback to 250
          const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 250
          const padding = 24

          const spaceBottom = window.innerHeight - newRect.bottom
          const spaceTop = newRect.top
          const spaceLeft = newRect.left
          const spaceRight = window.innerWidth - newRect.right

          let top = 0
          let left = 0

          // Determine best placement based on requested placement OR available space
          let finalPlacement = step.placement
          if (!finalPlacement) {
             if (spaceBottom >= tooltipHeight + padding) finalPlacement = 'bottom'
             else if (spaceTop >= tooltipHeight + padding) finalPlacement = 'top'
             else if (spaceLeft >= tooltipWidth + padding) finalPlacement = 'left'
             else if (spaceRight >= tooltipWidth + padding) finalPlacement = 'right'
             else finalPlacement = spaceBottom > spaceTop ? 'bottom' : 'top'
          }

          // Calculate coordinates based on final placement
          if (finalPlacement === 'bottom') {
             top = newRect.bottom + padding
             left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, newRect.left + (newRect.width / 2) - (tooltipWidth / 2)))
             if (top + tooltipHeight > window.innerHeight && spaceTop > spaceBottom) {
                 top = newRect.top - tooltipHeight - padding // Flip to top if bottom is squished
             }
          } else if (finalPlacement === 'top') {
             top = newRect.top - tooltipHeight - padding
             left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, newRect.left + (newRect.width / 2) - (tooltipWidth / 2)))
             if (top < padding && spaceBottom > spaceTop) {
                 top = newRect.bottom + padding // Flip to bottom if top is squished
             }
          } else if (finalPlacement === 'left') {
             left = newRect.left - tooltipWidth - padding
             top = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, newRect.top + (newRect.height / 2) - (tooltipHeight / 2)))
          } else if (finalPlacement === 'right') {
             left = newRect.right + padding
             top = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, newRect.top + (newRect.height / 2) - (tooltipHeight / 2)))
          }

          // Absolute strict clamping so it NEVER disappears off-screen under any circumstances
          if (left < padding) left = padding
          if (left > window.innerWidth - tooltipWidth - padding) left = window.innerWidth - tooltipWidth - padding
          
          let finalTop = top
          if (finalTop < padding) finalTop = padding
          if (finalTop > window.innerHeight - tooltipHeight - padding) finalTop = window.innerHeight - tooltipHeight - padding

          // If clamping caused overlap, fallback to side placement if there is room
          const overlaps = (
            finalTop < newRect.bottom &&
            finalTop + tooltipHeight > newRect.top &&
            left < newRect.right &&
            left + tooltipWidth > newRect.left
          )

          if (overlaps) {
            if (spaceRight >= tooltipWidth + padding) {
              finalTop = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, newRect.top + (newRect.height / 2) - (tooltipHeight / 2)))
              left = newRect.right + padding
            } else if (spaceLeft >= tooltipWidth + padding) {
              finalTop = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, newRect.top + (newRect.height / 2) - (tooltipHeight / 2)))
              left = newRect.left - tooltipWidth - padding
            } else if (spaceTop >= tooltipHeight + padding) {
              finalTop = newRect.top - tooltipHeight - padding
              left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, newRect.left + (newRect.width / 2) - (tooltipWidth / 2)))
            } else if (spaceBottom >= tooltipHeight + padding) {
              finalTop = newRect.bottom + padding
              left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, newRect.left + (newRect.width / 2) - (tooltipWidth / 2)))
            } else {
              // Forced to overlap completely (target is huge)!
              // Smart strategy: place the tooltip at the very bottom of the screen, centered.
              // This ensures the top (most important part) of the target element remains visible and unblocked.
              finalTop = window.innerHeight - tooltipHeight - padding
              left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, newRect.left + (newRect.width / 2) - (tooltipWidth / 2)))
            }
          }

          setTooltipPos({ top: finalTop, left })
        }, 300)
      } else {
        if (retryCount < 10) {
          retryCount++
          timeoutId = setTimeout(updatePosition, 300)
        } else {
          setTargetRect(null)
          // Fallback position to center
          setTooltipPos({ 
            top: window.innerHeight / 2 - 140, 
            left: window.innerWidth / 2 - 200 
          })
        }
      }
    }

    timeoutId = setTimeout(updatePosition, 500)
    
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
      clearTimeout(timeoutId)
    }
  }, [step.targetId, isNavigating, location.pathname, step.placement])

  // 3. Lock Scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Create the polygon clip-path for the "hole" in the blur overlay
  const getClipPath = () => {
    if (!targetRect) return 'none'
    const x1 = Math.max(0, targetRect.left - 12)
    const y1 = Math.max(0, targetRect.top - 12)
    const x2 = Math.min(window.innerWidth, targetRect.right + 12)
    const y2 = Math.min(window.innerHeight, targetRect.bottom + 12)

    return `polygon(
      0% 0%, 
      0% 100%, 
      ${x1}px 100%, 
      ${x1}px ${y1}px, 
      ${x2}px ${y1}px, 
      ${x2}px ${y2}px, 
      ${x1}px ${y2}px, 
      ${x1}px 100%, 
      100% 100%, 
      100% 0%
    )`
  }

  // 3. Handle Keyboard events (Enter, Escape, ArrowKeys)
  useEffect(() => {
    if (isNavigating) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === 'ArrowLeft') {
        e.preventDefault()
        onNext()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNavigating, onNext, onPrev, onClose])

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-auto font-tajawal">
      
      {/* 
        Premium Glassmorphism Backdrop 
        Using clip-path to cut a hole so the target element is NOT blurred or darkened!
      */}
      <div
        className="absolute inset-0 bg-[#0b1426]/75 backdrop-blur-[6px] transition-all duration-300 ease-out pointer-events-auto"
        style={{ clipPath: getClipPath() }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on the background from triggering things
      />

      {/* Target Highlight Cutout Border & Glow */}
      {targetRect && !isNavigating && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute rounded-xl pointer-events-none"
          style={{
            top: targetRect.top - 12,
            left: targetRect.left - 12,
            width: targetRect.width + 24,
            height: targetRect.height + 24,
            boxShadow: '0 0 30px 5px rgba(142, 177, 209, 0.4)',
            border: '2px solid rgba(142, 177, 209, 0.9)',
            background: 'transparent',
          }}
        >
          {/* Subtle animated pulse inside the cutout */}
          <motion.div
            animate={{ opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl bg-[#8EB1D1]/30"
          />
        </motion.div>
      )}

      {isNavigating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#1C2B48] p-6 rounded-2xl border border-[#8EB1D1]/30 shadow-2xl flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Settings2 className="size-8 text-[#8EB1D1]" />
            </motion.div>
            <p className="text-white font-amiri text-lg">جاري الانتقال للصفحة المطلوبة لشرحها...</p>
          </div>
        </div>
      )}

      {/* Tooltip Card */}
      {!isNavigating && (
        <motion.div
          ref={tooltipRef}
          layout
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
          className="absolute w-[400px] max-w-[90vw] max-h-[85vh] flex flex-col p-6 rounded-3xl bg-[#1C2B48] border border-[#8EB1D1]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-50"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
          }}
        >
          {/* Decorative Aurora glow inside card */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#8EB1D1]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-5 shrink-0">
              <h3 className="text-xl font-bold text-white font-amiri">{step.title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 text-[#8EB1D1] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6 flex-1 overflow-y-auto pr-2 pb-2">
              <div className="flex gap-3 items-start">
                <HelpCircle className="size-5 text-[#8EB1D1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-[#8EB1D1]/70 uppercase tracking-widest mb-1">ما هذا؟</h4>
                  <p className="text-sm text-[#C4D8E5] font-medium leading-relaxed">{step.whatIsIt}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Settings2 className="size-5 text-[#8EB1D1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-[#8EB1D1]/70 uppercase tracking-widest mb-1">ماذا يفعل؟</h4>
                  <p className="text-sm text-[#C4D8E5] font-medium leading-relaxed">{step.whatDoesItDo}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="size-5 text-[#8EB1D1] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[11px] font-bold text-[#8EB1D1]/70 uppercase tracking-widest mb-1">متى أستخدمه؟</h4>
                  <p className="text-sm text-[#C4D8E5] font-medium leading-relaxed">{step.whenToUse}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-[#8EB1D1]/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-[#8EB1D1]/10 border border-[#8EB1D1]/20">
                  <span className="text-[#8EB1D1] text-xs font-bold font-mono">
                    {currentIndex + 1} / {totalSteps}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onPrev}
                  disabled={currentIndex === 0}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                    currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-[#8EB1D1]' : 'bg-white/5 text-[#8EB1D1] hover:bg-white/10'
                  }`}
                >
                  <ChevronRight className="size-4" />
                </button>
                
                <button
                  onClick={onNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-white to-[#E8ECEF] text-[#1C2B48] font-bold text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  {currentIndex === totalSteps - 1 ? (
                    <>
                      <span>إنهاء الجولة</span>
                      <Check className="size-4" />
                    </>
                  ) : (
                    <>
                      <span>التالي</span>
                      <ChevronLeft className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

