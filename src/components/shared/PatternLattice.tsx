import React from 'react'
import { cn } from '../../lib/utils'

export function PatternLattice({
  className,
  opacity = 0.07,
  color = 'currentColor'
}: {
  className?: string
  opacity?: number
  color?: string
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} style={{ opacity }}>
      <svg className="h-full w-full text-current" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bin-nouh-lattice-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Bin Nouh Geometric Pattern Lines */}
            <path
              d="M60 0 L120 34.64 L120 103.92 L60 138.56 L0 103.92 L0 34.64 Z M60 0 L60 138.56 M0 34.64 L120 103.92 M0 103.92 L120 34.64 M30 17.32 L90 121.24 M90 17.32 L30 121.24 M0 69.28 L120 69.28"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="60" cy="69.28" r="8" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bin-nouh-lattice-pattern)" />
      </svg>
    </div>
  )
}
