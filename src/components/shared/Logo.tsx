import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Logo({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="size-11 rounded-2xl bg-[#1C2B48] shadow-md border border-[#8EB1D1]/40 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
        <img src="/icons.png" alt="بن نوح للمحاماة" className="w-full h-full object-cover scale-110" />
      </div>
      {!compact && (
        <span className="leading-tight flex flex-col">
          {/* Main Title "بن نوح" */}
          <span className={cn('font-amiri text-xl font-bold tracking-tight', dark ? 'text-white' : 'text-[#1C2B48]')}>
            بن نوح <span className="font-latin text-[#8EB1D1] text-base font-semibold ms-1">Bin Nouh</span>
          </span>
          {/* Subtitle "للمحاماة والاستشارات القانونية" */}
          <span className={cn('font-tajawal text-[10px] font-bold tracking-wider', dark ? 'text-[#C4D8E5]' : 'text-[#527094]')}>
            للمحاماة والاستشارات القانونية
          </span>
        </span>
      )}
    </Link>
  )
}
