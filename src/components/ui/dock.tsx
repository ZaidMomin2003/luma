'use client'
import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DockProps {
  children: React.ReactNode
  className?: string
  direction?: 'top' | 'middle' | 'bottom'
}

interface DockIconProps {
  children: React.ReactNode
  className?: string
}

export function Dock({ children, className, direction = 'middle' }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div className="relative">
      
      <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
          style={{ transformOrigin: 'center center' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-400 rounded-full blur-sm opacity-80" />
        </motion.div>
      </div>

      
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/20 via-transparent to-emerald-500/20 opacity-60" />

      
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          'relative flex h-14 items-end gap-1 rounded-2xl border border-zinc-200/80 bg-white px-3 pb-2.5 shadow-xl shadow-black/10',
          className
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { mouseX })
          }
          return child
        })}
      </motion.div>
    </div>
  )
}

export function DockIcon({ children, className, mouseX }: DockIconProps & { mouseX?: any }) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX ?? useMotionValue(Infinity), (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-120, 0, 120], [40, 56, 40])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 12 })

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className={cn('flex items-center justify-center rounded-full', className)}
    >
      {children}
    </motion.div>
  )
}
