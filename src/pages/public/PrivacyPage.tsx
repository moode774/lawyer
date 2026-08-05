import React from 'react'
import { ShieldCheck, Lock, Scale } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { useSEO } from '../../lib/seo'

export default function PrivacyPage() {
  const { t } = useT()
  useSEO({ title: 'سياسة الخصوصية وحماية البيانات | ' + BRAND.nameAr })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-20 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <Lock className="size-4 text-[#C5A880]" />
            <span>{t('حماية البيانات الشخصية', 'Data Protection')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white leading-tight">
            {t('سياسة الخصوصية وحماية البيانات', 'Privacy Policy')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-xs sm:text-sm font-medium">
            {t('تاريخ التحديث: 2026م - التزاماً بنظام حماية البيانات الشخصية بالمملكة', 'Updated: 2026 - Saudi Personal Data Protection Law (PDPL) Compliant')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="p-8 sm:p-12 bg-white border border-[#EADFCF] rounded-2xl text-sm text-slate-600 leading-relaxed space-y-8 shadow-sm">
          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('1. جمع البيانات والغرض منها', '1. Data Collection')}
            </h3>
            <p>{t('يتم جمع البيانات الشخصية (الاسم، الجوال، البريد) لغرض تقديم الاستشارات وتثبيت المواعيد فقط، مع الالتزام التام بعدم إفشائها لأي طرف ثالث.', 'Personal data collected solely for legal service delivery.')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="font-amiri font-bold text-[#0F172A] text-xl border-b border-[#F0E6D8] pb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#C5A880]"></span>
              {t('2. السرية المهنية القانونية', '2. Legal Privilege & Confidentiality')}
            </h3>
            <p>{t('نتعامل مع المستندات والمراسلات وفق التزامات السرية المهنية والأنظمة السعودية ذات الصلة، مع قصر الوصول عليها بحسب الحاجة والصلاحيات الممنوحة.', 'Documents and communications are handled under applicable Saudi confidentiality duties and access controls.')}</p>
          </section>
        </Card>
      </div>
    </div>
  )
}
