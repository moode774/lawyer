import React from 'react'
import { FileText, Scale } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { useSEO } from '../../lib/seo'

export default function TermsPage() {
  const { t } = useT()
  useSEO({ title: 'الشروط والأحكام | ' + BRAND.nameAr })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-20 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <FileText className="size-4 text-[#C5A880]" />
            <span>{t('الشروط والأحكام', 'Terms of Service')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white leading-tight">
            {t('الشروط والأحكام لاستخدام المنصة', 'Terms & Conditions')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-xs sm:text-sm font-medium">
            {t('توضح هذه الشروط نطاق استخدام الموقع والخدمات الرقمية وفق الأنظمة السعودية ذات الصلة.', 'These terms explain the website and digital service scope under applicable Saudi regulations.')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="p-8 sm:p-12 bg-white border border-[#EADFCF] rounded-2xl text-sm text-slate-600 leading-relaxed space-y-8 shadow-sm">
          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('1. نطاق الاستشارات والتنبيه النظامي', '1. Scope & Legal Disclaimer')}
            </h3>
            <p>{t('المحتوى المنشور في الموقع معلومات عامة ولا يعد رأيًا قانونيًا لواقعة محددة. تعتمد أي استشارة على الوقائع والمستندات والأنظمة السارية وقت تقديمها، ولا تتضمن ضمانًا لنتيجة قضائية أو إدارية أو تعاقدية.', 'Website content is general information. Advice depends on the facts, documents, and applicable law and does not guarantee any judicial, administrative, or contractual outcome.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('2. حجز ومواعيد الاستشارات', '2. Consultations & Cancellation')}
            </h3>
            <p>{t('إرسال طلب الموعد لا يعني تأكيده. يصبح الموعد مؤكدًا بعد إشعار المستفيد من المكتب، ويجوز إعادة الجدولة بحسب التوفر وسياسة المكتب المبلغة عند التأكيد.', 'Submitting a booking request does not confirm it. Confirmation is issued by the firm and rescheduling remains subject to availability and the communicated policy.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('3. قبول التكليف وتعارض المصالح', '3. Engagement & Conflicts')}
            </h3>
            <p>{t('لا تنشأ علاقة محاماة بمجرد إرسال نموذج أو مستند. تخضع الطلبات للمراجعة والتحقق من تعارض المصالح والاتفاق على نطاق العمل والأتعاب واستكمال متطلبات قبول التكليف.', 'Submitting a form or document does not create a lawyer-client relationship. Matters remain subject to review, conflict checks, scope and fee agreement, and engagement requirements.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('4. المدد وقرارات الجهات المختصة', '4. Timelines & Authority Decisions')}
            </h3>
            <p>{t('أي مدد تذكر هي تقديرية ما لم يتفق كتابة على خلاف ذلك، وقد تتأثر باكتمال المستندات وإجراءات المحاكم والجهات الحكومية وأطراف العلاقة.', 'Any stated timelines are estimates unless agreed otherwise in writing and may depend on documents, courts, authorities, and other parties.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('5. السرية والبيانات', '5. Confidentiality & Data')}
            </h3>
            <p>{t('تعالج البيانات وفق سياسة الخصوصية والتزامات السرية المهنية والأنظمة ذات الصلة، مع مراعاة حالات الإفصاح التي يوجبها النظام أو أمر الجهة المختصة.', 'Data is handled under the privacy policy, professional confidentiality duties, and applicable law, including legally required disclosures.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('6. تحديث المعلومات', '6. Information Updates')}
            </h3>
            <p>{t('قد تتغير الأنظمة واللوائح والإجراءات، لذلك ينبغي التحقق من حداثة المعلومة والحصول على تقييم مهني قبل اتخاذ قرار بناءً على محتوى الموقع.', 'Laws and procedures may change. Verify current information and obtain professional assessment before acting on website content.')}</p>
          </section>
        </Card>
      </div>
    </div>
  )
}
