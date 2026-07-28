import { cn } from '../../lib/utils'

interface SwitchProps {
  checked: boolean
  onChange?: (v: boolean) => void
  onCheckedChange?: (v: boolean) => void
  label?: string
  disabled?: boolean
}

export function Switch({ checked, onChange, onCheckedChange, label, disabled }: SwitchProps) {
  const handleClick = () => {
    const next = !checked
    if (onChange) onChange(next)
    if (onCheckedChange) onCheckedChange(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-navy' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
          checked ? 'start-[calc(100%-1.375rem)]' : 'start-0.5',
        )}
      />
    </button>
  )
}
