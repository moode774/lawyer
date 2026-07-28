import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_FAQS } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function FaqPage() {
  const { t } = useT()
  useSEO({ title: 'الأسئلة الشائعة | ' + t('مكتب المحاماة', 'Law Firm') })

  const [activeId, setActiveId] = useState<string | null>(DEMO_FAQS[0]?.id || null)

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 space-y-12 font-tajawal min-h-[85vh]">
      <div className="text-center space-y-3">
        <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs px-4 py-1.5 border-none shadow-sm">
          {t('الأسئلة الشائعة والتوضيحات', 'FAQs & Answers')}
        </Badge>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#1C2B48]">{t('إجابات عن تساؤلاتك القانونية', 'Frequently Asked Questions')}</h1>
        <p className="text-[#527094] text-sm sm:text-base max-w-xl mx-auto">{t('كل ما تحتاج معرفته عن إجراءات الاستشارات والعقود وسرية البيانات.', 'Clear insights about booking, confidentiality & services.')}</p>
      </div>

      <div className="space-y-4">
        {DEMO_FAQS.map((faq) => {
          const isOpen = activeId === faq.id
          return (
            <Card key={faq.id} className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm hover:shadow-md transition-all">
              <button
                onClick={() => setActiveId(isOpen ? null : faq.id)}
                className="w-full text-start flex items-center justify-between gap-4 font-bold text-[#1C2B48] hover:text-[#8EB1D1] text-base sm:text-lg transition-colors"
              >
                <span>{faq.question}</span>
                <div className="size-8 rounded-full bg-[#E8ECEF] flex items-center justify-center shrink-0">
                  <ChevronDown className={cn('size-5 text-[#1C2B48] transition-transform duration-300', isOpen && 'rotate-180 text-[#8EB1D1]')} />
                </div>
              </button>
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-[#C4D8E5]/60 text-sm text-[#527094] leading-relaxed font-tajawal">
                  {faq.answer}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
