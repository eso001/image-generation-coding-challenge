'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-cyan-300 text-cyan-950 hover:bg-cyan-200 shadow-glow focus-visible:ring-cyan-200 data-[state=loading]:bg-cyan-200',
        ghost: 'bg-white/5 text-slate-200 hover:bg-white/10',
        outline:
          'border border-white/20 bg-transparent text-slate-100 hover:border-white/40 hover:bg-white/5'
      },
      size: {
        default: 'h-12 px-6',
        lg: 'h-14 px-8 text-base',
        sm: 'h-10 px-4 text-xs',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        data-state={loading ? 'loading' : undefined}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
