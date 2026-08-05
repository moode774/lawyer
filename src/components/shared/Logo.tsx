import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Logo({ dark, compact }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center shrink-0 group" aria-label="Bin Nouh - Home">
      <img
        src="/icon11.webp"
        alt="شعار مكتب بن نوح للمحاماة والاستشارات القانونية"
        className={cn(
          "w-auto object-contain transition-transform group-hover:scale-105",
          compact ? "h-8 max-w-[140px]" : "h-10 lg:h-12 max-w-[200px]",
          dark && "brightness-0 invert"
        )}
      />
    </Link>
  )
}

