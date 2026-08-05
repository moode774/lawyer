import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Send } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { PageHeader } from '../../components/ui/page-header'
import { listMyMessages, sendMyPortalMessage } from '../../lib/portal'

export default function PortalMessagesPage() {
  const [text, setText] = useState('')
  const qc = useQueryClient()
  const { data: messages = [], isLoading, error } = useQuery({ queryKey: ['portal','messages'], queryFn: listMyMessages })
  const send = useMutation({ mutationFn: () => sendMyPortalMessage(text), onSuccess: () => { setText(''); void qc.invalidateQueries({queryKey:['portal','messages']}) } })
  return <div className="space-y-6 pb-12"><PageHeader title="مراسلات الحساب" description="قناة آمنة مرتبطة بملف العميل" />
    <Card className="mx-auto max-w-3xl space-y-6 bg-white p-6"><div className="max-h-96 space-y-3 overflow-y-auto p-2">
      {isLoading ? <p>جاري التحميل...</p> : error ? <p className="text-danger">{(error as Error).message}</p> : messages.length===0 ? <div className="py-14 text-center"><MessageSquare className="mx-auto mb-3 size-8 text-[#9CB1C0]"/><p className="font-bold">ابدأ مراسلة جديدة</p></div> : messages.map(m => <div key={m.id} className={`max-w-md rounded-2xl p-4 text-xs ${m.direction==='inbound'?'ms-auto bg-navy text-white':'me-auto border bg-surface text-ink'}`}><p className="leading-6">{m.body}</p><div className="mt-1 text-[10px] opacity-70">{new Date(m.createdAt).toLocaleString('ar-SA')}</div></div>)}
    </div><form onSubmit={e=>{e.preventDefault();if(text.trim())send.mutate()}} className="flex gap-2 border-t pt-4"><Input value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب رسالتك..."/><Button disabled={send.isPending} className="bg-navy text-white"><Send className="size-4"/></Button></form>{send.error && <p className="text-xs text-danger">{(send.error as Error).message}</p>}</Card>
  </div>
}
