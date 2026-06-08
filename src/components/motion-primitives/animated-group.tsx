'use client'
import { motion, type Variants } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedGroupProps {
  children: React.ReactNode
  className?: string
  variants?: Record<string, any>
}

export function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  const containerVariants: Variants = variants?.container ?? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = variants?.item ?? {
    hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', bounce: 0.3, duration: 1.5 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
