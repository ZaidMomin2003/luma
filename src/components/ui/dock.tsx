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
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        'flex h-14 items-end gap-1 rounded-2xl border border-white/[0.08] bg-[#111113]/90 px-3 pb-2.5 backdrop-blur-xl shadow-2xl shadow-black/40',
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
