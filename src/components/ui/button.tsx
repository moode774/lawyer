import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-[#1C2B48] text-white hover:bg-[#283d63] shadow-md hover:shadow-lg',
        primary: 'bg-[#1C2B48] text-white hover:bg-[#283d63] shadow-md hover:shadow-lg',
        accent: 'bg-[#8EB1D1] text-[#1C2B48] hover:bg-[#A7C7E7] font-bold shadow-md hover:shadow-lg',
        secondary: 'bg-[#E8ECEF] text-[#1C2B48] hover:bg-[#C4D8E5]',
        outline: 'border border-[#C4D8E5] bg-white text-[#1C2B48] hover:bg-[#E8ECEF]',
        ghost: 'text-[#2a3e5c] hover:bg-[#E8ECEF] hover:text-[#1C2B48]',
        danger: 'bg-rose-600 text-white hover:bg-rose-700',
        link: 'text-[#1C2B48] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-base font-bold rounded-2xl',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'
