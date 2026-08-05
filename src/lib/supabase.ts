import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrmcpwlibolyxrpbikpu.supabase.co'
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

/**
 * مفتاح غير مضبوط في بيئة النشر لا يجوز أن يُسقط الموقع العام.
 *
 * ‏createClient يرمي "supabaseKey is required" عند تمرير مفتاح فارغ، وهذا الخطأ
 * يقع أثناء تحميل الوحدة قبل إقلاع React — فتظهر صفحة بيضاء تمامًا في كل الموقع.
 * لذلك نمرّر قيمة نائبة تُبقي الصفحات التعريفية تعمل، وتفشل طلبات البيانات وحدها
 * برسالة واضحة بدل انهيار شامل.
 */
export const isSupabaseConfigured = supabaseAnonKey.length > 0

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] المتغير VITE_SUPABASE_ANON_KEY غير مضبوط في بيئة البناء. ' +
      'الصفحات التعريفية ستعمل، لكن النماذج وتسجيل الدخول لن تعمل حتى يُضبط المتغير.'
  )
}

export const supabase = createClient(supabaseUrl, isSupabaseConfigured ? supabaseAnonKey : 'anon-key-not-configured')
