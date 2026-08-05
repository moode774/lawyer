import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  Users,
  Folder,
  Calendar,
  ClipboardCheck,
  Plus,
  UserPlus,
  ChevronLeft,
  Inbox,
  CheckCircle2,
  Activity as ActivityIcon
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { useSEO } from '../../lib/seo'
import { listAppointments, listLeads, store } from '../../lib/store'
import type { Appointment, Client, Lead, Matter, Task, Activity } from '../../types'

export default function DashboardPage() {
  const { t } = useT()
  useSEO({ title: 'مركز العمليات | ' + BRAND.nameAr })

  // Live Dynamic Data Queries from Store
  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ['leads'], queryFn: listLeads })
  const { data: clients = [] } = useQuery<Client[]>({ queryKey: ['clients'], queryFn: () => store.getClients() })
  const { data: matters = [] } = useQuery<Matter[]>({ queryKey: ['matters'], queryFn: () => store.getMatters() })
  const { data: appointments = [] } = useQuery<Appointment[]>({ queryKey: ['appointments'], queryFn: () => listAppointments() })
  const { data: tasks = [] } = useQuery<Task[]>({ queryKey: ['tasks'], queryFn: () => store.getTasks() })
  const { data: activities = [] } = useQuery<Activity[]>({ queryKey: ['activities'], queryFn: () => store.getActivities() })

  // Calculated Metrics
  const completedAppointmentsCount = appointments.filter((a: Appointment) => a.status === 'completed').length
  const activeMattersCount = matters.filter((m: Matter) => m.status === 'active').length
  const conversionRate = leads.length > 0 ? Math.round((clients.length / leads.length) * 100) : 0

  return (
    <div className="space-y-6 pb-12 font-tajawal">
      
      {/* 1. HERO GREETING BANNER WITH FULL IMAGE BACKGROUND */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#d6e3ee] shadow-sm min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10">
        {/* Full Banner Image Background - Sharp & Native */}
        <img
          src="/hero-banner.webp"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Content Container Layer - Text on RIGHT, Button on LEFT in RTL */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 w-full">
          
          {/* Right Side (RTL): Date Badge, Title & Description */}
          <div className="space-y-3 max-w-2xl text-right">
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-xs px-4 py-1.5 text-xs font-bold text-[#527094] border border-[#d6e3ee] shadow-2xs">
                <Calendar className="size-4 text-[#8EB1D1]" />
                <span className="font-mono">
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <h1 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2B48] leading-tight text-right">
              صباح الخير أستاذ بن نوح المحامي
            </h1>

            <p className="text-[#527094] text-xs sm:text-sm leading-relaxed font-medium text-right">
              لديك {appointments.length} استشارة محجوزة، {tasks.length} مهام قيد التنفيذ و {leads.length} طلبات جديدة تتطلب إجراء.
            </p>
          </div>

          {/* Left Side (RTL): Action Button */}
          <div className="flex items-center gap-5 shrink-0">
            <Link to="/admin/matters">
              <Button className="bg-[#1C2B48] hover:bg-[#283d63] text-white font-bold px-7 py-3.5 rounded-full shadow-lg flex items-center gap-2 text-sm transition-all cursor-pointer border border-[#8EB1D1]/30">
                <Plus className="size-4" />
                <span>إضافة قضية جديدة</span>
              </Button>
            </Link>
          </div>

        </div>
      </div>

      {/* 2. METRICS ROW (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">الطلبات الجديدة (هذا الشهر)</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <UserPlus className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">{leads.length}</h3>
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>▲ بيانات حية محدثة</span>
            </p>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">الاستشارات المكتملة</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <ClipboardCheck className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">{completedAppointmentsCount}</h3>
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>▲ استشارات مكتملة</span>
            </p>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">القضايا والملفات النشطة</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <Folder className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">{activeMattersCount}</h3>
            <p className="text-[11px] font-bold text-[#527094]">
              {matters.length} إجمالي الملفات المسجلة
            </p>
          </div>
        </Card>

        {/* Card 4 */}
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-4 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">معدل تحويل الاستشارات</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">{conversionRate}%</h3>
            <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>معدل التحويل للعملاء</span>
            </p>
          </div>
        </Card>

      </div>

      {/* 3. MIDDLE SECTION (APPOINTMENTS & URGENT TASKS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Appointments Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-5 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="size-5 text-[#1C2B48]" />
                <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">استشارات اليوم والمواعيد القادمة</h3>
              </div>
              <Link to="/admin/bookings" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1">
                <span>عرض جميع المواعيد</span>
                <ChevronLeft className="size-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#f8fafc] rounded-2xl border border-dashed border-[#C4D8E5]">
                  <Calendar className="size-8 text-[#8EB1D1] mx-auto" />
                  <p className="text-xs font-bold text-[#527094]">لا توجد استشارات أو مواعيد مجدولة حالياً</p>
                  <Link to="/admin/bookings">
                    <Button variant="outline" className="text-xs font-bold border-[#1C2B48] text-[#1C2B48] rounded-full px-4 py-1.5 mt-2">
                      + حجز موعد جديد
                    </Button>
                  </Link>
                </div>
              ) : (
                appointments.slice(0, 4).map((apt: Appointment) => (
                  <div key={apt.id} className="p-4 rounded-2xl bg-[#f8fafc] border border-[#C4D8E5]/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-[#8EB1D1]" />
                      <div>
                        <h4 className="font-bold text-[#1C2B48] text-xs sm:text-sm">{apt.name || apt.category || 'استشارة قانونية'}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#1C2B48]">{apt.time || '10:00 ص'}</span>
                      <Badge className="bg-[#E8ECEF] text-[#1C2B48] border-none font-bold text-xs">{apt.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Urgent Tasks Column */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-5 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
              <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">المهام العاجلة والمتابعات</h3>
              <Link to="/admin/tasks" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1]">
                عرض الكل
              </Link>
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#f8fafc] rounded-2xl border border-dashed border-[#C4D8E5]">
                  <CheckCircle2 className="size-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-[#527094]">لا توجد مهام عاجلة قائمة</p>
                  <Link to="/admin/tasks">
                    <Button variant="outline" className="text-xs font-bold border-[#1C2B48] text-[#1C2B48] rounded-full px-4 py-1.5 mt-2">
                      + إضافة مهمة
                    </Button>
                  </Link>
                </div>
              ) : (
                tasks.slice(0, 4).map((task: Task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs font-bold py-1">
                    <div className="flex items-center gap-3">
                      <div className="size-2.5 rounded-full bg-rose-600" />
                      <span className="text-[#1C2B48]">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-rose-100 text-rose-800 border-none text-[11px] font-bold">{task.priority || 'عاجل'}</Badge>
                      <span className="font-mono text-[#527094]">{task.dueDate || 'اليوم'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#C4D8E5]/50">
              <Link to="/admin/tasks" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1">
                <span>عرض جميع المهام</span>
                <ChevronLeft className="size-4" />
              </Link>
            </div>
          </Card>
        </div>

      </div>

      {/* 4. BOTTOM SECTION (LEAD INQUIRIES & RECENT ACTIVITIES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latest Leads Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 space-y-5 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="size-5 text-[#1C2B48]" />
                <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">أحدث استفسارات العملاء المحتملين</h3>
              </div>
              <Link to="/admin/leads" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1">
                <span>عرض جميع الاستفسارات</span>
                <ChevronLeft className="size-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {leads.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#f8fafc] rounded-2xl border border-dashed border-[#C4D8E5]">
                  <Inbox className="size-8 text-[#8EB1D1] mx-auto" />
                  <p className="text-xs font-bold text-[#527094]">لا توجد استفسارات جديدة حتى الآن</p>
                  <Link to="/admin/leads">
                    <Button variant="outline" className="text-xs font-bold border-[#1C2B48] text-[#1C2B48] rounded-full px-4 py-1.5 mt-2">
                      + إضافة طلب يدوي
                    </Button>
                  </Link>
                </div>
              ) : (
                leads.slice(0, 3).map((lead: Lead) => (
                  <div key={lead.id} className="p-3.5 rounded-2xl bg-[#f8fafc] border border-[#C4D8E5]/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1C2B48]">{lead.name}</span>
                        <Badge className="bg-[#8EB1D1]/30 text-[#1C2B48] border-none font-bold text-[10px]">{lead.category || 'عام'}</Badge>
                      </div>
                      <span className="text-[#527094] text-[11px] font-mono">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('ar-SA') : 'الآن'}</span>
                    </div>
                    <p className="text-[#527094] leading-relaxed">{lead.notes || lead.phone}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Real-time Activity Feed Column */}
        <div className="lg:col-span-5">
          <Card className="p-6 space-y-5 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
              <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">سجل النشاط المباشر</h3>
            </div>

            <div className="space-y-4 text-xs font-bold">
              {activities.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#f8fafc] rounded-2xl border border-dashed border-[#C4D8E5]">
                  <ActivityIcon className="size-8 text-[#8EB1D1] mx-auto" />
                  <p className="text-xs font-bold text-[#527094]">لا يوجد نشاط حديث حتى الآن</p>
                </div>
              ) : (
                activities.slice(0, 4).map((act: Activity) => (
                  <div key={act.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div className="size-2.5 rounded-full bg-[#1C2B48]" />
                      <span className="text-[#1C2B48]">{act.text}</span>
                    </div>
                    <span className="font-mono text-[#527094] text-[11px]">
                      {act.createdAt ? new Date(act.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-[#C4D8E5]/50">
              <Link to="/admin/analytics" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1">
                <span>عرض كل النشاط</span>
                <ChevronLeft className="size-4" />
              </Link>
            </div>
          </Card>
        </div>

      </div>

    </div>
  )
}
