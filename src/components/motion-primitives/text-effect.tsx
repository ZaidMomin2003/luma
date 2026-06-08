'use client'
import { motion, type Variants } from 'framer-motion'
import React from 'react'
import { cn } from '@/lib/utils'

interface TextEffectProps {
  children: string
  as?: React.ElementType
  className?: string
  preset?: 'fade-in-blur' | 'fade' | 'slide'
  per?: 'word' | 'char' | 'line'
  speedSegment?: number
  delay?: number
}

export function TextEffect({
  children,
  as: Component = 'p',
  className,
  preset = 'fade-in-blur',
  per = 'word',
  speedSegment = 0.3,
  delay = 0,
}: TextEffectProps) {
  const segments = per === 'line' ? children.split('\n') : per === 'char' ? children.split('') : children.split(' ')

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: preset === 'fade-in-blur' ? 'blur(8px)' : 'blur(0px)',
      y: preset === 'slide' ? 10 : 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        delay: delay + i * speedSegment * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  }

  return (
    <Component className={cn(className)}>
      {segments.map((segment, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={variants}
          className="inline-block"
        >
          {segment}
          {per !== 'char' && i < segments.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Component>
  )
}
