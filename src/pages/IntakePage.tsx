import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Building2,
  User,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Upload,
  Phone,
  Video,
  Building,
  FileCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { store } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'
import { useSEO } from '../lib/seo'

export default function IntakePage() {
  const { t, isRTL } = useT()
  const navigate = useNavigate()
  useSEO({ title: 'التقييم والطلب القانوني الذكي | ' + t('مكتب المحاماة', 'Law Firm') })

  const [step, setStep] = useState(1)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  // Form State
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual')
  const [category, setCategory] = useState<string>(DEMO_SERVICES[0]?.titleAr || 'استشارات الشركات')
  const [details, setDetails] = useState('')
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [preferredType, setPreferredType] = useState<'office' | 'phone' | 'video'>('video')
  const [preferredDate, setPreferredDate] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleNext = () => {
    setErrorMsg('')
    if (step === 1 && !category) {
      setErrorMsg(t('يرجى اختيار التصنيف القانوني', 'Please select a legal category'))
      return
    }
    if (step === 2 && !details.trim()) {
      setErrorMsg(t('يرجى كتابة ملخص الطلب أو التفاصيل', 'Please provide details of your legal request'))
      return
    }
    if (step === 3) {
      if (!name.trim() || !phone.trim() || !email.trim()) {
        setErrorMsg(t('يرجى كتابة الاسم ورقم الجوال والبريد الإلكتروني', 'Please enter your name, phone, and email'))
        return
      }
    }
    setStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    track('intake_completed', { category, clientType, preferredType })

    // Create lead in store
    const newLead = store.addLead({
      name,
      phone,
      email,
      company: clientType === 'company' ? companyName : undefined,
      type: clientType,
      category,
      source: 'الموقع الإلكتروني - النموذج الذكي',
      status: 'new',
      notes: `تفاصيل الطلب: ${details} | طريقة الاستشارة المفضلة: ${preferredType} | التاريخ المفضّل: ${preferredDate || 'غير محدد'} | مستوى الأهمية: ${urgency}`,
      consultationType: preferredType,
      preferredDate: preferredDate || undefined
    })

    setSubmittedRef(newLead.ref)
  }

  if (submittedRef) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 font-tajawal min-h-[80vh] flex items-center">
        <Card className="p-8 sm:p-12 text-center space-y-6 bg-white shadow-xl border border-[#C4D8E5] rounded-3xl w-full">
          <div className="size-20 bg-[#E8ECEF] text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>

          <div className="space-y-3">
            <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-sm px-4 py-1.5 border-none shadow-sm">
              {t('تم استلام طلبك بنجاح', 'Request Received Successfully')}
            </Badge>
            <h1 className="font-amiri text-3xl font-bold text-[#1C2B48]">
              {t('رقم مرجع الطلب:', 'Request Reference Number:')} <span className="font-mono text-[#8EB1D1]">{submittedRef}</span>
            </h1>
            <p className="text-[#527094] text-base max-w-lg mx-auto leading-relaxed">
              {t(
                'تم تسجيل طلبك وتوجيهه فورًا إلى الفريق القانوني المخصص. سنقوم بالتواصل معك عبر الهاتف والواتساب خلال وقت قصير.',
                'Your request has been routed to our legal team. We will contact you via WhatsApp and phone shortly.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#E8ECEF]/70 border border-[#C4D8E5] text-start space-y-3 max-w-md mx-auto text-sm font-tajawal">
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('التصنيف القانوني:', 'Category:')}</span>
              <span className="font-bold text-[#1C2B48]">{category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('صاحب الطلب:', 'Applicant:')}</span>
              <span className="font-bold text-[#1C2B48]">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('طريقة التواصل المفضلة:', 'Preferred Format:')}</span>
              <span className="font-bold text-[#1C2B48]">
                {preferredType === 'video' ? 'مرئية (Zoom)' : preferredType === 'office' ? 'حضورية بالمكتب' : 'مكالمة هاتفية'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Link to="/">
              <Button size="lg" variant="accent" className="font-bold px-8 rounded-2xl">
                {t('العودة للرئيسية', 'Return to Home')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 font-tajawal min-h-[85vh]">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs px-4 py-1.5 border-none shadow-sm">
          <Sparkles className="size-3.5 me-1.5 inline text-[#1C2B48]" />
          {t('نظام التقييم القانوني الذكي', 'Intelligent Legal Intake System')}
        </Badge>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#1C2B48] leading-tight">
          {t('ابدأ طلبك القانوني واستلم التوصية المبدئية', 'Start Your Legal Request')}
        </h1>
        <p className="text-[#527094] text-base max-w-xl mx-auto leading-relaxed">
          {t('حدد طبيعة قضيتك أو استشارتك ليتم توجيهك إلى المحامي المختص مباشرة وبمنتهى السرية.', 'Identify your legal scenario to route your case securely to the right expert.')}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10 font-tajawal">
        <div className="flex items-center justify-between text-xs font-bold text-[#527094] mb-2">
          <span>{t('الخطوة', 'Step')} {step} {t('من', 'of')} 5</span>
          <span className="font-mono text-[#1C2B48]">{Math.round((step / 5) * 100)}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#E8ECEF] rounded-full overflow-hidden border border-[#C4D8E5]/50">
          <div
            className="h-full bg-[#1C2B48] transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Box */}
      <Card className="p-6 sm:p-10 shadow-xl border border-[#C4D8E5] bg-white rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-8 font-tajawal">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 font-bold">
              <AlertCircle className="size-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CLIENT TYPE & CATEGORY */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('الصفة القانونية للطلب', 'Applicant Identity')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setClientType('individual')}
                    className={cn(
                      'p-5 rounded-2xl border text-start flex items-center gap-4 transition-all cursor-pointer font-bold',
                      clientType === 'individual'
                        ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md'
                        : 'border-[#C4D8E5] bg-[#E8ECEF]/40 text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <User className="size-6 text-[#8EB1D1]" />
                    <div>
                      <div className="text-sm font-bold">{t('فرد / شخصي', 'Individual')}</div>
                      <div className={cn('text-xs font-normal mt-0.5', clientType === 'individual' ? 'text-[#C4D8E5]' : 'text-[#527094]')}>
                        {t('قضايا شخصية أو استشارات فردية', 'Personal legal matters')}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClientType('company')}
                    className={cn(
                      'p-5 rounded-2xl border text-start flex items-center gap-4 transition-all cursor-pointer font-bold',
                      clientType === 'company'
                        ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md'
                        : 'border-[#C4D8E5] bg-[#E8ECEF]/40 text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Building2 className="size-6 text-[#8EB1D1]" />
                    <div>
                      <div className="text-sm font-bold">{t('شركة / منشأة', 'Company / Entity')}</div>
                      <div className={cn('text-xs font-normal mt-0.5', clientType === 'company' ? 'text-[#C4D8E5]' : 'text-[#527094]')}>
                        {t('عقود تجارية، حوكمة، منازعات', 'Corporate advisory & contracts')}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('اختر المجال القانوني الرئيسي', 'Select Legal Field')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCategory(s.titleAr)}
                      className={cn(
                        'p-4 rounded-2xl border text-start transition-all flex items-center justify-between cursor-pointer font-bold',
                        category === s.titleAr
                          ? 'border-[#8EB1D1] bg-[#1C2B48] text-white shadow-sm'
                          : 'border-[#C4D8E5] bg-white text-[#527094] hover:bg-[#E8ECEF]'
                      )}
                    >
                      <span className="text-xs sm:text-sm">{s.titleAr}</span>
                      {category === s.titleAr && <CheckCircle2 className="size-4 text-[#8EB1D1]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS & URGENCY */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('تفاصيل الموضوع أو القضية بالتفصيل', 'Case Details')}</label>
                <Textarea
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="border-[#C4D8E5] rounded-2xl"
                  placeholder={t('اكتب شرحًا ملخصًا للوقائع، التواريخ المهمة، والمطالب المرغوبة...', 'Provide a summary...')}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('درجة الاستعجال', 'Urgency Level')}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold',
                      urgency === 'normal' ? 'border-[#1C2B48] bg-[#1C2B48] text-white' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    {t('عادي (خلال 24 ساعة)', 'Normal')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all cursor-pointer font-bold',
                      urgency === 'urgent' ? 'border-amber-600 bg-amber-600 text-white' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    {t('عاجل جداً (جلسة قريبة / مهلة ختامية)', 'Urgent')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT INFO */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn font-tajawal">
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1C2B48]">{t('الاسم الكامل', 'Full Name')}</span>
                  <Input required value={name} onChange={(e) => setName(e.target.value)} className="border-[#C4D8E5] rounded-xl" placeholder={t('أدخل اسمك', 'Full Name')} />
                </div>

                {clientType === 'company' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48]">{t('اسم الشركة / الكيان', 'Company Name')}</span>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="border-[#C4D8E5] rounded-xl" placeholder={t('شركة ... المحدودة', 'Company Name')} />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48]">{t('رقم الجوال للتواصل والواتساب', 'Mobile Number')}</span>
                    <Input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-[#C4D8E5] rounded-xl font-mono" placeholder="05XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48]">{t('البريد الإلكتروني', 'Email')}</span>
                    <Input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="border-[#C4D8E5] rounded-xl font-mono" placeholder="name@domain.com" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERRED MEETING & FILE UPLOAD */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn font-tajawal">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('طريقة الانعقاد المفضلة', 'Preferred Format')}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredType('video')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      preferredType === 'video' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Video className="size-6" />
                    <span className="text-xs sm:text-sm">{t('مرئية (Zoom)', 'Video')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredType('office')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      preferredType === 'office' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Building className="size-6" />
                    <span className="text-xs sm:text-sm">{t('حضورية بالمكتب', 'In Office')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredType('phone')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      preferredType === 'phone' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Phone className="size-6" />
                    <span className="text-xs sm:text-sm">{t('هاتفية', 'Phone')}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">{t('إرفاق المستندات المبدئية (اختياري)', 'Attach Documents')}</label>
                <div className="border-2 border-dashed border-[#C4D8E5] rounded-2xl p-6 text-center bg-[#E8ECEF]/40 space-y-2">
                  <Upload className="size-8 text-[#8EB1D1] mx-auto" />
                  <p className="text-xs font-bold text-[#1C2B48]">{t('اسحب الملفات هنا أو اضغط للاستعراض', 'Drag & drop files or click to upload')}</p>
                  <p className="text-[11px] text-[#527094] font-mono">PDF, DOCX, PNG (Max 15MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL CONFIRMATION */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn font-tajawal">
              <h3 className="font-amiri text-2xl font-bold text-[#1C2B48]">{t('مراجعة وتأكيد الطلب القانوني', 'Review Your Request')}</h3>

              <div className="p-6 rounded-2xl bg-[#E8ECEF]/60 border border-[#C4D8E5] space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[#527094]">{t('الصفة والتصنيف:', 'Identity & Category:')}</span>
                  <span className="font-bold text-[#1C2B48]">{clientType === 'company' ? 'شركة / منشأة' : 'فرد'} — {category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#527094]">{t('صاحب الطلب:', 'Name:')}</span>
                  <span className="font-bold text-[#1C2B48]">{name} ({phone})</span>
                </div>
                <div className="pt-2 border-t border-[#C4D8E5]/60">
                  <span className="font-bold text-[#1C2B48] block mb-1">{t('شرح الموضوع:', 'Details:')}</span>
                  <p className="text-[#527094] line-clamp-3 leading-relaxed">{details}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C2B48] text-white space-y-2 text-xs border border-[#8EB1D1]/30">
                <div className="flex items-center gap-2 font-bold text-[#8EB1D1]">
                  <ShieldAlert className="size-4" />
                  <span>{t('إقرار وتعهد بالسرية التامة', 'Confidentiality Guarantee')}</span>
                </div>
                <p className="text-[#C4D8E5] leading-relaxed">
                  {t(
                    'جميع البيانات والمعلومات المدخلة مشمولة بالسرية المهنية المطلقة لمكتب المحاماة وفقًا للأنظمة السعودية الصادرة عن وزارة العدل وهيئة المحامين.',
                    'All provided information remains strictly confidential under Saudi Bar Association rules.'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#C4D8E5] font-tajawal">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrev} className="gap-2 rounded-xl font-bold">
                <ArrowRight className={cn('size-4', !isRTL && 'rotate-180')} />
                <span>{t('السابق', 'Previous')}</span>
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button type="button" variant="accent" onClick={handleNext} className="gap-2 px-8 rounded-xl font-bold">
                <span>{t('التالي', 'Next')}</span>
                <ArrowLeft className={cn('size-4', !isRTL && 'rotate-180')} />
              </Button>
            ) : (
              <Button type="submit" variant="accent" size="lg" className="font-bold text-base px-8 py-4 rounded-2xl shadow-lg">
                <FileCheck className="size-5 me-2" />
                {t('إرسال الطلب واعتماده', 'Submit Request')}
              </Button>
            )}
          </div>

        </form>
      </Card>
    </div>
  )
}
