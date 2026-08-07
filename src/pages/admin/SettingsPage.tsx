import React, { useState } from 'react'
import { Settings, MessageSquare, Mail, Calendar, Webhook, CheckCircle2, Save, Sparkles, Sliders, PlayCircle } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { useTour } from '../../components/ui/premium-tour'
import { store } from '../../lib/store'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { PageHeader } from '../../components/ui/page-header'
import { Tabs } from '../../components/ui/tabs'
import { useSEO } from '../../lib/seo'

export default function SettingsPage() {
  const { t } = useT()
  useSEO({ title: 'إعدادات المنصة والأتمتة | ' + t('مكتب المحاماة', 'Law Firm') })

  const [settings, setSettings] = useState(store.getAutomationSettings())
  const [isSaved, setIsSaved] = useState(false)
  const { startTour, isActive } = useTour()

  const handleSave = () => {
    store.updateAutomationSettings(settings)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('إعدادات المنصة وقنوات الأتمتة', 'Automation & System Settings')}
        description={t('تهيئة ربط الواتساب، التنبيهات، الويب هوك n8n، ومواعيد العمل', 'Configure WhatsApp Business API, Email, Webhooks & working hours')}
        action={
          <Button id="tour-settings-save" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
            <Save className="size-4" />
            <span>{t('حفظ الإعدادات', 'Save Settings')}</span>
          </Button>
        }
      />

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          <span>{t('تم حفظ وتطبيق كافة الإعدادات بنجاح', 'Settings saved successfully')}</span>
        </div>
      )}

      <Tabs
        tabs={[
          {
            id: 'whatsapp',
            label: 'ربط أتمتة الواتساب (WhatsApp Cloud API)',
            content: (
              <Card className="p-6 bg-white border-border space-y-6 mt-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-bold text-ink text-base">{t('قناة أتمتة الواتساب التجارية', 'WhatsApp Automation')}</h3>
                    <p className="text-xs text-ink-muted">{t('إرسال إشعارات وتأكيدات آليًا للعملاء فور تسجيل الطلبات أو المواعيد', 'Send automated confirmations')}</p>
                  </div>
                  <Switch
                    id="tour-settings-whatsapp-switch"
                    checked={settings.whatsappEnabled}
                    onCheckedChange={(val) => setSettings({ ...settings, whatsappEnabled: val })}
                  />
                </div>

                <div className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-ink block">{t('قالب إشعار الطلب الجديد (Lead Created Template)', 'Lead Created Template')}</label>
                    <Textarea
                      rows={3}
                      value={settings.leadCreatedTemplate}
                      onChange={(e) => setSettings({ ...settings, leadCreatedTemplate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-ink block">{t('قالب تأكيد الاستشارة (Booking Confirmed Template)', 'Booking Confirmed Template')}</label>
                    <Textarea
                      rows={3}
                      value={settings.bookingConfirmedTemplate}
                      onChange={(e) => setSettings({ ...settings, bookingConfirmedTemplate: e.target.value })}
                    />
                  </div>
                </div>
              </Card>
            )
          },
          {
            id: 'email',
            label: 'أتمتة البريد الإلكتروني (Email Provider)',
            content: (
              <Card className="p-6 bg-white border-border space-y-6 mt-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-bold text-ink text-base">{t('مزود خدمات البريد (Resend / SMTP)', 'Email Automation')}</h3>
                    <p className="text-xs text-ink-muted">{t('إرسال تأكيدات المواعيد والفواتير إلكترونيًا', 'Send email confirmations')}</p>
                  </div>
                  <Switch
                    id="tour-settings-email-switch"
                    checked={settings.emailEnabled}
                    onCheckedChange={(val) => setSettings({ ...settings, emailEnabled: val })}
                  />
                </div>
              </Card>
            )
          },
          {
            id: 'n8n',
            label: 'محرك الربط الخارجي (n8n Webhooks)',
            content: (
              <Card className="p-6 bg-white border-border space-y-6 mt-4">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-bold text-ink text-base">{t('مسارات سير العمل الخارجية n8n Integrations', 'n8n Webhook Triggers')}</h3>
                    <p className="text-xs text-ink-muted">{t('إرسال أحداث النظام تلقائيًا للأنظمة الخارجية', 'Send event hooks to external workflows')}</p>
                  </div>
                  <Switch
                    id="tour-settings-n8n-switch"
                    checked={settings.n8nEnabled}
                    onCheckedChange={(val) => setSettings({ ...settings, n8nEnabled: val })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink block">Webhook Endpoint URL</label>
                  <Input
                    dir="ltr"
                    value={settings.n8nWebhookUrl}
                    onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
                    placeholder="https://n8n.yourfirm.com/webhook/lead-event"
                  />
                </div>
              </Card>
            )
          },
          {
            id: 'tour',
            label: 'نظام الجولة الإرشادية (Onboarding)',
            content: (
              <Card className="p-6 bg-white border-border space-y-6 mt-4">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="font-bold text-ink text-base">{t('الجولة الإرشادية التفاعلية (Product Tour)', 'Interactive Product Tour')}</h3>
                    <p className="text-xs text-ink-muted mt-1">{t('شرح تفاعلي خطوة بخطوة لأهم عناصر لوحة التحكم، مع تأثيرات مرئية متقدمة لتسهيل فهم النظام للموظفين الجدد.', 'A step-by-step interactive explanation of the control panel.')}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 bg-[#f8fafc] p-4 rounded-xl border border-dashed border-[#C4D8E5]">
                  <p className="text-sm text-ink-muted font-medium">يمكنك إعادة تشغيل الجولة الإرشادية في أي وقت من هنا. ستظهر التلميحات الذكية لتشرح الأزرار والواجهات.</p>
                  <Button 
                    id="tour-settings-restart-tour"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      startTour()
                    }} 
                    disabled={isActive}
                    className="bg-[#1C2B48] hover:bg-[#283d63] text-white font-bold w-fit gap-2 rounded-xl"
                  >
                    <PlayCircle className="size-4" />
                    <span>{isActive ? 'الجولة قيد التشغيل حالياً...' : 'إعادة تشغيل الجولة الإرشادية'}</span>
                  </Button>
                </div>
              </Card>
            )
          }
        ]}
      />
    </div>
  )
}
