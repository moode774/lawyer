import React, { useState } from 'react'
import { Send, MessageSquare, ShieldCheck } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalMessagesPage() {
  const { t } = useT()
  useSEO({ title: 'المراسلات الآمنة | بوابة العميل' })

  const [messages, setMessages] = useState([
    { id: '1', sender: 'المحامي أ. محمد', text: 'أهلاً بكم. تم المباشرة في صياغة ملحق العقد التجاري وسيتم إرسال المسودة خلال 24 ساعة.', time: '10:30 ص' },
    { id: '2', sender: 'أنت (العميل)', text: 'ممتاز أستاذ محمد، نأمل التأكيد على بند الشروط الجزائية وفترة السداد.', time: '11:15 ص' }
  ])
  const [inputText, setInputText] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return
    setMessages([...messages, { id: Date.now().toString(), sender: 'أنت (العميل)', text: inputText, time: 'الآن' }])
    setInputText('')
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('قناة المراسلات المباشرة', 'Secure Messaging Thread')}
        description={t('تواصل مشفر ومباشر مع الفريق القانوني المخصص لقضيتك', 'Direct communication with assigned legal team')}
      />

      <Card className="p-6 bg-white border-border space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4 max-h-96 overflow-y-auto p-2">
          {messages.map((m) => (
            <div key={m.id} className={`p-4 rounded-2xl text-xs space-y-1 max-w-md ${m.sender.includes('أنت') ? 'ms-auto bg-navy text-white' : 'me-auto bg-surface border border-border text-ink'}`}>
              <div className="font-semibold">{m.sender}</div>
              <p className="leading-relaxed">{m.text}</p>
              <div className="text-[10px] opacity-70 text-end font-mono">{m.time}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="flex gap-2 border-t border-border pt-4">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('اكتب استفسارك للمحامي هنا...', 'Type message...')}
          />
          <Button type="submit" className="bg-navy text-white shrink-0">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
