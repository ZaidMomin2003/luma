'use client'
import * as React from 'react'
import { ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

export type ChartConfig = Record<string, { label: string; color: string }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

export function ChartContainer({ className, config, children, ...props }: ChartContainerProps) {
  const cssVars = Object.entries(config).reduce((acc, [key, value]) => {
    acc[`--color-${key}` as string] = value.color
    return acc
  }, {} as Record<string, string>)

  return (
    <div className={cn('w-full', className)} style={cssVars as React.CSSProperties} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function ChartTooltip(props: any) {
  return <Tooltip {...props} />
}

export function ChartTooltipContent({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-background p-2 text-xs shadow-md', className)}>
      <p className="text-muted-foreground">Data point</p>
    </div>
  )
}
