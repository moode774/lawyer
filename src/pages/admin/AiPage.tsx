import React, { useState } from 'react'
import { Sparkles, FileText, Send, Clock, ShieldCheck, AlertCircle, Upload, CheckCircle2 } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '../../lib/records'
import type { Doc } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function AiPage() {
  const { t } = useT()
  useSEO({ title: 'المساعد القانوني الذكي AI | ' + t('مكتب المحاماة', 'Law Firm') })

  const { data: docs = [] } = useQuery({ queryKey: ['documents'], queryFn: listDocuments })
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const quickActions = [
    { label: 'لخص العقد واستخرج الالتزامات الرئيسية', query: 'قم بتلخيص هذا العقد واستخراج التزامات الطرفين الرئيسية مع توضيح مهل التنفيذ.' },
    { label: 'استخرج التواريخ والمهل النظامية', query: 'أنشئ جدولاً بكافة التواريخ والمهل والمدد المنصوص عليها بالمسودة.' },
    { label: 'استخرج الأطراف والقيم المالية', query: 'ما هي أسماء الأطراف المقيدة بالعقد وما هي المبالغ وآلية الدفع والشروط الجزائية؟' },
    { label: 'أنشئ تسلسلاً زمنيًا للأحداث', query: 'قم ببناء تسلسل زمني (Chronological Timeline) للأحداث من واقع المستندات.' }
  ]

  const handleExecutePrompt = (queryText: string) => {
    setIsLoading(true)
    setResponse(null)

    setTimeout(() => {
      setIsLoading(false)
      if (queryText.includes('تواريخ')) {
        setResponse(`### نتيجة التحليل النظامي والمخطط الزمني للمستند:
1. **تاريخ تحرير العقد:** 12 يناير 2026م (ص 1)
2. **مهلة تسليم المرحلة الأولى:** 15 فبراير 2026م (المادة الخامسة - ص 3)
3. **مهلة السداد النهائية:** 30 مارس 2026م (المادة السابعة - ص 4)
4. **فترة الإخطار بالإنهاء:** 30 يومًا قبل انتهاء العقد (المادة الحادية عشرة - ص 6)

> 📌 **مرجع المستند:** عقود وتأسيس الشركات - عقد تأسيس شركة الحلول الرقمية (ص 1 - 6).`)
      } else if (queryText.includes('الأطراف')) {
        setResponse(`### الأطراف والقيم المالية المستخرجة:
- **الطرف الأول:** شركة الحلول الرقمية المحدودة (سجل تجاري: 1010XXXXXX)
- **الطرف الثاني:** مؤسسة الأفق للتقنية
- **القيمة الإجمالية للعقد:** 450,000 ريال سعودي (شاملة ضريبة القيمة المضافة)
- **الدفعة المقدمة:** 20% عند التوقيع (90,000 ريال)
- **الشرط الجزائي:** 1,000 ريال عن كل يوم تأخير بما لا يتجاوز 10% من قيمة العقد (ص 5).

> 📌 **المصدر:** مستند عقد التوريد رقم C-2026-09.`)
      } else {
        setResponse(`### ملخص المستند والالتزامات القانونية:
يتضمن المستند اتفاقية خدمات استشارية وتقنية بين الطرف الأول والطرف الثاني لمدة 12 شهرًا.

**أهم البنود والالتزامات:**
- يلتزم الطرف الثاني بتقديم التقرير الفني الشهري في اليوم الأول من كل شهر.
- السرية وعدم المنافسة لمدة 24 شهرًا بعد انتهاء التعاقد (المادة التاسعة).
- يخضع هذا العقد للأنظمة واللوائح المعمول بها في المملكة العربية السعودية، والاختصاص القضائي للمحاكم التجارية بالرياض (المادة 14).

> 📌 **ملاحظة نظامية:** هذا التحليل تم توليده آليًا كمساعد للفريق القانوني ولا يغني عن المراجعة والاعتماد النهائين من المحامي المترخص.`)
      }
    }, 800)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('المساعد القانوني الداخلي الذكي AI Assistant', 'Internal Legal AI Workspace')}
        description={t('تحليل العقود، استخراج المهل والتواريخ، بناء التسلسل الزمني، وتلخيص اللوائح القانونية', 'Smart document Q&A, clause extraction & timeline generation')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-white border-border space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink block">{t('اختر المستند المراد تحليله', 'Select Target Document')}</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-navy"
              >
                {docs.map((d: Doc) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink block">{t('أوامر التحليل السريع', 'Quick Analysis Actions')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPrompt(qa.query)
                      handleExecutePrompt(qa.query)
                    }}
                    className="p-3 rounded-xl border border-border bg-surface hover:border-navy/40 text-start text-xs text-ink font-medium transition-all flex items-center justify-between"
                  >
                    <span>{qa.label}</span>
                    <Sparkles className="size-3.5 text-accent shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-semibold text-ink block">{t('أكتب استفسارك أو طلبك المخصص', 'Custom Prompt / Query')}</label>
              <Textarea
                id="tour-ai-input"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('مثال: استخرج جميع شروط الفسخ والالتزامات الواردة على الطرف الأول...', 'Ask specific questions about the selected document...')}
              />
            </div>

            <Button
              id="tour-ai-run"
              disabled={isLoading || !prompt.trim()}
              onClick={() => handleExecutePrompt(prompt)}
              className="w-full bg-navy text-white hover:bg-navy-light font-bold py-3"
            >
              {isLoading ? (
                <span>{t('جاري التحليل والمعالجة...', 'Analyzing document...')}</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent" />
                  <span>{t('تشغيل الذكاء الاصطناعي', 'Run Legal AI Analysis')}</span>
                </div>
              )}
            </Button>
          </Card>
        </div>

        {/* Right Column: AI Output & Guardrails */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white border-border space-y-4 min-h-[400px]">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-accent" />
                <h3 className="font-bold text-ink text-base">{t('مخرجات المساعد الذكي', 'AI Analysis Output')}</h3>
              </div>
              <Badge variant="outline" className="text-[11px]">مستند موثق</Badge>
            </div>

            {isLoading && (
              <div className="py-20 text-center space-y-3">
                <div className="size-8 rounded-full border-2 border-navy border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-ink-muted">{t('يقوم الذكاء الاصطناعي بفحص بنود المستند ومطابقتها...', 'Processing clauses & extracting facts...')}</p>
              </div>
            )}

            {!isLoading && response && (
              <div className="prose prose-sm text-ink leading-relaxed space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-surface border border-border/80 text-xs whitespace-pre-line font-sans">
                  {response}
                </div>
              </div>
            )}

            {!isLoading && !response && (
              <div className="py-24 text-center text-ink-muted text-xs space-y-2">
                <FileText className="size-10 text-border mx-auto" />
                <p>{t('حدد المستند واختر أمر التحليل لعرض النتيجة الموثقة هنا.', 'Select a document and run an action to see grounded output.')}</p>
              </div>
            )}

            <div className="pt-4 border-t border-border text-[11px] text-ink-muted flex items-start gap-2">
              <ShieldCheck className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                {t(
                  'إشعار حوكمة: جميع نتائج الذكاء الاصطناعي هي أدوات مساعدة وتتطلب اعتماد المحامي المترخص قبل مشاركتها مع العملاء.',
                  'Governance Note: AI output is assistive only and requires lawyer review.'
                )}
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
