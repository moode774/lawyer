import { cn, initials } from '../../lib/utils'

interface AvatarProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'h-7 w-7 text-2xs', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm' }

export function Avatar({ name, color = '#3a5b7a', size = 'md', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizes[size],
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
