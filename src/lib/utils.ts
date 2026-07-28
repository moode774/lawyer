import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...opts,
  }).format(new Date(iso))
}

export function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function formatTime(time: string) {
  // "14:30" -> "2:30 م"
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'م' : 'ص'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPhone(phone: string) {
  return phone.replace(/(\+966)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'الآن'
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  if (days < 30) return `منذ ${days} يوم`
  return formatDateShort(iso)
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}
