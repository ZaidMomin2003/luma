'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProviderProps {
  children: React.ReactNode
}

interface TooltipProps {
  children: React.ReactNode
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

const TooltipContext = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
}>({ open: false, setOpen: () => {} })

export function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>
}

export function Tooltip({ children }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { setOpen } = React.useContext(TooltipContext)
  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
    </div>
  )
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  const { open } = React.useContext(TooltipContext)
  if (!open) return null
  return (
    <div className={cn(
      'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-[#1a1a1c] border border-white/[0.08] text-xs text-foreground whitespace-nowrap shadow-lg z-50',
      className
    )}>
      {children}
    </div>
  )
}
